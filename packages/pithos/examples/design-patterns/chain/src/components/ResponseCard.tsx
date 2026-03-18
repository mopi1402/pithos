import type { Response } from "@/lib/types";

export function ResponseCard({ response }: { response: Response }) {
  const isSuccess = response.status >= 200 && response.status < 300;
  return (
    <section className={`rounded-xl p-4 ${isSuccess ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-2xl font-bold ${isSuccess ? "text-emerald-700" : "text-red-700"}`}>{response.status}</span>
        <span className={`font-medium ${isSuccess ? "text-emerald-600" : "text-red-600"}`}>{response.statusText}</span>
      </div>
      <div className={`text-sm ${isSuccess ? "text-emerald-700" : "text-red-700"}`}>{response.body}</div>
    </section>
  );
}
