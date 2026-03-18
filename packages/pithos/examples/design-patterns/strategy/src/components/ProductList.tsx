import { type Product } from "@/lib/types";
import { Minus, Plus } from "lucide-react";

interface ProductListProps {
  products: Product[];
  onQuantityChange: (index: number, quantity: number) => void;
  compact?: boolean;
}

export function ProductList({ products, onQuantityChange, compact }: ProductListProps) {
  if (compact) {
    return (
      <div className="divide-y divide-stone-100">
        {products.map((product, index) => (
          <div key={product.name} className="flex items-center justify-between p-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-martins-dark text-sm truncate font-body">
                {product.name}
              </div>
              <div className="text-xs text-stone-500">
                ${product.basePrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-2 mx-3">
              <QuantityButton onClick={() => onQuantityChange(index, product.quantity - 1)} icon="minus" />
              <span className="w-6 text-center font-semibold text-martins-dark text-sm">
                {product.quantity}
              </span>
              <QuantityButton onClick={() => onQuantityChange(index, product.quantity + 1)} icon="plus" />
            </div>
            <div className="text-right font-semibold text-martins-dark text-sm w-16 font-body">
              ${(product.basePrice * product.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-100">
      {products.map((product, index) => (
        <div key={product.name} className="flex items-center gap-4 p-2">
          {product.image && (
            <img src={product.image} alt={product.name} className="w-16 h-16 object-contain shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium text-martins-dark font-body">{product.name}</div>
                <div className="text-sm text-stone-500">${product.basePrice.toFixed(2)} each</div>
              </div>
              <div className="text-right font-semibold text-martins-dark font-body">
                ${(product.basePrice * product.quantity).toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <QuantityButton onClick={() => onQuantityChange(index, product.quantity - 1)} icon="minus" size="lg" />
              <span className="w-8 text-center font-semibold text-martins-dark">{product.quantity}</span>
              <QuantityButton onClick={() => onQuantityChange(index, product.quantity + 1)} icon="plus" size="lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuantityButton({ onClick, icon, size = "sm" }: { onClick: () => void; icon: "plus" | "minus"; size?: "sm" | "lg" }) {
  const cls = size === "lg"
    ? "w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-martins-red/30 hover:bg-martins-red/5 transition-colors"
    : "w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center hover:bg-martins-red/10 transition-colors";
  const iconCls = size === "lg" ? "w-4 h-4 text-martins-dark" : "w-3 h-3 text-stone-600";

  return (
    <button onClick={onClick} className={cls} aria-label={icon === "plus" ? "Increase quantity" : "Decrease quantity"}>
      {icon === "minus" ? <Minus className={iconCls} /> : <Plus className={iconCls} />}
    </button>
  );
}
