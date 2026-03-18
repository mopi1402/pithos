import { Dna } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

export function ResultPanel({ result, error }: { result: AnalysisResult | null; error: string | null }) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <div className="font-semibold mb-1">Analysis Failed</div>
        <div className="text-sm">{error}</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
        <Dna className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No results yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900">{result.gcContent}%</div>
          <div className="text-xs text-slate-500">GC Content</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900">{result.length}</div>
          <div className="text-xs text-slate-500">Base Pairs</div>
        </div>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-700">Quality Score</span>
          <span className="text-lg font-bold text-emerald-700">{result.quality}/100</span>
        </div>
        <div className="mt-2 h-2 bg-emerald-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${result.quality}%` }} />
        </div>
      </div>
    </div>
  );
}
