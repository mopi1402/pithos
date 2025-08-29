import { Project, Node, SourceFile } from "ts-morph";
import * as path from "path";
import * as fs from "fs";

interface ExportInfo {
  name: string;
  filePath: string;
  isDefault: boolean;
  isType: boolean;
}

interface FileStructure {
  exports: ExportInfo[];
  subfolders: Map<string, FileStructure>;
}

class AutocompletionGenerator {
  private project: Project;
  private structure: FileStructure;
  private srcDir: string;
  private distDir: string;
  private packageName: string;

  constructor(srcDir = "./src", distDir = "./dist") {
    this.srcDir = path.resolve(srcDir);
    this.distDir = path.resolve(distDir);
    this.structure = {
      exports: [],
      subfolders: new Map(),
    };
    this.packageName = this.getPackageName();

    // Initialize ts-morph project
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
      skipAddingFilesFromTsConfig: true,
    });
  }

  /**
   * Reads package name from package.json
   */
  private getPackageName(): string {
    try {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      return packageJson.name || "your-package";
    } catch (error) {
      console.warn(
        "⚠️  Could not read package.json, using 'your-package' as fallback"
      );
      return "your-package";
    }
  }

  /**
   * Main entry point
   */
  async generate(): Promise<void> {
    console.log("🔍 Analyzing exports in:", this.srcDir);

    // Add all TypeScript source files (excluding type definition files)
    this.project.addSourceFilesAtPaths([
      `${this.srcDir}/**/*.ts`,
      `!${this.srcDir}/**/*.d.ts`,
    ]);

    // Analyze each file and build the structure
    const sourceFiles = this.project.getSourceFiles();

    if (sourceFiles.length === 0) {
      console.warn("⚠️  No TypeScript files found in", this.srcDir);
      return;
    }

    sourceFiles.forEach((sourceFile) => {
      this.analyzeSourceFile(sourceFile);
    });

    // Generate the d.ts file
    this.generateDtsFile();

    console.log(
      `✅ File generated: ${path.join(this.distDir, "autocompletion.d.ts")}`
    );
  }

  /**
   * Analyzes a source file to extract its exports
   */
  private analyzeSourceFile(sourceFile: SourceFile): void {
    const filePath = sourceFile.getFilePath();
    const relativePath = path
      .relative(this.srcDir, filePath)
      .replace(/\\/g, "/") // Normalize separators for cross-platform
      .replace(/\.ts$/, ""); // Remove .ts extension

    // Get all named exports from the file
    const fileExports = sourceFile.getExportedDeclarations();
    const exports: ExportInfo[] = [];

    fileExports.forEach((declarations, exportName) => {
      declarations.forEach((declaration) => {
        // Determine if it's a type/interface/enum
        const isType =
          Node.isTypeAliasDeclaration(declaration) ||
          Node.isInterfaceDeclaration(declaration) ||
          Node.isEnumDeclaration(declaration);

        exports.push({
          name: exportName,
          filePath: relativePath,
          isDefault: false,
          isType,
        });
      });
    });

    // Handle default export separately
    const defaultExport = sourceFile.getDefaultExportSymbol();
    if (defaultExport) {
      const fileName = path.basename(relativePath);
      exports.push({
        name: fileName,
        filePath: relativePath,
        isDefault: true,
        isType: false,
      });
    }

    // Add exports to the hierarchical structure
    if (exports.length > 0) {
      this.addToStructure(relativePath, exports);
    }
  }

  /**
   * Adds exports to the hierarchical structure
   */
  private addToStructure(filePath: string, exports: ExportInfo[]): void {
    const parts = filePath.split("/");
    let current = this.structure;

    // Navigate through the folder structure (excluding the file name)
    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i];
      if (!current.subfolders.has(folderName)) {
        current.subfolders.set(folderName, {
          exports: [],
          subfolders: new Map(),
        });
      }
      current = current.subfolders.get(folderName)!;
    }

    // Add file as a "namespace" containing its exports
    const fileName = parts[parts.length - 1];
    if (!current.subfolders.has(fileName)) {
      current.subfolders.set(fileName, {
        exports: [],
        subfolders: new Map(),
      });
    }

    // Avoid duplicates by checking if export already exists
    const fileNode = current.subfolders.get(fileName)!;
    exports.forEach((exp) => {
      const exists = fileNode.exports.some(
        (existing) =>
          existing.name === exp.name && existing.isDefault === exp.isDefault
      );
      if (!exists) {
        fileNode.exports.push(exp);
      }
    });
  }

  /**
   * Generates the autocompletion.d.ts file
   */
  private generateDtsFile(): void {
    // Create dist directory if it doesn't exist
    if (!fs.existsSync(this.distDir)) {
      fs.mkdirSync(this.distDir, { recursive: true });
    }

    let content = `/**
 * 🤖 Autocompletion file generated automatically
 * ⚠️  DO NOT MODIFY MANUALLY
 * 
 * This file provides structured autocompletion for your IDE.
 * Navigate through the structure: math.geometry.distance
 * 
 * To preserve tree-shaking in production, use direct imports:
 * ❌ import { distance } from '${this.packageName}/autocompletion';
 * ❌ const distance = math.geometry.distance; // from autocompletion
 * ✅ import { distance } from '${this.packageName}/math/geometry';
 * 
 * Generated on: ${new Date().toISOString()}
 */

`;

    // Generate the main nested structure
    content += this.generateNestedStructure(this.structure, 0);

    // Export top-level namespaces directly for easy access
    content += `\n// ============================================\n`;
    content += `// 🎯 Direct namespace exports\n`;
    content += `// ============================================\n\n`;

    // Export each top-level folder as a namespace
    const topLevelFolders = Array.from(this.structure.subfolders.keys()).sort();
    topLevelFolders.forEach((folderName) => {
      // Only export if it has content
      const folder = this.structure.subfolders.get(folderName)!;
      if (this.hasContent(folder)) {
        // Find the first available export for the example
        const example = this.findFirstExport(folder, folderName);

        content += `/** \n`;
        content += ` * @deprecated ⚠️ For autocompletion only.\n`;
        content += ` * Use direct imports from '${folderName}/...' to preserve tree-shaking.\n`;
        if (example) {
          content += ` * @example\n`;
          content += ` * import { ${example.exportName} } from '${this.packageName}/${example.path}';\n`;
        }
        content += ` */\n`;
        content += `declare const ${folderName}: typeof _autocompletion.${folderName};\n`;
        content += `export { ${folderName} };\n\n`;
      }
    });

    // Write the file
    const outputPath = path.join(this.distDir, "autocompletion.d.ts");
    fs.writeFileSync(outputPath, content, "utf-8");
  }

  /**
   * Finds the first available export in a structure for examples
   */
  private findFirstExport(
    structure: FileStructure,
    basePath: string
  ): { exportName: string; path: string } | null {
    // First, check direct files in this folder
    for (const [name, sub] of structure.subfolders) {
      if (sub.exports.length > 0) {
        // Find first non-type export
        const firstExport = sub.exports.find((exp) => !exp.isType);
        if (firstExport) {
          return {
            exportName: firstExport.name,
            path: firstExport.filePath,
          };
        }
      }
    }

    // If no direct exports, check nested folders
    for (const [name, sub] of structure.subfolders) {
      if (sub.subfolders.size > 0) {
        const nested = this.findFirstExport(sub, `${basePath}/${name}`);
        if (nested) return nested;
      }
    }

    return null;
  }

  /**
   * Checks if a structure node has any content (exports or nested content)
   */
  private hasContent(structure: FileStructure): boolean {
    if (structure.exports.length > 0) return true;

    for (const [_, sub] of structure.subfolders) {
      if (this.hasContent(sub)) return true;
    }

    return false;
  }

  /**
   * Converts kebab-case to snake_case for valid JS identifiers
   */
  private toSnakeCase(str: string): string {
    return str.replace(/-/g, "_");
  }

  /**
   * Generates the nested namespace structure
   */
  private generateNestedStructure(
    structure: FileStructure,
    depth: number
  ): string {
    let content = "";
    const indent = "  ".repeat(depth);

    if (depth === 0) {
      content += `/** \n`;
      content += ` * @deprecated ⚠️ This nested structure is for autocompletion only.\n`;
      content += ` * Use direct imports in production to preserve tree-shaking.\n`;
      content += ` */\n`;
      content += `declare const _autocompletion: {\n`;
    }

    // Process subfolders/files
    const sortedFolders = Array.from(structure.subfolders.keys()).sort();

    sortedFolders.forEach((name) => {
      const sub = structure.subfolders.get(name)!;

      // Skip empty nodes
      if (!this.hasContent(sub)) return;

      // If this node has exports, it represents a file
      if (sub.exports.length > 0) {
        // Convert filename with hyphens to snake_case for valid JS identifier
        const safeName = this.toSnakeCase(name);
        content += `${indent}  ${safeName}: {\n`;

        // Add all exports from this file (excluding types for runtime)
        const sortedExports = sub.exports
          .filter((exp) => !exp.isType)
          .sort((a, b) => a.name.localeCompare(b.name));

        sortedExports.forEach((exp) => {
          const importPath = exp.filePath;
          content += `${indent}    ${exp.name}: typeof import('./${importPath}')`;
          content += exp.isDefault ? `.default;\n` : `['${exp.name}'];\n`;
        });

        content += `${indent}  };\n`;
      }
      // If it has subfolders, it's a directory
      else if (sub.subfolders.size > 0) {
        content += `${indent}  ${name}: {\n`;

        // Recursively process subdirectories
        sub.subfolders.forEach((subSub, subName) => {
          if (this.hasContent(subSub)) {
            // For files with exports
            if (subSub.exports.length > 0) {
              // Convert filename with hyphens to snake_case
              const safeName = this.toSnakeCase(subName);
              content += `${indent}    ${safeName}: {\n`;

              const sortedExports = subSub.exports
                .filter((exp) => !exp.isType)
                .sort((a, b) => a.name.localeCompare(b.name));

              sortedExports.forEach((exp) => {
                const importPath = exp.filePath;
                content += `${indent}      ${exp.name}: typeof import('./${importPath}')`;
                content += exp.isDefault ? `.default;\n` : `['${exp.name}'];\n`;
              });

              content += `${indent}    };\n`;
            }
            // For nested directories
            else {
              const nestedContent = this.generateNestedStructure(
                subSub,
                depth + 2
              );
              const lines = nestedContent
                .split("\n")
                .filter((line) => line.trim());
              lines.forEach((line) => {
                content += `${indent}  ${line}\n`;
              });
            }
          }
        });

        content += `${indent}  };\n`;
      }
    });

    if (depth === 0) {
      content += `};\n\n`;
      content += `export default _autocompletion;\n`;
    }

    return content;
  }

  /**
   * Generates flat exports for backward compatibility
   */
  private generateFlatExports(
    structure: FileStructure,
    basePath: string
  ): string {
    let content = "";

    structure.subfolders.forEach((sub, name) => {
      const currentPath = basePath ? `${basePath}/${name}` : name;

      // If this node has exports, generate them
      if (sub.exports.length > 0) {
        sub.exports.forEach((exp) => {
          const typeKeyword = exp.isType ? "type " : "";

          content += `/** \n`;
          content += ` * @deprecated ⚠️ For autocompletion only.\n`;
          content += ` * Use direct import: \`import ${typeKeyword}{ ${exp.name} } from './${exp.filePath}'\`\n`;
          content += ` */\n`;

          if (exp.isDefault) {
            // Add path suffix to avoid naming conflicts
            const safeName = `${exp.name}_${currentPath.replace(
              /[\/\-\.]/g,
              "_"
            )}`;
            content += `export { default as ${safeName} } from './${exp.filePath}';\n`;
          } else {
            content += `export ${typeKeyword}{ ${exp.name} } from './${exp.filePath}';\n`;
          }
        });
      }

      // Recursively process subdirectories
      if (sub.subfolders.size > 0) {
        content += this.generateFlatExports(sub, currentPath);
      }
    });

    return content;
  }
}

// Execution script
if (require.main === module) {
  const generator = new AutocompletionGenerator();
  generator.generate().catch(console.error);
}

export { AutocompletionGenerator };
