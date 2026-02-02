// scripts/common/format-utils.ts
// Formatting utilities for scripts

/**
 * Formats bytes into a human-readable string.
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.23 kB", "456 B")
 */
export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} kB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
}

/**
 * Formats a percentage difference between two values.
 * @param current - Current value
 * @param baseline - Baseline value to compare against
 * @returns Formatted string with emoji indicator
 */
export function formatDiff(current: number, baseline: number): string {
    if (baseline === 0) return "N/A";
    const diff = current - baseline;
    const percent = ((diff / baseline) * 100).toFixed(1);
    const sign = diff > 0 ? "+" : "";
    const emoji = diff < 0 ? "✅" : diff === 0 ? "➖" : "⚠️";
    return `${emoji} ${sign}${formatBytes(diff)} (${sign}${percent}%)`;
}
