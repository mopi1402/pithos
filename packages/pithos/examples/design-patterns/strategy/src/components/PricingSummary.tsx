import { type PricingResult, type PricingStrategyKey } from "@/lib/types";

interface PricingSummaryProps {
  result: PricingResult;
  strategyKey: PricingStrategyKey;
  strategyInfo: { label: string; description: string };
  compact?: boolean;
}

const RED = "#B40024";
const GOLD = "#C5A258";

export function PricingSummary({ result, strategyKey, strategyInfo, compact }: PricingSummaryProps) {
  const hasDiscount = result.discount > 0;
  const showBulkHint = !hasDiscount && strategyKey === "bulk" && result.subtotal < 300;

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-stone-200 p-4 h-24 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: RED }} />
            <span className="text-xs text-stone-500 font-body">{strategyInfo.label}</span>
          </div>
          {hasDiscount && (
            <div className="text-sm text-stone-400 line-through">
              ${result.subtotal.toFixed(2)}
            </div>
          )}
          {showBulkHint && (
            <div className="text-xs" style={{ color: GOLD }}>
              +${(300 - result.subtotal).toFixed(2)} for 25% off
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-display font-semibold text-martins-dark">
            ${result.total.toFixed(2)}
          </div>
          {hasDiscount && (
            <div className="text-sm font-medium" style={{ color: RED }}>
              -{result.discountPercent}% (−${result.discount.toFixed(2)})
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-4 border-b border-stone-200">
        <div className="w-3 h-3 rounded-full" style={{ background: RED }} />
        <span className="text-sm font-medium text-stone-600 font-body">
          Active: {strategyInfo.label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-stone-600 font-body">
          <span>Subtotal</span>
          <span>${result.subtotal.toFixed(2)}</span>
        </div>
        {hasDiscount && (
          <div className="flex justify-between" style={{ color: RED }}>
            <span>Discount ({result.discountPercent}%)</span>
            <span>-${result.discount.toFixed(2)}</span>
          </div>
        )}
        {showBulkHint && (
          <div className="text-xs bg-amber-50 p-2 rounded" style={{ color: GOLD }}>
            Add ${(300 - result.subtotal).toFixed(2)} more to unlock 25% Coffret discount
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-stone-200">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-display font-semibold text-martins-dark">Total</span>
          <div className="text-right">
            <span className="text-2xl font-display font-bold text-martins-dark">
              ${result.total.toFixed(2)}
            </span>
            {hasDiscount && (
              <div className="text-sm font-medium" style={{ color: RED }}>
                You save ${result.discount.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
