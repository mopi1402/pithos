import type { ReactNode } from "react";
import { REPO_URL, REPO_CLONE_URL } from "@site/src/constants/repo";

export function RepoCloneUrl(): ReactNode {
  return <code>{REPO_CLONE_URL}</code>;
}

export function RepoUrl(): ReactNode {
  return <a href={REPO_URL}>{REPO_URL}</a>;
}
