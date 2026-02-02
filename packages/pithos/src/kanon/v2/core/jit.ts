/**
 * Classe pour générer du code JavaScript de manière programmatique
 * Inspirée de la classe Doc de Zod
 *
 * @since 2.0.0
 */
export class Doc {
  args: string[] = [];
  content: string[] = [];
  indent = 0;

  constructor(args: string[] = []) {
    this.args = args;
  }

  /**
   * Exécute une fonction avec un niveau d'indentation temporaire
   */
  indented(fn: (doc: Doc) => void): void {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }

  /**
   * Ajoute du contenu au document
   */
  write(fn: (doc: Doc) => void): void;
  write(line: string): void;
  write(arg: any): void {
    if (typeof arg === "function") {
      arg(this);
      return;
    }

    const content = arg as string;
    const lines = content.split("\n").filter((x) => x);
    const minIndent = Math.min(
      ...lines.map((x) => x.length - x.trimStart().length)
    );
    const dedented = lines
      .map((x) => x.slice(minIndent))
      .map((x) => " ".repeat(this.indent * 2) + x);

    for (const line of dedented) {
      this.content.push(line);
    }
  }

  /**
   * Compile le document en une fonction JavaScript
   */
  compile(): any {
    const args = this.args;
    const content = this.content;
    const lines = [...content.map((x) => `  ${x}`)];
    return new Function(...args, lines.join("\n")) as any;
  }
}

/**
 * Cache des fonctions compilées JIT
 */
const jitCache = new WeakMap<any, any>();

/**
 * Génère une fonction JIT pour un schéma d'objet
 * Inspiré de la fonction generateFastpass de Zod
 *
 * @since 2.0.0
 */
export function generateObjectJIT(schema: any, config: any): any {
  // Vérifier le cache
  const cacheKey = schema;
  if (jitCache.has(cacheKey)) {
    return jitCache.get(cacheKey);
  }

  const doc = new Doc(["schema", "dataset", "config"]);

  // Générer le code de validation pour chaque propriété
  const keys = Object.keys(schema);
  const ids: any = Object.create(null);
  let counter = 0;

  for (const key of keys) {
    ids[key] = `key_${counter++}`;
  }

  // Début de la fonction
  doc.write(`const input = dataset.value;`);
  doc.write(`const output = {};`);
  doc.write(`let hasErrors = false;`);
  doc.write(`const allIssues = [];`);

  // Validation de chaque propriété
  for (const key of keys) {
    const id = ids[key];
    const k = JSON.stringify(key);

    doc.write(
      `const ${id} = schema[${k}]["~run"]({ value: input[${k}], status: "unknown" }, config);`
    );

    doc.write(`if (${id}.status === "success") {`);
    doc.indented((doc) => {
      doc.write(`output[${k}] = ${id}.value;`);
    });
    doc.write(`} else {`);
    doc.indented((doc) => {
      doc.write(`hasErrors = true;`);
      doc.write(`if (${id}.issues) {`);
      doc.indented((doc) => {
        doc.write(`for (const issue of ${id}.issues) {`);
        doc.indented((doc) => {
          doc.write(`const newIssue = { ...issue };`);
          doc.write(`newIssue.path = [${k}, ...(issue.path || [])];`);
          doc.write(`allIssues.push(newIssue);`);
        });
        doc.write(`}`);
      });
      doc.write(`}`);
    });
    doc.write(`}`);
  }

  // Retourner le résultat
  doc.write(`if (hasErrors) {`);
  doc.indented((doc) => {
    doc.write(`dataset.issues = allIssues;`);
    doc.write(`dataset.status = "failure";`);
    doc.write(`return dataset;`);
  });
  doc.write(`} else {`);
  doc.indented((doc) => {
    doc.write(`dataset.value = output;`);
    doc.write(`dataset.status = "success";`);
    doc.write(`return dataset;`);
  });
  doc.write(`}`);

  // Compiler la fonction
  const fn = doc.compile();

  // Mettre en cache
  jitCache.set(cacheKey, fn);

  return fn;
}

/**
 * Vérifie si le JIT est disponible et activé
 *
 * @since 2.0.0
 */
export function isJITEnabled(): boolean {
  // Vérifier si eval est disponible
  try {
    return typeof eval !== "undefined" && typeof Function !== "undefined";
  } catch {
    return false;
  }
}
