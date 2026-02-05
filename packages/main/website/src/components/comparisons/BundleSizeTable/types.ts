export interface BundleResult {
  name: string;
  variant: string;
  category: string;
  test: string;
  description: string;
  rawBytes: number;
  gzipBytes: number;
  brotliBytes: number;
}

export interface VersionInfoData {
  kanon: string;
  zod3: string;
  zod4: string;
}

export interface BundleData {
  generatedAt: string;
  versions: VersionInfoData;
  results: BundleResult[];
}
