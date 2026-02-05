export interface BundleResult {
  utilName: string;
  category: string;
  library: string;
  libraryFunctionName: string | null;
  rawBytes: number | null;
  gzipBytes: number | null;
  brotliBytes: number | null;
  error?: string;
}

export interface ModuleData {
  topUtils: string[];
  libraries: string[];
  results: BundleResult[];
}

export interface BundleData {
  generatedAt: string;
  versions: Record<string, string>;
  modules: {
    arkhe: ModuleData;
    taphos: ModuleData;
  };
}
