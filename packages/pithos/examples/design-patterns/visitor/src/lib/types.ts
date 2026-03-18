export type EmailBlock =
  | { type: "header"; text: string; level: 1 | 2 | 3 }
  | { type: "text"; content: string }
  | { type: "image"; src: string; alt: string }
  | { type: "button"; label: string; url: string }
  | { type: "divider" };

export interface BlockDef {
  type: EmailBlock["type"];
  label: string;
  emoji: string;
  create: () => EmailBlock;
}

export interface AuditResult {
  block: EmailBlock;
  index: number;
  severity: "pass" | "warning" | "error";
  message: string;
}

export type VisitorKey = "preview" | "html" | "plaintext" | "audit";
