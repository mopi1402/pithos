import type { ProfileKey, ResumeSteps } from "@/lib/types";

/** Profile overrides — the "subclasses" that customize specific steps */
export const PROFILE_OVERRIDES: Record<ProfileKey, Partial<ResumeSteps>> = {
  developer: {
    header: () => ({
      title: "Sarah Parker",
      subtitle: "Senior Software Engineer",
      content: ["sarah.parker@pithos.dev", "(415) 555-0142", "742 Evergreen Terrace", "San Francisco, CA 94110"],
    }),
    summary: () => ({
      title: "Summary",
      content: [
        "Full-stack engineer with 7+ years shipping scalable products.",
        "Clean architecture, performance, and developer experience.",
      ],
    }),
    experience: () => ({
      title: "Experience",
      content: [
        "Senior Engineer — Stripe (2021–Present)",
        "→ Led monolith-to-microservices migration, reducing deploy time by 60%",
        "→ Built real-time payment pipeline handling 10k TPS",
        "→ Designed event-driven fraud detection architecture",
        "",
        "Software Engineer — Figma (2019–2021)",
        "→ Implemented rendering engine for auto-layout v4",
        "→ Optimized WebSocket sync, cutting latency by 40%",
        "→ Built plugin API used by 2k+ developers",
        "",
        "Frontend Developer — Airbnb (2017–2019)",
        "→ Built host onboarding SPA in React (95% test coverage)",
        "→ Created shared component library used across 8 teams",
      ],
    }),
    hardSkills: () => ({
      title: "Hard Skills",
      content: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "Redis"],
    }),
    softSkills: () => ({
      title: "Soft Skills",
      content: ["Problem Solving", "Code Review", "Mentoring", "Technical Writing"],
    }),
    education: () => ({
      title: "Education",
      content: ["B.S. Computer Science — Stanford University (2017)"],
    }),
  },

  designer: {
    header: () => ({
      title: "Sarah Parker",
      subtitle: "Senior Product Designer",
      content: ["sarah.parker@pithos.dev", "(415) 555-0142", "742 Evergreen Terrace", "San Francisco, CA 94110", "sarahparker.design"],
    }),
    summary: () => ({
      title: "Summary",
      content: [
        "Product designer with 7+ years bridging design and engineering.",
        "Design systems, interaction design, and user research.",
      ],
    }),
    experience: () => ({
      title: "Experience",
      content: [
        "Design Engineer — Stripe (2021–Present)",
        "→ Designed payment dashboard used by 500k+ merchants",
        "→ Built and maintained internal design token system",
        "→ Reduced support tickets by 25% through improved error states",
        "",
        "Product Designer — Figma (2019–2021)",
        "→ Designed the auto-layout v4 interaction model",
        "→ Led design system adoption across 12 product teams",
        "",
        "UX Designer — Airbnb (2017–2019)",
        "→ Redesigned host onboarding flow (+35% completion)",
        "→ Created company-wide accessibility guidelines",
      ],
    }),
    hardSkills: () => ({
      title: "Hard Skills",
      content: ["Figma", "Sketch", "Framer", "Principle", "After Effects", "HTML/CSS"],
    }),
    softSkills: () => ({
      title: "Soft Skills",
      content: ["Empathy", "Visual Thinking", "Storytelling", "Cross-team Collaboration"],
    }),
    education: () => ({
      title: "Education",
      content: [
        "B.S. Computer Science — Stanford University (2017)",
        "Minor in Human-Computer Interaction",
      ],
    }),
  },

  manager: {
    header: () => ({
      title: "Sarah Parker",
      subtitle: "VP of Engineering",
      content: ["sarah.parker@pithos.dev", "(415) 555-0142", "742 Evergreen Terrace", "San Francisco, CA 94110"],
    }),
    summary: () => ({
      title: "Summary",
      content: [
        "Engineering leader with 7+ years scaling teams and shipping products.",
        "Growing orgs from 5 to 50+ engineers while maintaining velocity.",
      ],
    }),
    experience: () => ({
      title: "Experience",
      content: [
        "Engineering Manager — Stripe (2021–Present)",
        "→ Grew payments team from 6 to 22 engineers across 3 squads",
        "→ Introduced OKR framework, +40% cross-team alignment",
        "→ Reduced attrition from 18% to 6% via career development",
        "",
        "Tech Lead — Figma (2019–2021)",
        "→ Managed 8-person team that shipped auto-layout v4",
        "→ Defined hiring bar and onboarding process",
        "",
        "Team Lead — Airbnb (2017–2019)",
        "→ Led 5-person host experience squad through full redesign",
        "→ Shipped 3 major releases with zero P0 incidents",
      ],
    }),
    hardSkills: () => ({
      title: "Hard Skills",
      content: ["Jira", "Confluence", "Notion", "Looker", "SQL", "Python"],
    }),
    softSkills: () => ({
      title: "Soft Skills",
      content: ["Leadership", "Negotiation", "Strategic Thinking", "Conflict Resolution"],
    }),
    education: () => ({
      title: "Education",
      content: [
        "MBA — Wharton School of Business (2021)",
        "B.S. Computer Science — Stanford University (2017)",
      ],
    }),
  },
};
