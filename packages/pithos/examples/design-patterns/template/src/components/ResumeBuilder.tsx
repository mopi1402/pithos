import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { CvIcon } from "./icons";
import { ProfileCards, MobileProfileTabs } from "./ProfileCards";
import { StepPipeline } from "./StepPipeline";
import { ScaledA4 } from "./ScaledA4";
import { ResumeDocument } from "./ResumeDocument";

export function ResumeBuilder() {
  const { profile, resume, profileMeta, executingStep, completedSteps, animating, runAnimation } = useResumeBuilder();
  const accentColor = profileMeta?.color ?? "#3b82f6";

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] text-white overflow-hidden select-none">
      {/* Mobile */}
      <div className="sm:hidden flex flex-col h-full">
        <div className="px-4 py-3 bg-[#111113] border-b border-white/[0.05] flex items-center gap-3">
          <CvIcon size={22} />
          <span className="w-px h-6 bg-white/10 shrink-0" />
          <span className="text-sm font-medium text-zinc-200">Resume Builder</span>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-3">
          <MobileProfileTabs profile={profile} onChange={runAnimation} disabled={animating} accentColor={accentColor} />
          <ResumeDocument resume={resume} executingStep={executingStep} completedSteps={completedSteps} accentColor={accentColor} animating={animating} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex h-full">
        {/* Left panel */}
        <div className="w-[260px] flex flex-col bg-[#111113] border-r border-white/[0.05] flex-shrink-0">
          <div className="px-5 py-5 flex items-center gap-3.5 bg-[#141416] border-b border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <CvIcon size={26} />
            <span className="w-px h-8 bg-white/10 shrink-0" />
            <div>
              <h1 className="text-[16px] font-bold text-zinc-100 tracking-tight">Resume Builder</h1>
              <p className="text-[10px] text-zinc-500 mt-0.5">Template Method Pattern</p>
            </div>
          </div>
          <div className="px-4 pt-4 pb-4">
            <ProfileCards profile={profile} onChange={runAnimation} disabled={animating} />
          </div>
          <div className="flex-1 px-4 pt-3 pb-4 overflow-auto border-t border-white/[0.05]">
            <StepPipeline overrides={resume.overrides} executingStep={executingStep} completedSteps={completedSteps} accentColor={accentColor} />
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 overflow-hidden bg-[#0a0a0b] flex items-center justify-center p-6">
          <ScaledA4>
            <ResumeDocument resume={resume} executingStep={executingStep} completedSteps={completedSteps} accentColor={accentColor} animating={animating} />
          </ScaledA4>
        </div>
      </div>
    </div>
  );
}
