export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export function extColor(name: string): string {
  const ext = name.split(".").pop() ?? "";
  const map: Record<string, string> = {
    ts: "#3178c6", tsx: "#3178c6", js: "#f7df1e", jsx: "#f7df1e",
    json: "#a8b1c2", md: "#519aba", css: "#563d7c", svg: "#ffb13b",
    html: "#e34c26", test: "#15803d",
  };
  if (name.includes(".test.")) return map.test;
  return map[ext] ?? "#8b949e";
}
