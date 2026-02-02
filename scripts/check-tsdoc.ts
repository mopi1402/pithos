import {
  Project,
  type SourceFile,
  type JSDoc,
  type FunctionDeclaration,
  type ClassDeclaration,
  type InterfaceDeclaration,
  type TypeAliasDeclaration,
  type VariableDeclaration,
  type EnumDeclaration,
  Node,
} from "ts-morph";
import path from "path";
import { fileURLToPath } from "url";
import { shouldSkipSourceFile } from "./common/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TSDocIssue {
  file: string;
  name: string;
  type: "function" | "class" | "interface" | "type" | "const" | "enum";
  line: number;
  issue: "missing-jsdoc" | "missing-since" | "invalid-since";
}

type ExportedElement =
  | FunctionDeclaration
  | ClassDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration
  | VariableDeclaration
  | EnumDeclaration;

class TSDocChecker {
  private project: Project;
  private issues: TSDocIssue[] = [];
  private readonly allowedRoot: string;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(__dirname, "../tsconfig.json"),
    });
    this.allowedRoot = path.resolve(process.cwd(), "packages/pithos/src");
  }

  public checkAll(): void {
    console.log("🔍 Checking TSDoc compliance...\n");

    const sourceFiles = this.project.getSourceFiles();

    for (const sourceFile of sourceFiles) {
      if (this.shouldSkipFile(sourceFile.getFilePath())) {
        continue;
      }
      this.checkSourceFile(sourceFile);
    }

    this.reportIssues();
  }

  private shouldSkipFile(filePath: string): boolean {
    const absolutePath = path.resolve(filePath);
    if (!absolutePath.startsWith(this.allowedRoot)) {
      return true;
    }
    const relativePath = path.relative(process.cwd(), filePath);
    return shouldSkipSourceFile(relativePath);
  }

  private checkSourceFile(sourceFile: SourceFile): void {
    const relativePath = path.relative(process.cwd(), sourceFile.getFilePath());

    // For functions with overloads, we need to check them as a group
    const processedFunctions = new Set<string>();
    
    for (const func of sourceFile.getFunctions()) {
      if (func.isExported()) {
        const funcName = func.getName() ?? "<anonymous>";
        
        // Skip if we already processed this function (handles overloads)
        if (processedFunctions.has(funcName)) {
          continue;
        }
        processedFunctions.add(funcName);
        
        this.checkElement(func, relativePath, "function");
      }
    }

    for (const cls of sourceFile.getClasses()) {
      if (cls.isExported()) {
        this.checkElement(cls, relativePath, "class");
      }
    }

    for (const iface of sourceFile.getInterfaces()) {
      if (iface.isExported()) {
        this.checkElement(iface, relativePath, "interface");
      }
    }

    for (const typeAlias of sourceFile.getTypeAliases()) {
      if (typeAlias.isExported()) {
        this.checkElement(typeAlias, relativePath, "type");
      }
    }

    for (const variable of sourceFile.getVariableDeclarations()) {
      if (variable.isExported()) {
        this.checkElement(variable, relativePath, "const");
      }
    }

    for (const enumDecl of sourceFile.getEnums()) {
      if (enumDecl.isExported()) {
        this.checkElement(enumDecl, relativePath, "enum");
      }
    }
  }

  /**
   * Gets JSDoc nodes for an element using ts-morph AST only.
   * For VariableDeclaration, JSDoc is attached to the parent VariableStatement.
   * For FunctionDeclaration with overloads, checks overload signatures for JSDoc.
   */
  private getJsDocs(element: ExportedElement): JSDoc[] {
    // VariableDeclaration: JSDoc is on the VariableStatement parent
    if (Node.isVariableDeclaration(element)) {
      const statement = element.getVariableStatement();
      return statement?.getJsDocs() ?? [];
    }

    // FunctionDeclaration: Check overload signatures for JSDoc
    if (Node.isFunctionDeclaration(element)) {
      // First check the implementation itself
      const implDocs = element.getJsDocs();
      if (implDocs.length > 0) {
        return implDocs;
      }
      
      // If no JSDoc on implementation, check overload signatures
      const overloads = element.getOverloads();
      for (const overload of overloads) {
        const docs = overload.getJsDocs();
        if (docs.length > 0) {
          return docs;
        }
      }
      
      return [];
    }

    // All other elements have getJsDocs directly
    if ("getJsDocs" in element) {
      return element.getJsDocs();
    }

    return [];
  }

  /**
   * Extracts the @since tag value from JSDoc using ts-morph AST.
   */
  private getSinceTagValue(jsDocs: JSDoc[]): string | null {
    for (const jsDoc of jsDocs) {
      for (const tag of jsDoc.getTags()) {
        if (tag.getTagName() === "since") {
          // getCommentText() returns the text after the tag name
          const comment = tag.getCommentText();
          return comment?.trim() ?? "";
        }
      }
    }
    return null;
  }

  /**
   * Checks if the element has an @ignore tag in its JSDoc.
   * Elements with @ignore are excluded from documentation and don't need @since.
   */
  private hasIgnoreTag(jsDocs: JSDoc[]): boolean {
    for (const jsDoc of jsDocs) {
      for (const tag of jsDoc.getTags()) {
        if (tag.getTagName() === "ignore") {
          return true;
        }
      }
    }
    return false;
  }

  private checkElement(
    element: ExportedElement,
    filePath: string,
    type: TSDocIssue["type"]
  ): void {
    const name = element.getName() ?? "<anonymous>";
    const line = element.getStartLineNumber();

    const jsDocs = this.getJsDocs(element);

    // Skip elements with @ignore tag - they are excluded from documentation
    if (this.hasIgnoreTag(jsDocs)) {
      return;
    }

    if (jsDocs.length === 0) {
      this.issues.push({ file: filePath, name, type, line, issue: "missing-jsdoc" });
      return;
    }

    const sinceValue = this.getSinceTagValue(jsDocs);

    if (sinceValue === null) {
      this.issues.push({ file: filePath, name, type, line, issue: "missing-since" });
      return;
    }

    if (sinceValue === "") {
      this.issues.push({ file: filePath, name, type, line, issue: "invalid-since" });
    }
  }

  private reportIssues(): void {
    if (this.issues.length === 0) {
      console.log(
        "✅ All exported elements have proper TSDoc documentation with @since tags!"
      );
      return;
    }

    const issuesByType = this.groupIssuesByType();

    for (const [issueType, issues] of Object.entries(issuesByType)) {
      console.log(
        `📋 ${this.getIssueTypeLabel(issueType)} (${issues.length}):`
      );

      for (const issue of issues) {
        console.log(
          `   ${issue.file}:${issue.line} - ${issue.type} '${issue.name}'`
        );
      }
      console.log();
    }

    console.log(`❌ Found ${this.issues.length} TSDoc issues:\n`);
    process.exit(1);
  }

  private groupIssuesByType(): Record<string, TSDocIssue[]> {
    return this.issues.reduce((groups, issue) => {
      if (!groups[issue.issue]) {
        groups[issue.issue] = [];
      }
      groups[issue.issue].push(issue);
      return groups;
    }, {} as Record<string, TSDocIssue[]>);
  }

  private getIssueTypeLabel(issueType: string): string {
    switch (issueType) {
      case "missing-jsdoc":
        return "Missing JSDoc comments";
      case "missing-since":
        return "Missing @since tag";
      case "invalid-since":
        return "Invalid @since tag (empty value)";
      default:
        return issueType;
    }
  }
}

const checker = new TSDocChecker();
checker.checkAll();
