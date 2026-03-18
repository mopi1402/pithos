import { STEP_ORDER } from "@/data/profiles";
import { Skeleton, SkeletonBlock } from "./Skeletons";
import type { ResumeSection } from "@/lib/types";

export function ResumeMainContent({ sections, executingStep, completedSteps, accentColor, animating }: {
  sections: { section: ResumeSection; i: number }[];
  executingStep: number | null;
  completedSteps: Set<number>;
  accentColor: string;
  animating: boolean;
}) {
  return (
    <div className="flex-1 min-w-0 overflow-auto">
      {sections.map(({ section, i }) => {
        const stepMeta = STEP_ORDER[i];
        const isExecuting = executingStep === i;
        const isDone = completedSteps.has(i);
        const isVisible = isDone || isExecuting || (executingStep === null && !animating);

        return (
          <div key={stepMeta.key} className={`transition-all duration-300 ${isExecuting ? "relative" : ""}`}>
            {isExecuting && (
              <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ backgroundColor: `${accentColor}06` }} />
            )}
            {i === 0 ? (
              <HeaderSection section={section} isVisible={isVisible} accentColor={accentColor} />
            ) : (
              <ContentSection section={section} stepKey={stepMeta.key} isVisible={isVisible} accentColor={accentColor} />
            )}
          </div>
        );
      })}
      <div className="h-3" />
    </div>
  );
}

function HeaderSection({ section, isVisible, accentColor }: {
  section: ResumeSection;
  isVisible: boolean;
  accentColor: string;
}) {
  return (
    <div className="relative px-6 sm:px-10 pt-7 sm:pt-10 pb-4 sm:pb-6">
      {isVisible ? (
        <div>
          <h1 className="text-[22px] sm:text-[48px] font-bold tracking-tight whitespace-nowrap" style={{ color: "#1a1a1a" }}>
            {section.title}
          </h1>
          {section.subtitle && (
            <p className="text-[13px] sm:text-[20px] font-medium mt-0.5 sm:mt-1" style={{ color: accentColor }}>
              {section.subtitle}
            </p>
          )}
          <div className="flex flex-col gap-0.5 sm:gap-1 mt-1.5 sm:mt-3">
            {section.content.map((line, j) => (
              <span key={j} className={`text-[11px] sm:text-[13px] ${line.includes("@") ? "underline font-semibold" : ""}`} style={{ color: "#71717a" }}>{line}</span>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Skeleton w="180px" h={22} />
          <div className="flex gap-4 mt-3">
            <Skeleton w="100px" h={10} />
            <Skeleton w="80px" h={10} />
          </div>
        </div>
      )}
    </div>
  );
}

function ContentSection({ section, stepKey, isVisible, accentColor }: {
  section: ResumeSection;
  stepKey: string;
  isVisible: boolean;
  accentColor: string;
}) {
  return (
    <div className="relative px-6 sm:px-10 py-4 sm:py-5">
      <div className="flex items-center gap-2 mb-2.5 sm:mb-4">
        <h2 className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: isVisible ? accentColor : "#d4d4d8" }}>
          {section.title}
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: "#f0eeec" }} />
      </div>
      {isVisible ? (
        <div className="space-y-0.5 sm:space-y-1">
          {section.content.map((line, j) => {
            if (line === "") return <div key={j} className="h-2 sm:h-4" />;
            const isSub = line.startsWith("→");
            const isBold = !isSub && (line.includes("—") || line.includes("·"));
            return (
              <p
                key={j}
                className={`text-[11.5px] sm:text-[12.5px] leading-[1.6] ${isSub ? "pl-3 sm:pl-4" : ""}`}
                style={{
                  color: isSub ? "#a1a1aa" : isBold ? "#27272a" : "#52525b",
                  fontWeight: isBold && !line.includes("·") ? 500 : 400,
                }}
              >
                {line}
              </p>
            );
          })}
        </div>
      ) : (
        <SkeletonBlock lines={stepKey === "experience" ? 5 : 3} />
      )}
    </div>
  );
}
