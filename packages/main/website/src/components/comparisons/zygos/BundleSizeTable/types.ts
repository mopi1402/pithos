export interface BundleResult {
  module: string;
  variant: string;
  category: string;
  description: string;
  rawBytes: number;
  gzipBytes: number;
  brotliBytes: number;
}

export interface VersionInfo {
  pithos: string;
  neverthrow: string;
  "fp-ts": string;
}

export interface BundleData {
  generatedAt: string;
  versions: VersionInfo;
  results: BundleResult[];
}
