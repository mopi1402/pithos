import { SidebarSkeletonBlock } from "./Skeletons";
import type { ResumeSection } from "@/lib/types";
import personaImg from "/persona.jpg?url";

export function ResumeSidebar({ sections, visibility, accentColor }: {
  sections: { hardSkills: ResumeSection; softSkills: ResumeSection; education: ResumeSection };
  visibility: { hardSkills: boolean; softSkills: boolean; education: boolean };
  accentColor: string;
}) {
  return (
    <div className="w-[120px] sm:w-[280px] flex-shrink-0 flex flex-col overflow-auto" style={{ backgroundColor: accentColor }}>
      <div>
        <img src={personaImg} alt="Sarah Parker" className="w-full aspect-square object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-6 px-4 sm:px-6 py-4 sm:py-6">
        <SidebarSkillList title="Hard Skills" items={sections.hardSkills.content} visible={visibility.hardSkills} skeletonLines={4} />
        <SidebarSkillList title="Soft Skills" items={sections.softSkills.content} visible={visibility.softSkills} skeletonLines={3} />
        <SidebarEducation lines={sections.education.content} visible={visibility.education} />
      </div>
    </div>
  );
}

function SidebarSkillList({ title, items, visible, skeletonLines }: {
  title: string;
  items: string[];
  visible: boolean;
  skeletonLines: number;
}) {
  return (
    <div>
      <h3 className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.14em] mb-2.5 sm:mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
        {title}
      </h3>
      {visible ? (
        <div className="space-y-1.5 sm:space-y-2">
          {items.map((skill, j) => (
            <div key={j} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.4)" }} />
              <span className="text-[11px] sm:text-[13px] leading-tight" style={{ color: "rgba(255,255,255,0.9)" }}>{skill}</span>
            </div>
          ))}
        </div>
      ) : (
        <SidebarSkeletonBlock lines={skeletonLines} />
      )}
    </div>
  );
}

function SidebarEducation({ lines, visible }: { lines: string[]; visible: boolean }) {
  return (
    <div>
      <h3 className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.14em] mb-2.5 sm:mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
        Education
      </h3>
      {visible ? (
        <div className="space-y-2 sm:space-y-3">
          {lines.map((line, j) => (
            <span key={j} className="block text-[10px] sm:text-[12px] leading-[1.5]" style={{ color: "rgba(255,255,255,0.9)" }}>{line}</span>
          ))}
        </div>
      ) : (
        <SidebarSkeletonBlock lines={2} />
      )}
    </div>
  );
}
