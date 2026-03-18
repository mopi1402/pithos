import { describe, it, expect } from "vitest";
import { template, templateWithDefaults } from "./template";

// --- template ---

describe("template", () => {
  it("creates an algorithm from step implementations", () => {
    const processData = template(
      (steps: {
        parse: (raw: string) => number[];
        analyze: (data: number[]) => string;
      }) =>
        (raw: string) => {
          const data = steps.parse(raw);
          return steps.analyze(data);
        },
    );

    const csvProcessor = processData({
      parse: (raw) => raw.split(",").map(Number),
      analyze: (data) => `sum: ${data.reduce((a, b) => a + b, 0)}`,
    });

    expect(csvProcessor("1,2,3")).toBe("sum: 6");
  });

  it("produces different variants with different steps", () => {
    const greet = template(
      (steps: {
        format: (name: string) => string;
        wrap: (greeting: string) => string;
      }) =>
        (name: string) => steps.wrap(steps.format(name)),
    );

    const formal = greet({
      format: (name) => `Dear ${name}`,
      wrap: (g) => `${g}.`,
    });

    const casual = greet({
      format: (name) => `Hey ${name}`,
      wrap: (g) => `${g}!`,
    });

    expect(formal("Alice")).toBe("Dear Alice.");
    expect(casual("Alice")).toBe("Hey Alice!");
  });

  it("works with multi-step algorithms", () => {
    const pipeline = template(
      (steps: {
        validate: (input: string) => boolean;
        transform: (input: string) => string;
        format: (output: string) => string;
      }) =>
        (input: string) => {
          if (!steps.validate(input)) return "invalid";
          const transformed = steps.transform(input);
          return steps.format(transformed);
        },
    );

    const processor = pipeline({
      validate: (s) => s.length > 0,
      transform: (s) => s.toUpperCase(),
      format: (s) => `[${s}]`,
    });

    expect(processor("hello")).toBe("[HELLO]");
    expect(processor("")).toBe("invalid");
  });
});

// --- templateWithDefaults ---

describe("templateWithDefaults", () => {
  it("uses defaults when no overrides provided", () => {
    const report = templateWithDefaults(
      (steps: {
        header: () => string;
        body: (data: string) => string;
        footer: () => string;
      }) =>
        (data: string) =>
          [steps.header(), steps.body(data), steps.footer()].join("\n"),
      {
        header: () => "=== Report ===",
        body: (data) => data,
        footer: () => "=== End ===",
      },
    );

    const defaultReport = report();

    expect(defaultReport("content")).toBe(
      "=== Report ===\ncontent\n=== End ===",
    );
  });

  it("allows partial step overrides", () => {
    const report = templateWithDefaults(
      (steps: {
        header: () => string;
        body: (data: string) => string;
        footer: () => string;
      }) =>
        (data: string) =>
          [steps.header(), steps.body(data), steps.footer()].join("\n"),
      {
        header: () => "=== Report ===",
        body: (data) => data,
        footer: () => "=== End ===",
      },
    );

    const custom = report({ header: () => "** Custom **" });

    expect(custom("content")).toBe("** Custom **\ncontent\n=== End ===");
  });

  it("allows overriding all steps", () => {
    const report = templateWithDefaults(
      (steps: {
        header: () => string;
        body: (data: string) => string;
        footer: () => string;
      }) =>
        (data: string) =>
          [steps.header(), steps.body(data), steps.footer()].join("\n"),
      {
        header: () => "H",
        body: (data) => data,
        footer: () => "F",
      },
    );

    const full = report({
      header: () => "HEAD",
      body: (d) => d.toUpperCase(),
      footer: () => "FOOT",
    });

    expect(full("test")).toBe("HEAD\nTEST\nFOOT");
  });

  it("ignores undefined overrides and keeps defaults", () => {
    const report = templateWithDefaults(
      (steps: {
        header: () => string;
        body: (data: string) => string;
      }) =>
        (data: string) => `${steps.header()}: ${steps.body(data)}`,
      {
        header: () => "Default",
        body: (data) => data,
      },
    );

    const partial = report({ header: () => "Custom", body: undefined });

    expect(partial("test")).toBe("Custom: test");
  });

  it("real-world: data mining template", () => {
    type MiningSteps = {
      extract: (source: string) => string[];
      transform: (records: string[]) => number[];
      summarize: (values: number[]) => string;
    };

    const dataMining = templateWithDefaults(
      (steps: MiningSteps) => (source: string) => {
        const records = steps.extract(source);
        const values = steps.transform(records);
        return steps.summarize(values);
      },
      {
        extract: (source) => source.split(";"),
        transform: (records) => records.map((r) => r.length),
        summarize: (values) =>
          `${values.length} records, avg length: ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}`,
      },
    );

    // Default: counts character lengths
    const defaultMiner = dataMining();
    expect(defaultMiner("ab;cde;f")).toBe("3 records, avg length: 2.0");

    // Override: parse as numbers
    const numericMiner = dataMining({
      transform: (records) => records.map(Number),
      summarize: (values) => `total: ${values.reduce((a, b) => a + b, 0)}`,
    });
    expect(numericMiner("10;20;30")).toBe("total: 60");
  });
});


// --- Mutation tests ---

describe("mutation tests", () => {
  it("[👾] uses defaults when called without arguments", () => {
    const greet = templateWithDefaults(
      (steps: { prefix: () => string }) => () => steps.prefix(),
      { prefix: () => "Hello" },
    );

    // Called without arguments should use defaults
    expect(greet()()).toBe("Hello");
  });

  it("[👾] uses defaults when called with empty object", () => {
    const greet = templateWithDefaults(
      (steps: { prefix: () => string }) => () => steps.prefix(),
      { prefix: () => "Hello" },
    );

    // Empty object should still use defaults (different code path)
    expect(greet({})()).toBe("Hello");
  });
});
