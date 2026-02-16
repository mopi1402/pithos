import React from "react";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";
import { Table, Column } from "@site/src/components/shared/Table";
import { formatBytes, formatDate } from "@site/src/utils/format";
import { variantNames, testNames } from "@site/src/data/comparisons/kanon-bundle-config";
import type { BundleResult, BundleData } from "./types";

// Import the generated data
import bundleData from "@site/src/data/generated/kanon-bundle-sizes.json";

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
      header: translate({ id: 'comparison.bundle.header.useCase', message: 'Use Case' }),
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
          return translate({ id: 'comparison.common.na', message: 'N/A' });
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
                  {translate({ id: 'comparison.common.baseline', message: 'baseline' })}
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
        translate(
          { id: 'comparison.bundle.footer', message: 'Data generated on {date} • Measured with esbuild + gzip' },
          { date: formatDate(data.generatedAt) }
        )
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
      return <><code>validation</code> {translate({ id: 'comparison.bundle.validationHelper', message: 'validation helper' }).split('validation ')[1]}</>;
    case "k-namespace":
      return <><code>k</code> {translate({ id: 'comparison.bundle.kNamespace', message: 'k namespace' }).split('k ')[1]}</>;
    case "z-shim":
      return <><code>z</code> {translate({ id: 'comparison.bundle.zShim', message: 'z shim' }).split('z ')[1]}</>;
    default:
      return test;
  }
}

function formatHelperDescription(test: string): React.ReactNode {
  const whenToUse: Record<string, string> = {
    "validation-helper": translate({ id: 'comparison.bundle.helperDesc.validation', message: 'validation(schema).safeParse(data)' }),
    "k-namespace": translate({ id: 'comparison.bundle.helperDesc.kNamespace', message: 'Zod-like syntax: k.string(), k.object()...' }),
    "z-shim": translate({ id: 'comparison.bundle.helperDesc.zShim', message: 'Migrating from Zod' }),
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
      header: translate({ id: 'comparison.bundle.header.importStyle', message: 'Import Style' }),
      sticky: true,
      width: "200px",
      minWidth: "200px",
      wrap: true,
      render: (row) => {
        if (row.isBaseline) {
          return (
            <>
              <strong>{translate({ id: 'comparison.bundle.directImports', message: 'Direct imports' })}</strong>
              <br />
              <small style={{ opacity: 0.7 }}>{translate({ id: 'comparison.bundle.alwaysProduction', message: 'Always (production)' })}</small>
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
      header: translate({ id: 'comparison.bundle.variant.kanon', message: 'Kanon v3' }),
      className: styles.sizeCell,
      render: (row) => {
        return (
          <>
            <span className={styles.size}>{formatBytes(row.kanonBytes)}</span>
            <br />
            <span className={`${styles.diff} ${styles.diffBaseline}`}>{translate({ id: 'comparison.common.baseline', message: 'baseline' })}</span>
          </>
        );
      },
    },
  ];

  // Add Zod Mini column if data exists
  if (zodMiniBase) {
    columns.push({
      key: "zodMini",
      header: translate({ id: 'comparison.bundle.variant.zod4Mini', message: 'Zod 4 Mini' }),
      className: styles.sizeCell,
      render: (row) => {
        if (row.zodMiniBytes === null) return translate({ id: 'comparison.common.na', message: 'N/A' });
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
      header: translate({ id: 'comparison.bundle.variant.zod4Classic', message: 'Zod 4 Classic' }),
      className: styles.sizeCell,
      render: (row) => {
        if (row.zodClassicBytes === null) return translate({ id: 'comparison.common.na', message: 'N/A' });
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
      footer={translate({ id: 'comparison.bundle.footer.kanonBaseline', message: 'Kanon baseline: Login Form with direct imports' })}
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
              <th>{translate({ id: 'comparison.bundle.header.useCase', message: 'Use Case' })}</th>
              <th>{translate({ id: 'comparison.bundle.header.raw', message: 'Raw' })}</th>
              <th>{translate({ id: 'comparison.bundle.header.gzip', message: 'Gzip' })}</th>
              <th>{translate({ id: 'comparison.bundle.header.brotli', message: 'Brotli' })}</th>
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
        {translate(
          { id: 'comparison.bundle.footer.generatedOn', message: 'Data generated on {date}' },
          { date: formatDate(data.generatedAt) }
        )}
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

  if (!kanon) return <span>{translate({ id: 'comparison.common.na', message: 'N/A' })}</span>;

  const miniPercent = zodMini
    ? `+${((zodMini.gzipBytes - kanon.gzipBytes) / kanon.gzipBytes * 100).toFixed(0)}%`
    : null;
  const classicPercent = zodClassic
    ? `+${((zodClassic.gzipBytes - kanon.gzipBytes) / kanon.gzipBytes * 100).toFixed(0)}%`
    : null;

  return (
    <div className={styles.tldr}>
      <p className={styles.tldrIntro}>
        {translate({ id: 'comparison.bundle.savingsHighlight.intro', message: 'For a complete app with all schema types (gzip):' })}
      </p>
      <ul className={styles.tldrList}>
        <li><strong>Kanon</strong> : {formatBytes(kanon.gzipBytes)} <span className={styles.tldrBaseline}>{translate({ id: 'comparison.common.baseline', message: 'baseline' })}</span></li>
        {zodMini && <li><strong>Zod 4 Mini</strong> : {formatBytes(zodMini.gzipBytes)} <span className={styles.tldrLarger}>({miniPercent})</span></li>}
        {zodClassic && <li><strong>Zod 4 Classic</strong> : {formatBytes(zodClassic.gzipBytes)} <span className={styles.tldrLarger}>({classicPercent})</span></li>}
      </ul>
    </div>
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
        <code>{`// ${translate({ id: 'comparison.bundle.codeExample.directComment', message: '✅ BEST: Direct imports ({size} for login form)' }, { size: directSize })}
import { object, string, parse } from "pithos/kanon";

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
        <code>{`// ${translate({ id: 'comparison.bundle.codeExample.kNamespaceComment', message: '⚠️ CONVENIENT: k namespace ({size} - includes ALL schemas)' }, { size: kSize })}
import { k } from "pithos/kanon";

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
      <code>{`// ${translate({ id: 'comparison.bundle.codeExample.zShimComment', message: '⚠️ ZOD COMPAT: z shim ({size} - Zod API adapter)' }, { size: zSize })}
import { z } from "pithos/kanon/helpers/as-zod.shim";

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
    { helper: "Direct imports", label: translate({ id: 'comparison.bundle.directImports', message: 'Direct imports' }), testId: null, whenToUse: translate({ id: 'comparison.bundle.alwaysProduction', message: 'Always (production)' }) },
    { helper: "validation", label: <><code>validation</code> {translate({ id: 'comparison.bundle.validationHelper', message: 'validation helper' }).split('validation ')[1]}</>, testId: "validation-helper", whenToUse: translate({ id: 'comparison.bundle.whenToUse.validation', message: 'When you need .safeParse() style' }) },
    { helper: "k", label: <><code>k</code> {translate({ id: 'comparison.bundle.kNamespace', message: 'k namespace' }).split('k ')[1]}</>, testId: "k-namespace", whenToUse: translate({ id: 'comparison.bundle.whenToUse.kNamespace', message: 'Prototyping, small projects' }) },
    { helper: "z", label: <><code>z</code> {translate({ id: 'comparison.bundle.zShim', message: 'z shim' }).split('z ')[1]}</>, testId: "z-shim", whenToUse: translate({ id: 'comparison.bundle.whenToUse.zShim', message: 'Migrating from Zod' }) },
  ];

  const getImpact = (testId: string | null): string => {
    if (!testId || !loginFormBase) return translate({ id: 'comparison.bundle.minimal', message: 'Minimal' });

    const helperResult = data.results.find(
      (r) => r.test === testId && r.category === "helpers"
    );

    if (!helperResult) return translate({ id: 'comparison.common.na', message: 'N/A' });

    const overhead = ((helperResult.gzipBytes - loginFormBase.gzipBytes) / loginFormBase.gzipBytes) * 100;
    return `+~${Math.round(overhead)}%`;
  };

  return (
    <table className={styles.bundleTable}>
      <thead>
        <tr>
          <th>{translate({ id: 'comparison.bundle.header.helper', message: 'Helper' })}</th>
          <th>{translate({ id: 'comparison.bundle.header.bundleImpact', message: 'Bundle Impact' })}</th>
          <th>{translate({ id: 'comparison.bundle.header.whenToUse', message: 'When to use' })}</th>
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
    if (!bytes) return translate({ id: 'comparison.common.na', message: 'N/A' });
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
              <th>{translate({ id: 'comparison.bundle.header.scenario', message: 'Scenario' })}</th>
              <th>{translate({ id: 'comparison.bundle.variant.zod4Classic', message: 'Zod 4 Classic' })}</th>
              <th>{translate({ id: 'comparison.bundle.variant.zod4Mini', message: 'Zod 4 Mini' })}</th>
              <th>{translate({ id: 'comparison.bundle.variant.kanon', message: 'Kanon v3' })}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{translate({ id: 'comparison.bundle.zodComparison.simpleLoginForm', message: 'Simple login form' })}</td>
              <td>{formatSize(zodClassicLogin?.gzipBytes)}</td>
              <td>{formatSize(zodMiniLogin?.gzipBytes)}</td>
              <td><strong>{formatSize(kanonLogin?.gzipBytes)}</strong></td>
            </tr>
            <tr>
              <td>{translate({ id: 'comparison.bundle.zodComparison.fullAppSchemas', message: 'Full app schemas' })}</td>
              <td>{formatSize(zodClassicFull?.gzipBytes)}</td>
              <td>{formatSize(zodMiniFull?.gzipBytes)}</td>
              <td><strong>{formatSize(kanonFull?.gzipBytes)}</strong></td>
            </tr>
            <tr>
              <td>{translate({ id: 'comparison.bundle.zodComparison.growthRate', message: 'Growth rate' })}</td>
              <td>{zodClassicGrowth !== null ? (zodClassicGrowth <= 5 ? translate({ id: 'comparison.bundle.zodComparison.almostFlat', message: 'Almost flat' }) : `+${zodClassicGrowth}%`) : translate({ id: 'comparison.common.na', message: 'N/A' })}</td>
              <td>{zodMiniGrowth !== null ? `+${zodMiniGrowth}%` : translate({ id: 'comparison.common.na', message: 'N/A' })}</td>
              <td>{kanonGrowth !== null ? `+${kanonGrowth}%` : translate({ id: 'comparison.common.na', message: 'N/A' })}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={styles.generatedAt}>
        {translate(
          { id: 'comparison.bundle.versionInfo', message: 'Kanon v{kanonVersion} vs Zod v{zodVersion}' },
          { kanonVersion: data.versions?.kanon || "3.x", zodVersion: data.versions?.zod4 || "4.x" }
        )}
      </p>
    </div>
  );
}

export function VersionInfo(): React.ReactElement {
  const data = bundleData as BundleData;
  return (
    <span>
      {translate(
        { id: 'comparison.bundle.versionInfoShort', message: 'Kanon v{kanonVersion} / Zod v{zodVersion}' },
        { kanonVersion: data.versions?.kanon || "3.x", zodVersion: data.versions?.zod4 || "4.x" }
      )}
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

  return (
    <div className={styles.tableContainer}>
      <table className={styles.bundleTable}>
        <thead>
          <tr>
            <th>{translate({ id: 'comparison.bundle.summary.header.aspect', message: 'Aspect' })}</th>
            <th>{translate({ id: 'comparison.bundle.summary.header.kanon', message: 'Kanon' })}</th>
            <th>{translate({ id: 'comparison.bundle.summary.header.zod', message: 'Zod' })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>{translate({ id: 'comparison.bundle.summary.architecture', message: 'Architecture' })}</strong></td>
            <td>{translate({ id: 'comparison.bundle.summary.architectureKanon', message: 'Functions' })}</td>
            <td>{translate({ id: 'comparison.bundle.summary.architectureZod', message: 'Classes' })}</td>
          </tr>
          <tr>
            <td><strong>{translate({ id: 'comparison.bundle.summary.treeShaking', message: 'Tree-shaking' })}</strong></td>
            <td>{translate({ id: 'comparison.bundle.summary.treeShakingKanon', message: '✅ Full' })}</td>
            <td>{translate({ id: 'comparison.bundle.summary.treeShakingZod', message: '❌ Limited' })}</td>
          </tr>
          <tr>
            <td><strong>{translate({ id: 'comparison.bundle.summary.minBundle', message: 'Min bundle' })}</strong></td>
            <td>{kanonSize}</td>
            <td>{zodRange}</td>
          </tr>
          <tr>
            <td><strong>{translate({ id: 'comparison.bundle.summary.scalesWithUsage', message: 'Scales with usage' })}</strong></td>
            <td>{translate({ id: 'comparison.bundle.summary.scalesYes', message: '✅ Yes' })}</td>
            <td>{translate({ id: 'comparison.bundle.summary.scalesMostlyFixed', message: '❌ Mostly fixed' })}</td>
          </tr>
          <tr>
            <td><strong>{translate({ id: 'comparison.bundle.summary.migrationPath', message: 'Migration path' })}</strong></td>
            <td><code>z</code> {translate({ id: 'comparison.bundle.summary.migrationKanon', message: 'z shim available' }).replace(/^z\s*/, '')}</td>
            <td>{translate({ id: 'comparison.common.na', message: 'N/A' })}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BundleSizeComparisonTable;
