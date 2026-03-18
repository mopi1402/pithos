/**
 * Resume builder using the Template Method pattern.
 *
 * The skeleton is fixed: Header → Summary → Experience → Skills → Education.
 * Each profile overrides specific steps via `templateWithDefaults`.
 */

import { templateWithDefaults } from "@pithos/core/eidos/template/template";
import { DEFAULT_STEPS } from "@/data/profiles";
import { PROFILE_OVERRIDES } from "@/data/overrides";
import type { ProfileKey, ResumeData, ResumeSection, ResumeSteps } from "./types";

/** The skeleton — step order never changes */
const buildResume = templateWithDefaults(
  (steps: ResumeSteps) =>
    (): ResumeSection[] => [
      steps.header(),
      steps.summary(),
      steps.experience(),
      steps.hardSkills(),
      steps.softSkills(),
      steps.education(),
    ],
  DEFAULT_STEPS,
);

/** Get the list of step keys that a profile overrides */
export function getOverrides(profile: ProfileKey): (keyof ResumeSteps)[] {
  return Object.keys(PROFILE_OVERRIDES[profile]) as (keyof ResumeSteps)[];
}

/** Generate a resume for a given profile */
export function generateResume(profile: ProfileKey): ResumeData {
  const overrides = PROFILE_OVERRIDES[profile];
  const generator = buildResume(overrides);
  return {
    sections: generator(),
    overrides: getOverrides(profile),
  };
}
