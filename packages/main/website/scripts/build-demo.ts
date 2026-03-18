/**
 * Build demo apps and copy them to static/demos/
 * Also generates JSON files with source code for display
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEBSITE_ROOT = join(__dirname, "..");
const PITHOS_EXAMPLES = join(WEBSITE_ROOT, "..", "..", "pithos", "examples");
const STATIC_DEMOS_DIR = join(WEBSITE_ROOT, "static", "demos");
const DATA_DIR = join(WEBSITE_ROOT, "src", "data");

interface DemoConfig {
  name: string;
  path: string;
  outputDir: string;
  sourceFiles: Array<{ path: string; label: string; step: number }>;
  dataFileName: string;
}

const DEMOS: DemoConfig[] = [
  {
    name: "practical-example",
    path: join(PITHOS_EXAMPLES, "practical-example"),
    outputDir: "practical-example",
    dataFileName: "demo-sources.json",
    sourceFiles: [
      { path: "src/lib/schemas.ts", label: "schemas.ts", step: 1 },
      { path: "src/lib/api.ts", label: "api.ts", step: 2 },
      { path: "src/lib/transformers.ts", label: "transformers.ts", step: 3 },
      { path: "src/lib/types.ts", label: "types.ts", step: 0 },
      { path: "src/hooks/useDashboard.ts", label: "useDashboard.ts", step: 5 },
      { path: "src/components/Dashboard/index.tsx", label: "Dashboard.tsx", step: 5 },
    ],
  },
  {
    name: "strategy-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "strategy"),
    outputDir: "design-patterns/strategy",
    dataFileName: "strategy-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/strategies.ts", label: "strategies.ts", step: 1 },
      { path: "src/hooks/usePricingCalculator.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "observer-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "observer"),
    outputDir: "design-patterns/observer",
    dataFileName: "observer-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/stockTicker.ts", label: "stockTicker.ts", step: 1 },
      { path: "src/components/StockDashboard.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "decorator-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "decorator"),
    outputDir: "design-patterns/decorator",
    dataFileName: "decorator-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/decorators.ts", label: "decorators.ts", step: 1 },
      { path: "src/hooks/useAnalysisPipeline.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "command-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "command"),
    outputDir: "design-patterns/command",
    dataFileName: "command-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/command.ts", label: "command.ts", step: 1 },
      { path: "src/hooks/useKanbanBoard.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "chain-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "chain"),
    outputDir: "design-patterns/chain",
    dataFileName: "chain-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/chain.ts", label: "chain.ts", step: 1 },
      { path: "src/hooks/useMiddlewareSimulator.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "builder-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "builder"),
    outputDir: "design-patterns/builder",
    dataFileName: "builder-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/builder.ts", label: "builder.ts", step: 1 },
      { path: "src/hooks/useChartBuilder.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "state-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "state"),
    outputDir: "design-patterns/state",
    dataFileName: "state-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/tennisMachine.ts", label: "tennisMachine.ts", step: 1 },
      { path: "src/components/TennisScoreboard.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "proxy-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "proxy"),
    outputDir: "design-patterns/proxy",
    dataFileName: "proxy-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/llmProxy.ts", label: "llmProxy.ts", step: 1 },
      { path: "src/components/LLMProxy.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "iterator-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "iterator"),
    outputDir: "design-patterns/iterator",
    dataFileName: "iterator-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/iterators.ts", label: "iterators.ts", step: 1 },
      { path: "src/components/PokedexBrowser.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "mediator-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "mediator"),
    outputDir: "design-patterns/mediator",
    dataFileName: "mediator-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/dashboard.ts", label: "dashboard.ts", step: 1 },
      { path: "src/components/FlightDashboard.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "abstract-factory-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "abstract-factory"),
    outputDir: "design-patterns/abstract-factory",
    dataFileName: "abstract-factory-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/factory.ts", label: "factory.ts", step: 1 },
      { path: "src/hooks/usePhonePreview.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "composite-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "composite"),
    outputDir: "design-patterns/composite",
    dataFileName: "composite-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/composite.ts", label: "composite.ts", step: 1 },
      { path: "src/hooks/useFileExplorer.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "adapter-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "adapter"),
    outputDir: "design-patterns/adapter",
    dataFileName: "adapter-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/adapters.ts", label: "adapters.ts", step: 1 },
      { path: "src/hooks/useAdapterMap.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "memento-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "memento"),
    outputDir: "design-patterns/memento",
    dataFileName: "memento-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/history.ts", label: "history.ts", step: 1 },
      { path: "src/components/PhotoEditor.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "template-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "template"),
    outputDir: "design-patterns/template",
    dataFileName: "template-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/template.ts", label: "template.ts", step: 1 },
      { path: "src/hooks/useResumeBuilder.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "bridge-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "bridge"),
    outputDir: "design-patterns/bridge",
    dataFileName: "bridge-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/bridge.ts", label: "bridge.ts", step: 1 },
      { path: "src/lib/audio.ts", label: "audio.ts", step: 2 },
      { path: "src/hooks/useMusicPlayer.ts", label: "Usage", step: 3 },
    ],
  },
  {
    name: "interpreter-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "interpreter"),
    outputDir: "design-patterns/interpreter",
    dataFileName: "interpreter-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/interpreter.ts", label: "interpreter.ts", step: 1 },
      { path: "src/components/MarkdownPreview.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "facade-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "facade"),
    outputDir: "design-patterns/facade",
    dataFileName: "facade-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/facade.ts", label: "facade.ts", step: 1 },
      { path: "src/hooks/useApiFacade.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "factory-method-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "factory-method"),
    outputDir: "design-patterns/factory-method",
    dataFileName: "factory-method-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/factory.ts", label: "factory.ts", step: 1 },
      { path: "src/hooks/useNotificationDemo.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "flyweight-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "flyweight"),
    outputDir: "design-patterns/flyweight",
    dataFileName: "flyweight-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/flyweight.ts", label: "flyweight.ts", step: 1 },
      { path: "src/hooks/useTextEditor.ts", label: "Usage", step: 2 },
    ],
  },
  {
    name: "prototype-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "prototype"),
    outputDir: "design-patterns/prototype",
    dataFileName: "prototype-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/clone.ts", label: "clone.ts", step: 1 },
      { path: "src/components/ConfigDiff.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "singleton-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "singleton"),
    outputDir: "design-patterns/singleton",
    dataFileName: "singleton-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/services.ts", label: "services.ts", step: 1 },
      { path: "src/components/OnceTab.tsx", label: "Usage", step: 2 },
    ],
  },
  {
    name: "visitor-pattern",
    path: join(PITHOS_EXAMPLES, "design-patterns", "visitor"),
    outputDir: "design-patterns/visitor",
    dataFileName: "visitor-demo-sources.json",
    sourceFiles: [
      { path: "src/lib/visitors.ts", label: "visitors.ts", step: 1 },
      { path: "src/hooks/useEmailBuilder.ts", label: "Usage", step: 2 },
    ],
  },
];

function buildDemo(demo: DemoConfig) {
  console.log(`🔨 Building ${demo.name} demo...`);

  // Check if demo exists
  if (!existsSync(demo.path)) {
    console.warn(`⚠️ Demo not found: ${demo.path}, skipping...`);
    return false;
  }

  // Build the demo app
  try {
    execSync("pnpm build", {
      cwd: demo.path,
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`❌ Failed to build ${demo.name}:`, error);
    return false;
  }

  // Create static directory
  const staticDir = join(STATIC_DEMOS_DIR, demo.outputDir);
  mkdirSync(staticDir, { recursive: true });

  // Copy dist to static
  const distDir = join(demo.path, "dist");
  if (existsSync(distDir)) {
    cpSync(distDir, staticDir, { recursive: true });
    console.log(`✅ ${demo.name} copied to ${staticDir}`);
    return true;
  } else {
    console.warn(`⚠️ Dist not found for ${demo.name}`);
    return false;
  }
}

function generateSourceData(demo: DemoConfig) {
  console.log(`📄 Generating source data for ${demo.name}...`);

  mkdirSync(DATA_DIR, { recursive: true });

  const sources: Record<string, { content: string; label: string; step: number }> = {};

  for (const file of demo.sourceFiles) {
    const filePath = join(demo.path, file.path);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf-8");
      sources[file.path] = {
        content,
        label: file.label,
        step: file.step,
      };
    } else {
      console.warn(`⚠️ File not found: ${filePath}`);
    }
  }

  const outputPath = join(DATA_DIR, demo.dataFileName);
  writeFileSync(outputPath, JSON.stringify(sources, null, 2));

  console.log(`✅ Source data written to ${outputPath}`);
}

function main() {
  for (const demo of DEMOS) {
    const built = buildDemo(demo);
    if (built && demo.sourceFiles.length > 0) {
      generateSourceData(demo);
    }
  }
  console.log("🎉 All demos built!");
}

main();
