/**
 * Generates a readable index.html dashboard from Lighthouse CI manifest.json.
 * Reads CWV metrics from individual JSON reports and opens the result in the browser.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { exec } from "node:child_process";

const REPORTS_DIR = resolve("reports/cwv");
const MANIFEST_PATH = join(REPORTS_DIR, "manifest.json");

interface ManifestEntry {
  url: string;
  htmlPath: string;
  jsonPath: string;
  summary: Record<string, number>;
}

interface LhrAudit {
  numericValue?: number;
}

interface LhrResult {
  audits: Record<string, LhrAudit>;
}

function scoreColor(score: number): string {
  if (score >= 0.9) return "#0c6";
  if (score >= 0.5) return "#fa3";
  return "#f33";
}

function scoreBadge(score: number | undefined): string {
  if (score === undefined) return "—";
  const pct = Math.round(score * 100);
  return `<span style="display:inline-block;width:48px;text-align:center;padding:4px 8px;border-radius:20px;color:#fff;font-weight:700;background:${scoreColor(score)}">${pct}</span>`;
}

/** Lighthouse metric thresholds: [good, needs-improvement]. Above = poor. */
const THRESHOLDS: Record<string, [number, number]> = {
  fcp:  [1800, 3000],   // ms
  si:   [3400, 5800],   // ms
  lcp:  [2500, 4000],   // ms
  tbt:  [200,  600],    // ms
  cls:  [0.1,  0.25],   // unitless
};

function metricColor(key: string, value: number): string {
  const [good, mid] = THRESHOLDS[key] ?? [0, 0];
  if (value <= good) return "#0c6";
  if (value <= mid) return "#fa3";
  return "#f33";
}

function coloredMetric(key: string, raw: number | undefined, format: (v: number) => string): string {
  if (raw === undefined) return "—";
  const color = metricColor(key, raw);
  return `<span style="color:${color};font-weight:600">${format(raw)}</span>`;
}

const fmtSeconds = (ms: number): string => `${(ms / 1000).toFixed(2)}s`;
const fmtMs = (ms: number): string => `${Math.round(ms)}ms`;
const fmtCls = (v: number): string => v.toFixed(3);

interface CwvMetrics { fcp: string; si: string; lcp: string; tbt: string; cls: string }

function getCwvMetrics(jsonPath: string): CwvMetrics {
  try {
    const lhr: LhrResult = JSON.parse(readFileSync(jsonPath, "utf-8"));
    const get = (id: string): number | undefined => lhr.audits[id]?.numericValue;
    return {
      fcp: coloredMetric("fcp", get("first-contentful-paint"), fmtSeconds),
      si:  coloredMetric("si",  get("speed-index"), fmtSeconds),
      lcp: coloredMetric("lcp", get("largest-contentful-paint"), fmtSeconds),
      tbt: coloredMetric("tbt", get("total-blocking-time"), fmtMs),
      cls: coloredMetric("cls", get("cumulative-layout-shift"), fmtCls),
    };
  } catch {
    return { fcp: "—", si: "—", lcp: "—", tbt: "—", cls: "—" };
  }
}

function prettyUrl(raw: string): string {
  return raw.replace(/^https?:\/\/localhost(:\d+)?/, "") || "/";
}

function main(): void {
  if (!existsSync(MANIFEST_PATH)) {
    console.error("❌ No manifest.json found in reports/cwv/. Run pnpm seo:lighthouse first.");
    process.exit(1);
  }

  const manifest: ManifestEntry[] = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));

  if (manifest.length === 0) {
    console.error("❌ manifest.json is empty.");
    process.exit(1);
  }

  const rows = manifest.map((entry) => {
    const url = prettyUrl(entry.url);
    const htmlFile = basename(entry.htmlPath);
    const cwv = getCwvMetrics(entry.jsonPath);

    return `<tr>
      <td style="text-align:left"><a href="${htmlFile}">${url}</a></td>
      <td>${scoreBadge(entry.summary.performance)}</td>
      <td>${scoreBadge(entry.summary.accessibility)}</td>
      <td>${scoreBadge(entry.summary.seo)}</td>
      <td>${cwv.fcp}</td>
      <td>${cwv.si}</td>
      <td>${cwv.lcp}</td>
      <td>${cwv.tbt}</td>
      <td>${cwv.cls}</td>
    </tr>`;
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Lighthouse Report — Pithos</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0d1117;color:#c9d1d9;padding:32px}
    h1{font-size:1.5rem;margin-bottom:8px}
    .date{color:#8b949e;margin-bottom:24px;font-size:.875rem}
    table{border-collapse:collapse;width:100%}
    th,td{padding:10px 14px;text-align:center;border-bottom:1px solid #21262d}
    th{background:#161b22;color:#8b949e;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em}
    tr:hover{background:#161b22}
    a{color:#58a6ff;text-decoration:none}
    a:hover{text-decoration:underline}
    .legend{margin-top:16px;font-size:.8rem;color:#8b949e}
    .legend span{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:4px;vertical-align:middle}
  </style>
</head>
<body>
  <h1>🔍 Lighthouse Report — Pithos</h1>
  <div class="date">Generated ${new Date().toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
  <table>
    <thead>
      <tr>
        <th style="text-align:left">Page</th>
        <th>Perf</th>
        <th>A11y</th>
        <th>SEO</th>
        <th>FCP</th>
        <th>SI</th>
        <th>LCP</th>
        <th>TBT</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      ${rows.join("\n      ")}
    </tbody>
  </table>
  <div class="legend">
    <span style="background:#0c6"></span> 90–100
    <span style="background:#fa3;margin-left:12px"></span> 50–89
    <span style="background:#f33;margin-left:12px"></span> 0–49
    &nbsp;·&nbsp; FCP = First Contentful Paint · SI = Speed Index · LCP = Largest Contentful Paint · TBT = Total Blocking Time · CLS = Cumulative Layout Shift
  </div>
</body>
</html>`;

  const outPath = join(REPORTS_DIR, "index.html");
  writeFileSync(outPath, html);
  console.log(`✅ Report: ${outPath}`);

  exec(`open ${outPath}`);
}

main();
