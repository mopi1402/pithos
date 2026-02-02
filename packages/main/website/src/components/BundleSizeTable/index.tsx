import React from "react";
import styles from "./styles.module.css";
import { Table, Column } from "../Table";

// Import the generated data
import bundleData from "../../data/bundle-sizes.json";

interface BundleResult {
  name: string;
  variant: string;
  category: string;
  test: string;
  description: string;
  rawBytes: number;
  gzipBytes: number;
  brotliBytes: number;
}

interface VersionInfoData {
  kanon: string;
  zod3: string;
  zod4: string;
}

interface BundleData {
  generatedAt: string;
  versions: VersionInfoData;
  results: BundleResult[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} kB`;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface ComparisonTableProps {
  variants?: string[];
  tests?: string[];
  category?: string;
  title?: string;
  showDiff?: boolean;
  baseVariant?: string;
  showDescription?: boolean;
  stickySecondColumn?: boolean;
}

const variantNames: Record<string, string> = {
  kanon: "Kanon v3",
  "zod4-classic": "Zod 4 Classic",
  "zod4-mini": "Zod 4 Mini",
  zod3: "Zod 3",
};

const testNames: Record<string, string> = {
  "login-form": "Login Form",
  "user-profile": "User Profile",
  "api-response": "API Response",
  "config-validation": "Config Validation",
  "form-with-coercion": "Form + Coercion",
  "full-app": "Full App",
  string: "String",
  object: "Simple object",
  comprehensive: "Full schema",
  "k-namespace": "k namespace",
  "z-shim": "z shim (Zod compat)",
  "validation-helper": "validation helper",
};

export function BundleSizeComparisonTable({
  variants = ["kanon", "zod4-mini", "zod4-classic"],
  tests = ["login-form", "user-profile", "api-response", "full-app"],
  category = "real-world",
  title,
  showDiff = false,
  baseVariant = "kanon",
  showDescription = false,
  stickySecondColumn = false,
}: ComparisonTableProps): React.ReactElement {
  const data = bundleData as BundleData;

  const getResult = (
    variant: string,
    test: string
  ): BundleResult | undefined => {
    return data.results.find(
      (r) => r.variant === variant && r.test === test && r.category === category
    );
  };

  const getBaseResult = (test: string): BundleResult | undefined => {
    return getResult(baseVariant, test);
  };

  const getDiff = (result: BundleResult, base: BundleResult): string => {
    const diff = result.gzipBytes - base.gzipBytes;
    const percent = ((diff / base.gzipBytes) * 100).toFixed(0);
    if (diff > 0) return `+${percent}%`;
    if (diff < 0) return `${percent}%`;
    return "0%";
  };

  const columns: Column<string>[] = [
    {
      key: "test",
      header: "Use Case",
      className: styles.testName,
      sticky: true,
      width: "145px", // Needed for next sticky column offset
      minWidth: "145px",
      render: (test) => {
        const firstResult = getResult(variants[0], test);
        return (
          <div style={{ whiteSpace: "normal" }}>
            <strong>{testNames[test] || test}</strong>
            {showDescription && firstResult && (
              <>
                <br />
                <small className={styles.description}>
                  {firstResult.description}
                </small>
              </>
            )}
          </div>
        );
      },
    },
    ...variants.map((variant, index) => ({
      key: variant,
      header: variantNames[variant] || variant,
      sticky: stickySecondColumn && index === 0,
      // No width needed for this one as it's the last sticky (if active)
      className: (test: string) => {
        const result = getResult(variant, test);
        if (!result) {
          return styles.naCell;
        }

        const base = getBaseResult(test);
        const isSmaller = base && result.gzipBytes < base.gzipBytes;
        const isSame = variant === baseVariant;

        return `${styles.sizeCell} ${isSmaller ? styles.smaller : ""} ${isSame ? styles.base : ""
          }`;
      },
      render: (test: string) => {
        const result = getResult(variant, test);

        if (!result) {
          return "N/A";
        }

        const base = getBaseResult(test);
        const isSmaller = base && result.gzipBytes < base.gzipBytes;
        const isSame = variant === baseVariant;

        return (
          <>
            <span className={styles.size}>
              {formatBytes(result.gzipBytes)}
            </span>
            {showDiff && isSame && (
              <>
                <br />
                <span className={`${styles.diff} ${styles.diffBaseline}`}>
                  baseline
                </span>
              </>
            )}
            {showDiff && base && !isSame && (
              <>
                <br />
                <span
                  className={`${styles.diff} ${isSmaller ? styles.diffSmaller : styles.diffLarger
                    }`}
                >
                  {getDiff(result, base)}
                </span>
              </>
            )}
          </>
        );
      },
    })),
  ];

  return (
    <Table
      columns={columns}
      data={tests}
      keyExtractor={(test) => test}
      title={title}
      footer={
        <>
          Data generated on {formatDate(data.generatedAt)} • Measured with
          esbuild + gzip
        </>
      }
    />
  );
}

interface HelpersImpactTableProps {
  title?: string;
}

// Helper to format helper names with code styling
function formatHelperName(test: string): React.ReactNode {
  switch (test) {
    case "validation-helper":
      return <><code>validation</code> helper</>;
    case "k-namespace":
      return <><code>k</code> namespace</>;
    case "z-shim":
      return <><code>z</code> shim</>;
    default:
      return test;
  }
}

function formatHelperDescription(test: string): React.ReactNode {
  const whenToUse: Record<string, string> = {
    "validation-helper": "validation(schema)\u200B.safeParse(data)",
    "k-namespace": "Zod-like syntax: \u200Bk.string(), k.object()...",
    "z-shim": "Migrating from Zod",
  };

  const text = whenToUse[test];
  if (!text) return null;

  return <span className={styles.whenToUse}>{text}</span>;
}

interface HelperRow {
  id: string;
  test: string;
  isBaseline: boolean;
  kanonBytes: number;
  zodMiniBytes: number | null;
  zodClassicBytes: number | null;
}

export function HelpersImpactTable({
  title,
}: HelpersImpactTableProps): React.ReactElement {
  const data = bundleData as BundleData;

  const helperResults = data.results
    .filter((r) => r.category === "helpers")
    .sort((a, b) => a.gzipBytes - b.gzipBytes);
  const loginFormBase = data.results.find(
    (r) => r.variant === "kanon" && r.test === "login-form" && r.category === "real-world"
  );
  const zodMiniBase = data.results.find(
    (r) => r.variant === "zod4-mini" && r.test === "login-form" && r.category === "real-world"
  );
  const zodClassicBase = data.results.find(
    (r) => r.variant === "zod4-classic" && r.test === "login-form" && r.category === "real-world"
  );

  // Build rows data
  const rows: HelperRow[] = [];
  
  // Baseline row
  if (loginFormBase) {
    rows.push({
      id: "baseline",
      test: "direct-imports",
      isBaseline: true,
      kanonBytes: loginFormBase.gzipBytes,
      zodMiniBytes: zodMiniBase?.gzipBytes ?? null,
      zodClassicBytes: zodClassicBase?.gzipBytes ?? null,
    });
  }
  
  // Helper rows
  helperResults.forEach((result) => {
    rows.push({
      id: result.test,
      test: result.test,
      isBaseline: false,
      kanonBytes: result.gzipBytes,
      zodMiniBytes: zodMiniBase?.gzipBytes ?? null,
      zodClassicBytes: zodClassicBase?.gzipBytes ?? null,
    });
  });

  const columns: Column<HelperRow>[] = [
    {
      key: "importStyle",
      header: "Import Style",
      sticky: true,
      width: "200px",
      minWidth: "200px",
      wrap: true,
      render: (row) => {
        if (row.isBaseline) {
          return (
            <>
              <strong>Direct imports</strong>
              <br />
              <small style={{ opacity: 0.7 }}>Always (production)</small>
            </>
          );
        }
        const vsBaseline = loginFormBase
          ? ((row.kanonBytes - loginFormBase.gzipBytes) / loginFormBase.gzipBytes) * 100
          : 0;
        return (
          <>
            <strong>{formatHelperName(row.test)}</strong>
            {" "}
            <span className={`${styles.diff} ${styles.diffLarger}`}>+{vsBaseline.toFixed(0)}%</span>
            <br />
            <small style={{ opacity: 0.7 }}>{formatHelperDescription(row.test)}</small>
          </>
        );
      },
    },
    {
      key: "kanon",
      header: "Kanon v3",
      className: styles.sizeCell,
      render: (row) => {
        return (
          <>
            <span className={styles.size}>{formatBytes(row.kanonBytes)}</span>
            <br />
            <span className={`${styles.diff} ${styles.diffBaseline}`}>baseline</span>
          </>
        );
      },
    },
  ];

  // Add Zod Mini column if data exists
  if (zodMiniBase) {
    columns.push({
      key: "zodMini",
      header: "Zod 4 Mini",
      className: styles.sizeCell,
      render: (row) => {
        if (row.zodMiniBytes === null) return "N/A";
        // How much bigger is Zod vs Kanon on this row
        const vsKanon = ((row.zodMiniBytes - row.kanonBytes) / row.kanonBytes) * 100;
        return (
          <>
            <span className={styles.size}>{formatBytes(row.zodMiniBytes)}</span>
            <br />
            <span className={`${styles.diff} ${styles.diffLarger}`}>
              +{vsKanon.toFixed(0)}%
            </span>
          </>
        );
      },
    });
  }

  // Add Zod Classic column if data exists
  if (zodClassicBase) {
    columns.push({
      key: "zodClassic",
      header: "Zod 4 Classic",
      className: styles.sizeCell,
      render: (row) => {
        if (row.zodClassicBytes === null) return "N/A";
        // How much bigger is Zod vs Kanon on this row
        const vsKanon = ((row.zodClassicBytes - row.kanonBytes) / row.kanonBytes) * 100;
        return (
          <>
            <span className={styles.size}>{formatBytes(row.zodClassicBytes)}</span>
            <br />
            <span className={`${styles.diff} ${styles.diffLarger}`}>
              +{vsKanon.toFixed(0)}%
            </span>
          </>
        );
      },
    });
  }

  return (
    <Table
      columns={columns}
      data={rows}
      keyExtractor={(row) => row.id}
      title={title}
      footer="Kanon baseline: Login Form with direct imports"
      stickyHeader={true}
    />
  );
}

interface SingleLibraryTableProps {
  variant: string;
  category?: string;
  title?: string;
}

export function SingleLibraryTable({
  variant,
  category = "real-world",
  title,
}: SingleLibraryTableProps): React.ReactElement {
  const data = bundleData as BundleData;
  const results = data.results.filter(
    (r) => r.variant === variant && r.category === category
  );

  return (
    <div className={styles.tableContainer}>
      {title && <h3>{title}</h3>}
      <div className={styles.tableWrapper}>
        <table className={styles.bundleTable}>
          <thead>
            <tr>
              <th>Use Case</th>
              <th>Raw</th>
              <th>Gzip</th>
              <th>Brotli</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.test}>
                <td>
                  <strong>{testNames[result.test] || result.test}</strong>
                  <br />
                  <small className={styles.description}>
                    {result.description}
                  </small>
                </td>
                <td>{formatBytes(result.rawBytes)}</td>
                <td className={styles.highlight}>
                  {formatBytes(result.gzipBytes)}
                </td>
                <td>{formatBytes(result.brotliBytes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.generatedAt}>
        Data generated on {formatDate(data.generatedAt)}
      </p>
    </div>
  );
}

export function GeneratedDate(): React.ReactElement {
  const data = bundleData as BundleData;
  return <span>{formatDate(data.generatedAt)}</span>;
}

interface SavingsHighlightProps {
  test?: string;
  category?: string;
}

export function SavingsHighlight({
  test = "full-app",
  category = "real-world",
}: SavingsHighlightProps): React.ReactElement {
  const data = bundleData as BundleData;

  const kanon = data.results.find(
    (r) => r.variant === "kanon" && r.test === test && r.category === category
  );
  const zodMini = data.results.find(
    (r) => r.variant === "zod4-mini" && r.test === test && r.category === category
  );
  const zodClassic = data.results.find(
    (r) => r.variant === "zod4-classic" && r.test === test && r.category === category
  );

  if (!kanon) return <span>N/A</span>;

  const vsMini = zodMini
    ? ((zodMini.gzipBytes - kanon.gzipBytes) / kanon.gzipBytes * 100).toFixed(0)
    : "N/A";
  const vsClassic = zodClassic
    ? (zodClassic.gzipBytes / kanon.gzipBytes).toFixed(1)
    : "N/A";

  return (
    <span className={styles.savingsHighlight}>
      <strong>{formatBytes(kanon.gzipBytes)}</strong> vs Zod Mini (+{vsMini}%) /
      Zod Classic ({vsClassic}x larger)
    </span>
  );
}

interface WhenToUseItem {
  helper: string;
  label: React.ReactNode;
  testId: string | null;
  whenToUse: string;
}

function formatBytesShort(bytes: number): string {
  const kb = bytes / 1024;
  return `~${kb.toFixed(1)} kB`;
}

interface CodeExampleProps {
  variant: "direct" | "k-namespace" | "z-shim";
}

export function CodeExample({ variant }: CodeExampleProps): React.ReactElement {
  const data = bundleData as BundleData;

  const loginFormBase = data.results.find(
    (r) => r.variant === "kanon" && r.test === "login-form" && r.category === "real-world"
  );
  const kNamespace = data.results.find(
    (r) => r.test === "k-namespace" && r.category === "helpers"
  );
  const zShim = data.results.find(
    (r) => r.test === "z-shim" && r.category === "helpers"
  );

  const directSize = loginFormBase ? formatBytesShort(loginFormBase.gzipBytes) : "~3.1 kB";
  const kSize = kNamespace ? formatBytesShort(kNamespace.gzipBytes) : "~4.8 kB";
  const zSize = zShim ? formatBytesShort(zShim.gzipBytes) : "~6.6 kB";

  if (variant === "direct") {
    return (
      <pre className={styles.codeBlock}>
        <code>{`// ✅ BEST: Direct imports (${directSize} for login form)
import { object, string, parse } from "pithos/kanon/v3";

const schema = object({
  email: string({ format: "email" }),
  password: string({ minLength: 8 }),
});
const result = parse(schema, data);`}</code>
      </pre>
    );
  }

  if (variant === "k-namespace") {
    return (
      <pre className={styles.codeBlock}>
        <code>{`// ⚠️ CONVENIENT: k namespace (${kSize} - includes ALL schemas)
import { k } from "pithos/kanon/v3";

const schema = k.object({
  email: k.string(),
  password: k.string(),
});
const result = k.parse(schema, data);`}</code>
      </pre>
    );
  }

  // z-shim
  return (
    <pre className={styles.codeBlock}>
      <code>{`// ⚠️ ZOD COMPAT: z shim (${zSize} - Zod API adapter)
import { z } from "pithos/kanon/v3/helpers/as-zod.shim";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const result = schema.parse(data);`}</code>
    </pre>
  );
}

export function WhenToUseTable(): React.ReactElement {
  const data = bundleData as BundleData;

  const loginFormBase = data.results.find(
    (r) => r.variant === "kanon" && r.test === "login-form" && r.category === "real-world"
  );

  const items: WhenToUseItem[] = [
    { helper: "Direct imports", label: "Direct imports", testId: null, whenToUse: "Always (production)" },
    { helper: "validation", label: <><code>validation</code> helper</>, testId: "validation-helper", whenToUse: "When you need .safeParse() style" },
    { helper: "k", label: <><code>k</code> namespace</>, testId: "k-namespace", whenToUse: "Prototyping, small projects" },
    { helper: "z", label: <><code>z</code> shim</>, testId: "z-shim", whenToUse: "Migrating from Zod" },
  ];

  const getImpact = (testId: string | null): string => {
    if (!testId || !loginFormBase) return "Minimal";

    const helperResult = data.results.find(
      (r) => r.test === testId && r.category === "helpers"
    );

    if (!helperResult) return "N/A";

    const overhead = ((helperResult.gzipBytes - loginFormBase.gzipBytes) / loginFormBase.gzipBytes) * 100;
    return `+~${Math.round(overhead)}%`;
  };

  return (
    <table className={styles.bundleTable}>
      <thead>
        <tr>
          <th>Helper</th>
          <th>Bundle Impact</th>
          <th>When to use</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.helper}>
            <td><strong>{item.label}</strong></td>
            <td>{getImpact(item.testId)}</td>
            <td>{item.whenToUse}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ZodMiniComparisonTable(): React.ReactElement {
  const data = bundleData as BundleData;

  const kanonLogin = data.results.find(
    (r) => r.variant === "kanon" && r.test === "login-form" && r.category === "real-world"
  );
  const kanonFull = data.results.find(
    (r) => r.variant === "kanon" && r.test === "full-app" && r.category === "real-world"
  );
  const zodClassicLogin = data.results.find(
    (r) => r.variant === "zod4-classic" && r.test === "login-form" && r.category === "real-world"
  );
  const zodClassicFull = data.results.find(
    (r) => r.variant === "zod4-classic" && r.test === "full-app" && r.category === "real-world"
  );
  const zodMiniLogin = data.results.find(
    (r) => r.variant === "zod4-mini" && r.test === "login-form" && r.category === "real-world"
  );
  const zodMiniFull = data.results.find(
    (r) => r.variant === "zod4-mini" && r.test === "full-app" && r.category === "real-world"
  );

  const formatSize = (bytes: number | undefined): string => {
    if (!bytes) return "N/A";
    return `~${(bytes / 1024).toFixed(1)} kB`;
  };

  // Calculate growth rates
  const kanonGrowth = kanonLogin && kanonFull
    ? Math.round(((kanonFull.gzipBytes - kanonLogin.gzipBytes) / kanonLogin.gzipBytes) * 100)
    : null;
  const zodMiniGrowth = zodMiniLogin && zodMiniFull
    ? Math.round(((zodMiniFull.gzipBytes - zodMiniLogin.gzipBytes) / zodMiniLogin.gzipBytes) * 100)
    : null;
  const zodClassicGrowth = zodClassicLogin && zodClassicFull
    ? Math.round(((zodClassicFull.gzipBytes - zodClassicLogin.gzipBytes) / zodClassicLogin.gzipBytes) * 100)
    : null;

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.bundleTable}>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Zod 4 Classic</th>
              <th>Zod 4 Mini</th>
              <th>Kanon</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Simple login form</td>
              <td>{formatSize(zodClassicLogin?.gzipBytes)}</td>
              <td>{formatSize(zodMiniLogin?.gzipBytes)}</td>
              <td><strong>{formatSize(kanonLogin?.gzipBytes)}</strong></td>
            </tr>
            <tr>
              <td>Full app schemas</td>
              <td>{formatSize(zodClassicFull?.gzipBytes)}</td>
              <td>{formatSize(zodMiniFull?.gzipBytes)}</td>
              <td><strong>{formatSize(kanonFull?.gzipBytes)}</strong></td>
            </tr>
            <tr>
              <td>Growth rate</td>
              <td>{zodClassicGrowth !== null ? (zodClassicGrowth <= 5 ? "Almost flat" : `+${zodClassicGrowth}%`) : "N/A"}</td>
              <td>{zodMiniGrowth !== null ? `+${zodMiniGrowth}%` : "N/A"}</td>
              <td>{kanonGrowth !== null ? `+${kanonGrowth}%` : "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={styles.generatedAt}>
        Kanon v{data.versions?.kanon || "3.x"} vs Zod v{data.versions?.zod4 || "4.x"}
      </p>
    </div>
  );
}

export function VersionInfo(): React.ReactElement {
  const data = bundleData as BundleData;
  return (
    <span>
      Kanon v{data.versions?.kanon || "3.x"} / Zod v{data.versions?.zod4 || "4.x"}
    </span>
  );
}

interface DynamicSizeProps {
  variant: "kanon" | "zod4-mini" | "zod4-classic";
  test?: string;
  category?: string;
}

export function DynamicSize({
  variant,
  test = "login-form",
  category = "real-world"
}: DynamicSizeProps): React.ReactElement {
  const data = bundleData as BundleData;
  const result = data.results.find(
    (r) => r.variant === variant && r.test === test && r.category === category
  );

  if (!result) return <span>~? kB</span>;

  const kb = Math.round(result.gzipBytes / 1024);
  return <span>~{kb} kB</span>;
}

export function SummaryTable(): React.ReactElement {
  const data = bundleData as BundleData;

  // Get the smallest Kanon bundle (login-form)
  const kanonMin = data.results.find(
    (r) => r.variant === "kanon" && r.test === "login-form" && r.category === "real-world"
  );

  // Get Zod Mini and Classic min bundles
  const zodMiniMin = data.results.find(
    (r) => r.variant === "zod4-mini" && r.test === "login-form" && r.category === "real-world"
  );
  const zodClassicMin = data.results.find(
    (r) => r.variant === "zod4-classic" && r.test === "login-form" && r.category === "real-world"
  );

  const kanonSize = kanonMin ? `~${(kanonMin.gzipBytes / 1024).toFixed(0)} kB` : "~3 kB";
  const zodMinSize = zodMiniMin ? Math.round(zodMiniMin.gzipBytes / 1024) : 6;
  const zodMaxSize = zodClassicMin ? Math.round(zodClassicMin.gzipBytes / 1024) : 26;
  const zodRange = `~${zodMinSize}-${zodMaxSize} kB`;

  // Calculate savings ratio
  const savingsMin = zodMiniMin && kanonMin
    ? (zodMiniMin.gzipBytes / kanonMin.gzipBytes).toFixed(0)
    : "2";
  const savingsMax = zodClassicMin && kanonMin
    ? (zodClassicMin.gzipBytes / kanonMin.gzipBytes).toFixed(0)
    : "8";

  return (
    <div className={styles.tableContainer}>
      <table className={styles.bundleTable}>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Kanon</th>
            <th>Zod</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Architecture</strong></td>
            <td>Functions</td>
            <td>Classes</td>
          </tr>
          <tr>
            <td><strong>Tree-shaking</strong></td>
            <td>✅ Full</td>
            <td>❌ Limited</td>
          </tr>
          <tr>
            <td><strong>Min bundle</strong></td>
            <td>{kanonSize}</td>
            <td>{zodRange}</td>
          </tr>
          <tr>
            <td><strong>Scales with usage</strong></td>
            <td>✅ Yes</td>
            <td>❌ Mostly fixed</td>
          </tr>
          <tr>
            <td><strong>Migration path</strong></td>
            <td><code>z</code> shim available</td>
            <td>N/A</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BundleSizeComparisonTable;
