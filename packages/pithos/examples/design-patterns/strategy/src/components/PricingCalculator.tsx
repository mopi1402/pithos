import { usePricingCalculator } from "@/hooks/usePricingCalculator";
import { STRATEGY_INFO } from "@/data/products";
import { StrategySelector } from "./StrategySelector";
import { ProductList } from "./ProductList";
import { PricingSummary } from "./PricingSummary";

export function PricingCalculator() {
  const { strategy, setStrategy, products, result, updateQuantity } = usePricingCalculator();

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-col h-screen max-w-2xl mx-auto md:hidden">
        <div className="shrink-0 bg-martins-cream px-3 pt-3 space-y-3">
          <div className="flex justify-center py-2">
            <img src="martins-logo.svg" alt="Martins Paris" className="h-8 object-contain" />
          </div>
          <PricingSummary
            result={result}
            strategyKey={strategy}
            strategyInfo={STRATEGY_INFO[strategy]}
            compact
          />
          <div className="border-t border-stone-200" />
          <div>
            <div className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-1 font-body">
              Select a strategy
            </div>
            <StrategySelector selected={strategy} onSelect={setStrategy} strategies={STRATEGY_INFO} />
          </div>
          <div className="border-t border-stone-200" />
          <div className="text-xs font-medium text-stone-500 uppercase tracking-widest font-body">
            Your bag
          </div>
        </div>
        <div className="flex-1 overflow-auto px-3 pb-3">
          <div className="bg-white rounded-lg border border-stone-200">
            <ProductList products={products} onQuantityChange={updateQuantity} compact />
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-center mb-4">
          <img src="martins-logo.svg" alt="Martins Paris" className="h-11 object-contain" />
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-sm uppercase tracking-widest text-stone-500 font-body mb-4">
              Select Pricing Strategy
            </h2>
            <StrategySelector selected={strategy} onSelect={setStrategy} strategies={STRATEGY_INFO} expanded />
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-sm uppercase tracking-widest text-stone-500 font-body mb-4">
                Your Bag
              </h2>
              <ProductList products={products} onQuantityChange={updateQuantity} />
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-sm uppercase tracking-widest text-stone-500 font-body mb-4">
                Price Breakdown
              </h2>
              <PricingSummary result={result} strategyKey={strategy} strategyInfo={STRATEGY_INFO[strategy]} />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
