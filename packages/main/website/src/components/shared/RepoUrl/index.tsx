import type { ReactNode } from "react";
import packageJson from "../../../../../../pithos/package.json";

const repoUrl = packageJson.repository.url.replace("git+", "").replace(".git", "");
const cloneUrl = packageJson.repository.url.replace("git+", "");

export function RepoCloneUrl(): ReactNode {
  return <code>{cloneUrl}</code>;
}

export function RepoUrl(): ReactNode {
  return <a href={repoUrl}>{repoUrl}</a>;
}
