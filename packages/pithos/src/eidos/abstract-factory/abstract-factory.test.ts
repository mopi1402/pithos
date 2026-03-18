import { describe, it, expect } from "vitest";
import {
  type Factory,
  createAbstractFactory,
} from "./abstract-factory";
import { isSome, isNone } from "@zygos/option";

// --- Factory type ---

describe("Factory type", () => {
  it("is a zero-arg function that returns a product record", () => {
    const factory: Factory<{ greet: (name: string) => string }> = () => ({
      greet: (name) => `Hello, ${name}!`,
    });

    const products = factory();
    expect(products.greet("Alice")).toBe("Hello, Alice!");
  });
});

// --- createAbstractFactory ---

describe("createAbstractFactory", () => {
  type UIKit = {
    button: (label: string) => string;
    input: (placeholder: string) => string;
  };

  const ui = createAbstractFactory<"light" | "dark", UIKit>({
    light: () => ({
      button: (label) => `<button class="light">${label}</button>`,
      input: (ph) => `<input class="light" placeholder="${ph}" />`,
    }),
    dark: () => ({
      button: (label) => `<button class="dark">${label}</button>`,
      input: (ph) => `<input class="dark" placeholder="${ph}" />`,
    }),
  });

  it("creates products for a given family", () => {
    const dark = ui.create("dark");

    expect(dark.button("OK")).toBe('<button class="dark">OK</button>');
    expect(dark.input("email")).toBe('<input class="dark" placeholder="email" />');
  });

  it("creates different products per family", () => {
    const light = ui.create("light");
    const dark = ui.create("dark");

    expect(light.button("X")).toBe('<button class="light">X</button>');
    expect(dark.button("X")).toBe('<button class="dark">X</button>');
  });

  it("returns a fresh product record on each create call", () => {
    const a = ui.create("light");
    const b = ui.create("light");

    expect(a).not.toBe(b);
    expect(a.button("X")).toBe(b.button("X"));
  });

  it("returns Some for existing key with get()", () => {
    const result = ui.get("dark");

    expect(isSome(result)).toBe(true);
    if (isSome(result)) {
      const products = result.value();
      expect(products.button("Y")).toBe('<button class="dark">Y</button>');
    }
  });

  it("returns None for unknown key with get()", () => {
    const result = ui.get("neon");

    expect(isNone(result)).toBe(true);
  });

  it("lists all family keys", () => {
    const keys = ui.keys();

    expect(keys).toContain("light");
    expect(keys).toContain("dark");
    expect(keys).toHaveLength(2);
  });

  it("families are swappable at runtime", () => {
    type Formatter = { format: (n: number) => string };

    const formatters = createAbstractFactory<"us" | "eu", Formatter>({
      us: () => ({ format: (n) => n.toLocaleString("en-US") }),
      eu: () => ({ format: (n) => n.toLocaleString("de-DE") }),
    });

    const locale = "eu" as "us" | "eu";
    const fmt = formatters.create(locale);

    expect(fmt.format(1000)).toBe(
      (1000).toLocaleString("de-DE"),
    );
  });
});

// --- intra-family collaboration ---

describe("intra-family collaboration", () => {
  it("products from the same family collaborate via shared closure", () => {
    type Codec = {
      encode: (parts: string[]) => string;
      decode: (raw: string) => string[];
    };

    const codecs = createAbstractFactory<"csv" | "tsv", Codec>({
      csv: () => {
        const sep = ",";
        return {
          encode: (parts) => parts.join(sep),
          decode: (raw) => raw.split(sep),
        };
      },
      tsv: () => {
        const sep = "\t";
        return {
          encode: (parts) => parts.join(sep),
          decode: (raw) => raw.split(sep),
        };
      },
    });

    const csv = codecs.create("csv");
    const tsv = codecs.create("tsv");

    // Round-trip within the same family works
    expect(csv.decode(csv.encode(["a", "b", "c"]))).toEqual(["a", "b", "c"]);
    expect(tsv.decode(tsv.encode(["x", "y"]))).toEqual(["x", "y"]);

    // Cross-family breaks — that's the point of the pattern
    expect(tsv.decode(csv.encode(["a", "b"]))).not.toEqual(["a", "b"]);
  });

  it("composite product uses sibling products from same family", () => {
    type UIKit = {
      button: (label: string) => string;
      input: (placeholder: string) => string;
      renderForm: (action: string) => string;
    };

    const factory = createAbstractFactory<"light" | "dark", UIKit>({
      light: () => {
        const button = (label: string) => `[light:btn:${label}]`;
        const input = (ph: string) => `[light:input:${ph}]`;
        return {
          button,
          input,
          renderForm: (action) => `${input(action)}${button("Go")}`,
        };
      },
      dark: () => {
        const button = (label: string) => `[dark:btn:${label}]`;
        const input = (ph: string) => `[dark:input:${ph}]`;
        return {
          button,
          input,
          renderForm: (action) => `${input(action)}${button("Go")}`,
        };
      },
    });

    const light = factory.create("light");
    const dark = factory.create("dark");

    // renderForm uses button + input from its own family
    expect(light.renderForm("search")).toBe("[light:input:search][light:btn:Go]");
    expect(dark.renderForm("search")).toBe("[dark:input:search][dark:btn:Go]");
  });
});
