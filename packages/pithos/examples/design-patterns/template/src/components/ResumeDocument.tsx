import { ResumeSidebar } from "./ResumeSidebar";
import { ResumeMainContent } from "./ResumeMainContent";
import type { ResumeData } from "@/lib/types";

export function ResumeDocument({ resume, executingStep, completedSteps, accentColor, animating }: {
  resume: ResumeData;
  executingStep: number | null;
  completedSteps: Set<number>;
  accentColor: string;
  animating: boolean;
}) {
  const sidebarSections = {
    hardSkills: resume.sections[3],
    softSkills: resume.sections[4],
    education: resume.sections[5],
  };

  const sidebarVisibility = {
    hardSkills: completedSteps.has(3) || executingStep === 3 || (executingStep === null && !animating),
    softSkills: completedSteps.has(4) || executingStep === 4 || (executingStep === null && !animating),
    education: completedSteps.has(5) || executingStep === 5 || (executingStep === null && !animating),
  };

  const mainSections = resume.sections
    .map((section, i) => ({ section, i }))
    .filter(({ i }) => i <= 2);

  return (
    <div className="w-full h-full overflow-hidden shadow-2xl shadow-black/50 flex" style={{ background: "#fafaf9" }}>
      <ResumeSidebar sections={sidebarSections} visibility={sidebarVisibility} accentColor={accentColor} />
      <ResumeMainContent sections={mainSections} executingStep={executingStep} completedSteps={completedSteps} accentColor={accentColor} animating={animating} />
    </div>
  );
}
