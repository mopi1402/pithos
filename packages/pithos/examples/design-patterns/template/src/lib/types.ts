export interface ResumeSection {
  title: string;
  subtitle?: string;
  content: string[];
}

export interface ResumeSteps {
  header: () => ResumeSection;
  summary: () => ResumeSection;
  experience: () => ResumeSection;
  hardSkills: () => ResumeSection;
  softSkills: () => ResumeSection;
  education: () => ResumeSection;
}

export interface ResumeData {
  sections: ResumeSection[];
  /** Which step keys were overridden by the profile */
  overrides: (keyof ResumeSteps)[];
}

export type ProfileKey = "developer" | "designer" | "manager";

export interface StepMeta {
  key: keyof ResumeSteps;
  label: string;
  icon: string;
}

export interface ProfileMeta {
  key: ProfileKey;
  label: string;
  icon: string;
  color: string;
  desc: string;
  initials: string;
}
