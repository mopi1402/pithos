import * as fs from "fs";
import * as path from "path";

interface ExportConfig {
  [key: string]: string;
}

function generateExports(): ExportConfig {
  const srcDir = path.join(__dirname, "../src");
  const exports: ExportConfig = {};

  // Fonction récursive pour scanner les dossiers
  function scanDirectory(dirPath: string, exportPath: string): void {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Dossier : créer un pattern d'export
        const newExportPath = exportPath
          ? `${exportPath}/${item}/*`
          : `${item}/*`;

        // Vérifier s'il y a des fichiers .ts dans ce dossier
        const tsFiles = fs
          .readdirSync(fullPath)
          .filter((file) => file.endsWith(".ts"));

        if (tsFiles.length > 0) {
          exports[`./${newExportPath}`] = `./dist/${newExportPath.replace(
            "/*",
            "/*.js"
          )}`;
        }

        // Récursion pour les sous-dossiers
        scanDirectory(fullPath, newExportPath.replace("/*", ""));
      }
      // Supprimer la logique d'export direct des fichiers individuels
    });
  }

  scanDirectory(srcDir, "");
  return exports;
}

function updatePackageJson(): void {
  const packagePath = path.join(__dirname, "../package.json");
  const packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  // Générer les nouveaux exports
  const newExports = generateExports();

  // Mettre à jour package.json
  packageContent.exports = newExports;

  // Supprimer les anciens champs main/module/types
  delete packageContent.main;
  delete packageContent.module;
  delete packageContent.types;

  // Écrire le fichier mis à jour
  fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));

  console.log(
    "✅ Package.json mis à jour avec les exports générés automatiquement !"
  );
  console.log("📦 Exports générés:", Object.keys(newExports).length);
  console.log("🔍 Exports:", newExports);
}

// Exécuter le script
updatePackageJson();
