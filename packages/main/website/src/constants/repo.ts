import packageJson from "../../../../pithos/package.json";

export const REPO_URL = packageJson.repository.url.replace("git+", "").replace(".git", "");
export const REPO_CLONE_URL = packageJson.repository.url.replace("git+", "");
export const REPO_ISSUES_URL = `${REPO_URL}/issues`;
