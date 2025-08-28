import fs from "fs";
import path from "path";

interface ExportConfig {
  [key: string]: string;
}

function generateExports(): ExportConfig {
  const srcDir = path.join(__dirname, "../src");
  const exports: ExportConfig = {};

  function scanDirectory(dirPath: string, exportPath: string): void {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const newExportPath = exportPath
          ? `${exportPath}/${item}/*`
          : `${item}/*`;

        const tsFiles = fs
          .readdirSync(fullPath)
          .filter((file) => file.endsWith(".ts"));

        if (tsFiles.length > 0) {
          exports[`./${newExportPath}`] = `./dist/${newExportPath.replace(
            "/*",
            "/*.js"
          )}`;
        }

        scanDirectory(fullPath, newExportPath.replace("/*", ""));
      }
    });
  }

  scanDirectory(srcDir, "");
  return exports;
}

function updatePackageJson(): void {
  const packagePath = path.join(__dirname, "../package.json");
  const packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  const newExports = generateExports();

  packageContent.exports = newExports;

  delete packageContent.main;
  delete packageContent.module;
  delete packageContent.types;

  fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));

  console.log(
    "✅ Package.json mis à jour avec les exports générés automatiquement !"
  );
  console.log("📦 Exports générés:", Object.keys(newExports).length);
  console.log("🔍 Exports:", newExports);
}

updatePackageJson();
