import { type PricingStrategyKey } from "@/lib/types";
import { Crown, Tag, Percent, Package } from "lucide-react";

interface StrategySelectorProps {
  selected: PricingStrategyKey;
  onSelect: (key: PricingStrategyKey) => void;
  strategies: Record<PricingStrategyKey, { label: string; description: string }>;
  expanded?: boolean;
}

const icons: Record<PricingStrategyKey, React.ReactNode> = {
  regular: <Tag className="w-4 h-4" />,
  vip: <Crown className="w-4 h-4" />,
  promo: <Percent className="w-4 h-4" />,
  bulk: <Package className="w-4 h-4" />,
};

const benefits: Record<PricingStrategyKey, string> = {
  regular: "Full price",
  vip: "−20% loyalty",
  promo: "−15% seasonal",
  bulk: "−25% if >$300",
};

const RED = "#B40024";

export function StrategySelector({ selected, onSelect, strategies, expanded }: StrategySelectorProps) {
  const keys = Object.keys(strategies) as PricingStrategyKey[];

  if (expanded) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {keys.map((key) => {
          const info = strategies[key];
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected ? "bg-red-50/60" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
              style={isSelected ? { borderColor: RED } : undefined}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ background: isSelected ? RED : "#f5f5f4", color: isSelected ? "#fff" : "#78716c" }}
              >
                {icons[key]}
              </div>
              <div className="font-medium text-martins-dark">{info.label}</div>
              <div className="text-xs text-stone-500 mt-1">{info.description}</div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: RED }} />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 py-2">
      {keys.map((key) => {
        const info = strategies[key];
        const isSelected = selected === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isSelected ? "text-white shadow-md" : "bg-white border border-stone-200 text-stone-700 hover:border-stone-300"
            }`}
            style={isSelected ? { background: RED } : undefined}
          >
            <div className={`shrink-0 ${isSelected ? "text-white" : "text-stone-400"}`}>
              {icons[key]}
            </div>
            <div className="text-left min-w-0">
              <div className="text-sm font-medium truncate">{info.label}</div>
              <div className={`text-xs truncate ${isSelected ? "text-white/80" : "text-stone-500"}`}>
                {benefits[key]}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
