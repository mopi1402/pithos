import type { ProfileMeta, ResumeSteps, StepMeta } from "@/lib/types";

/** Step execution order — the skeleton that never changes */
export const STEP_ORDER: StepMeta[] = [
  { key: "header", label: "Header", icon: "👤" },
  { key: "summary", label: "Summary", icon: "📝" },
  { key: "experience", label: "Experience", icon: "💼" },
  { key: "hardSkills", label: "Hard Skills", icon: "⚡" },
  { key: "softSkills", label: "Soft Skills", icon: "🤝" },
  { key: "education", label: "Education", icon: "🎓" },
];

/** Profile display metadata */
export const PROFILES: ProfileMeta[] = [
  { key: "developer", label: "Developer", icon: "💻", color: "#3b82f6", desc: "Full-stack engineer", initials: "SP" },
  { key: "designer", label: "Designer", icon: "🎨", color: "#f472b6", desc: "Product designer", initials: "SP" },
  { key: "manager", label: "Manager", icon: "📊", color: "#22c55e", desc: "Engineering leader", initials: "SP" },
];

/** Default steps — the "base class" */
export const DEFAULT_STEPS: ResumeSteps = {
  header: () => ({
    title: "Sarah Parker",
    subtitle: "Software Professional",
    content: ["sarah.parker@pithos.dev", "(415) 555-0142", "742 Evergreen Terrace", "San Francisco, CA 94110"],
  }),
  summary: () => ({
    title: "Summary",
    content: ["Experienced professional with a strong background in technology and leadership."],
  }),
  experience: () => ({
    title: "Experience",
    content: [
      "Senior Role — Tech Corp (2020–Present)",
      "Mid-Level Role — StartupXYZ (2017–2020)",
    ],
  }),
  hardSkills: () => ({
    title: "Hard Skills",
    content: ["Microsoft Office", "Data Analysis", "Project Management"],
  }),
  softSkills: () => ({
    title: "Soft Skills",
    content: ["Communication", "Problem Solving", "Team Collaboration", "Adaptability"],
  }),
  education: () => ({
    title: "Education",
    content: ["B.S. Computer Science — Stanford University (2017)"],
  }),
};
