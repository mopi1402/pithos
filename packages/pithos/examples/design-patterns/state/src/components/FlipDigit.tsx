import { useRef, useState, useEffect } from "react";

const DURATION = 350;

interface FlipDigitProps {
  from: string;
  to: string;
  direction?: "forward" | "backward";
  textClass?: string;
  colorFn?: (val: string) => string;
}

function defaultColor(val: string): string {
  if (val === "AD") return "#c75b12";
  if (val === "—") return "#9ca3af";
  return "#403f3d";
}

export function FlipDigit({ from, to, direction = "forward", textClass = "font-bold text-xl", colorFn = defaultColor }: FlipDigitProps) {
  const [flipKey, setFlipKey] = useState(0);
  const lastPairRef = useRef(`${from}|${to}`);

  const same = from === to;

  // Bump key when pair changes to force remount → retrigger animation
  useEffect(() => {
    const pair = `${from}|${to}`;
    if (pair !== lastPairRef.current) {
      lastPairRef.current = pair;
      setFlipKey((k) => k + 1);
    }
  }, [from, to]);

  if (same) {
    return (
      <div className="w-full h-full flex items-center justify-center"
        style={{ color: colorFn(to) }}>
        <span className={textClass}>{to}</span>
      </div>
    );
  }

  const reverse = direction === "backward";
  const top = reverse ? to : from;
  const bot = reverse ? from : to;

  // Forward: [from, to] start 0% end -50%
  // Reverse: [to, from] start -50% end 0%
  const startY = reverse ? "-50%" : "0%";
  const endY = reverse ? "0%" : "-50%";

  return (
    <div className="w-full h-full overflow-hidden">
      <div
        key={flipKey}
        style={{
          height: "200%",
          animation: `flip-slide ${DURATION}ms cubic-bezier(0.4,0,0.2,1) forwards`,
          ["--flip-from" as string]: `translateY(${startY})`,
          ["--flip-to" as string]: `translateY(${endY})`,
        }}
      >
        <div className={`h-1/2 flex items-center justify-center ${textClass}`}
          style={{ color: colorFn(top) }}>{top}</div>
        <div className={`h-1/2 flex items-center justify-center ${textClass}`}
          style={{ color: colorFn(bot) }}>{bot}</div>
      </div>
    </div>
  );
}
