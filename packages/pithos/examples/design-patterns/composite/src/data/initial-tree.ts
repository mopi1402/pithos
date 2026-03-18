import { leaf, branch } from "@pithos/core/eidos/composite/composite";
import type { FileTree } from "@/lib/types";

export function createInitialTree(): FileTree {
  return branch({ name: "project", size: 0 }, [
    leaf({ name: "README.md", size: 1024 }),
    leaf({ name: "package.json", size: 512 }),
    branch({ name: "src", size: 0 }, [
      leaf({ name: "index.ts", size: 2048 }),
      leaf({ name: "utils.ts", size: 768 }),
      branch({ name: "components", size: 0 }, [
        leaf({ name: "App.tsx", size: 1536 }),
        leaf({ name: "Header.tsx", size: 640 }),
      ]),
    ]),
    branch({ name: "docs", size: 0 }, [
      leaf({ name: "guide.md", size: 896 }),
      leaf({ name: "api.md", size: 1280 }),
    ]),
    branch({ name: "tests", size: 0 }, [
      leaf({ name: "index.test.ts", size: 1024 }),
    ]),
  ]);
}

export const PRESET_FILES = [
  { name: "config.json", size: 256, icon: "⚙️" },
  { name: "styles.css", size: 1536, icon: "🎨" },
  { name: "helpers.ts", size: 896, icon: "🔧" },
  { name: "types.d.ts", size: 384, icon: "📐" },
  { name: "logo.svg", size: 2048, icon: "🖼️" },
  { name: "data.json", size: 4096, icon: "📦" },
];
