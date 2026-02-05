import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface ModuleNameProps {
  name: string;
  to?: string;
  children?: ReactNode;
}

export default function ModuleName({ name, to, children }: ModuleNameProps): ReactNode {
  const content = to ? <Link to={to}>{name}</Link> : name;
  
  return (
    <>
      <span className={styles.moduleName}>{content}</span>
      {children && <> — {children}</>}
    </>
  );
}
