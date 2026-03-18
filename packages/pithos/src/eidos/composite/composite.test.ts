import { describe, it, expect } from "vitest";
import { isSome, isNone } from "@zygos/option";
import {
  leaf,
  branch,
  fold,
  map,
  flatten,
  find,
  type Composite,
} from "./composite";

describe("leaf", () => {
  it("creates a leaf node", () => {
    const node = leaf({ name: "file.txt", size: 100 });

    expect(node.type).toBe("leaf");
    expect(node.data).toEqual({ name: "file.txt", size: 100 });
  });
});

describe("branch", () => {
  it("creates a branch node with children", () => {
    const child1 = leaf("a");
    const child2 = leaf("b");
    const node = branch("root", [child1, child2]);

    expect(node.type).toBe("branch");
    expect(node.data).toBe("root");
    expect(node.children).toHaveLength(2);
  });

  it("creates empty branch", () => {
    const node = branch("empty", []);

    expect(node.children).toHaveLength(0);
  });
});

describe("fold", () => {
  type FSNode = Composite<{ name: string; size: number }>;

  const tree: FSNode = branch({ name: "root", size: 0 }, [
    leaf({ name: "file1.txt", size: 100 }),
    branch({ name: "docs", size: 0 }, [
      leaf({ name: "readme.md", size: 50 }),
      leaf({ name: "guide.md", size: 75 }),
    ]),
  ]);

  it("calculates total size", () => {
    const totalSize = fold(tree, {
      leaf: (data) => data.size,
      branch: (_, childResults) => childResults.reduce((a, b) => a + b, 0),
    });

    expect(totalSize).toBe(225);
  });

  it("counts all nodes", () => {
    const count = fold(tree, {
      leaf: () => 1,
      branch: (_, children) => 1 + children.reduce((a, b) => a + b, 0),
    });

    expect(count).toBe(5);
  });

  it("renders tree structure", () => {
    const render = fold(tree, {
      leaf: (data) => data.name,
      branch: (data, children) => `${data.name}(${children.join("+")})`,
    });

    expect(render).toBe("root(file1.txt+docs(readme.md+guide.md))");
  });

  it("handles single leaf", () => {
    const single = leaf({ name: "solo", size: 42 });
    const result = fold(single, {
      leaf: (data) => data.size,
      branch: (_, children) => children.reduce((a, b) => a + b, 0),
    });

    expect(result).toBe(42);
  });
});

describe("map", () => {
  it("transforms all node data", () => {
    const tree = branch(1, [leaf(2), leaf(3)]);
    const doubled = map(tree, (n) => n * 2);

    expect(doubled).toEqual(branch(2, [leaf(4), leaf(6)]));
  });

  it("preserves structure", () => {
    const tree = branch("a", [branch("b", [leaf("c")]), leaf("d")]);
    const upper = map(tree, (s) => s.toUpperCase());

    expect(upper).toEqual(branch("A", [branch("B", [leaf("C")]), leaf("D")]));
  });
});

describe("flatten", () => {
  it("returns all node data in pre-order", () => {
    const tree = branch("a", [leaf("b"), branch("c", [leaf("d")])]);
    const flat = flatten(tree);

    expect(flat).toEqual(["a", "b", "c", "d"]);
  });

  it("handles single leaf", () => {
    expect(flatten(leaf("x"))).toEqual(["x"]);
  });
});

describe("find", () => {
  const tree = branch(
    { id: 1, name: "root" },
    [
      leaf({ id: 2, name: "child1" }),
      branch({ id: 3, name: "child2" }, [
        leaf({ id: 4, name: "grandchild" }),
      ]),
    ],
  );

  it("finds node by predicate and returns Some", () => {
    const found = find(tree, (data) => data.id === 4);

    expect(isSome(found)).toBe(true);
    if (isSome(found)) {
      expect(found.value).toEqual({ id: 4, name: "grandchild" });
    }
  });

  it("returns None when not found", () => {
    const found = find(tree, (data) => data.id === 999);

    expect(isNone(found)).toBe(true);
  });

  it("finds root if it matches", () => {
    const found = find(tree, (data) => data.id === 1);

    expect(isSome(found)).toBe(true);
    if (isSome(found)) {
      expect(found.value).toEqual({ id: 1, name: "root" });
    }
  });
});

describe("real-world: UI component tree", () => {
  type UINode = Composite<{ tag: string; props: Record<string, string> }>;

  const ui: UINode = branch({ tag: "div", props: { class: "container" } }, [
    leaf({ tag: "h1", props: { class: "title" } }),
    branch({ tag: "ul", props: { class: "list" } }, [
      leaf({ tag: "li", props: { class: "item" } }),
      leaf({ tag: "li", props: { class: "item" } }),
    ]),
  ]);

  it("renders to HTML-like string", () => {
    const html = fold(ui, {
      leaf: (data) => `<${data.tag} class="${data.props.class}"/>`,
      branch: (data, children) =>
        `<${data.tag} class="${data.props.class}">${children.join("")}</${data.tag}>`,
    });

    expect(html).toBe(
      '<div class="container">' +
        '<h1 class="title"/>' +
        '<ul class="list">' +
        '<li class="item"/>' +
        '<li class="item"/>' +
        "</ul>" +
        "</div>",
    );
  });

  it("counts elements by tag", () => {
    const flat = flatten(ui);
    const liCount = flat.filter((n) => n.tag === "li").length;

    expect(liCount).toBe(2);
  });
});
