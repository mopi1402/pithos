/**
 * Web Worker for embedding inference
 *
 * This worker loads the transformers.js model and computes embeddings
 * without blocking the main thread.
 *
 * Communication:
 * - Main → Worker: { type: "init" } to load model
 * - Main → Worker: { type: "embed", text: string, id: string } to compute embedding
 * - Main → Worker: { type: "search", query: string, topK: number } to search
 * - Worker → Main: { type: "ready" } when model is loaded
 * - Worker → Main: { type: "result", id: string, embedding: number[] }
 * - Worker → Main: { type: "searchResult", results: SearchResult[] }
 * - Worker → Main: { type: "error", message: string }
 * - Worker → Main: { type: "progress", progress: number, status: string }
 */

import { pipeline, env } from "@xenova/transformers";

// Configure transformers.js for browser
env.allowLocalModels = false;
env.useBrowserCache = true;

// Model to use - all-MiniLM-L6-v2 is small (~23MB) and good for semantic search
const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";

interface EmbeddingEntry {
  id: string;
  text: string;
  utilId: string;
  useCaseIndex: number;
  embedding?: number[];
}

interface SearchResult {
  id: string;
  utilId: string;
  useCaseIndex: number;
  score: number;
}

interface PrecomputedEmbeddings {
  metadata: {
    generatedAt: string;
    modelName: string;
    modelVersion: string;
    entryCount: number;
    embeddingDimension: number;
    checksum: string;
  };
  embeddings: {
    [entryId: string]: number[];
  };
}

let extractor: Awaited<ReturnType<typeof pipeline>> | null = null;
let entries: EmbeddingEntry[] = [];
let isReady = false;
let precomputedEmbeddings: PrecomputedEmbeddings | null = null;
let workerBaseUrl = "/";

// Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Charge les embeddings pré-calculés depuis le fichier JSON
 * @returns Les embeddings ou null si échec
 */
async function loadPrecomputedEmbeddings(): Promise<PrecomputedEmbeddings | null> {
  try {
    const response = await fetch(`${workerBaseUrl}use_cases/precomputed-embeddings.json`);
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Validation basique
    if (!data.metadata || !data.embeddings) {
      console.warn("[Embedding Worker] Invalid precomputed embeddings format");
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn("[Embedding Worker] Failed to load precomputed embeddings:", error);
    return null;
  }
}

/**
 * Valide l'intégrité des embeddings pré-calculés
 * @param precomputed Les embeddings à valider
 * @returns true si valide, false sinon
 */
function validatePrecomputedEmbeddings(
  precomputed: PrecomputedEmbeddings
): boolean {
  const { metadata, embeddings } = precomputed;
  
  // Vérifier le modèle
  if (metadata.modelName !== MODEL_NAME) {
    console.warn(
      `[Embedding Worker] Model mismatch: expected ${MODEL_NAME}, got ${metadata.modelName}`
    );
    return false;
  }
  
  // Vérifier la dimension
  const firstEmbedding = Object.values(embeddings)[0];
  if (!firstEmbedding || firstEmbedding.length !== metadata.embeddingDimension) {
    console.warn("[Embedding Worker] Embedding dimension mismatch");
    return false;
  }
  
  // Vérifier que tous les embeddings ont la même dimension
  for (const embedding of Object.values(embeddings)) {
    if (!Array.isArray(embedding) || embedding.length !== metadata.embeddingDimension) {
      console.warn("[Embedding Worker] Invalid embedding found");
      return false;
    }
  }
  
  return true;
}

/**
 * Applique les embeddings pré-calculés aux entrées
 * @param entries Les entrées à enrichir
 * @param precomputed Les embeddings pré-calculés
 * @returns Nombre d'embeddings appliqués
 */
function applyPrecomputedEmbeddings(
  entries: EmbeddingEntry[],
  precomputed: PrecomputedEmbeddings
): number {
  let appliedCount = 0;
  
  for (const entry of entries) {
    const embedding = precomputed.embeddings[entry.id];
    if (embedding) {
      entry.embedding = embedding;
      appliedCount++;
    }
  }
  
  return appliedCount;
}

async function initModel(): Promise<void> {
  try {
    console.log(`[Embedding Worker] 🚀 Starting initialization...`);
    const initStartTime = performance.now();
    
    // Étape 1: Charger les embeddings pré-calculés
    self.postMessage({ type: "progress", progress: 0, status: "Loading precomputed embeddings..." });
    const precomputed = await loadPrecomputedEmbeddings();
    
    if (precomputed && validatePrecomputedEmbeddings(precomputed)) {
      console.log(`[Embedding Worker] ✅ Loaded ${precomputed.metadata.entryCount} precomputed embeddings`);
      // Stocker pour utilisation ultérieure
      precomputedEmbeddings = precomputed;
    } else {
      console.warn(`[Embedding Worker] ⚠️ Precomputed embeddings unavailable, will compute at runtime`);
    }
    
    // Étape 2: Charger le modèle (toujours nécessaire pour les queries)
    self.postMessage({ type: "progress", progress: 10, status: "Loading model..." });
    console.log(`[Embedding Worker] 🔄 Loading model ${MODEL_NAME}...`);

    extractor = await pipeline("feature-extraction", MODEL_NAME, {
      progress_callback: (progress: { progress: number; status: string }) => {
        // Mapper 0-100 vers 10-95 (on garde 95-100 pour la finalisation)
        const adjustedProgress = 10 + (progress.progress || 0) * 0.85;
        self.postMessage({
          type: "progress",
          progress: adjustedProgress,
          status: progress.status || "Loading model...",
        });
      },
    });

    const initDuration = performance.now() - initStartTime;
    console.log(`[Embedding Worker] ✅ Initialization complete in ${initDuration.toFixed(0)}ms (${(initDuration / 1000).toFixed(1)}s)`);

    // Force progression à 100% avant de signaler ready
    self.postMessage({ type: "progress", progress: 100, status: "Ready" });
    
    // Petit délai pour que l'UI voie bien le 100%
    await new Promise(resolve => setTimeout(resolve, 100));
    
    isReady = true;
    self.postMessage({ type: "ready" });
  } catch (error) {
    console.error(`[Embedding Worker] ❌ Initialization failed:`, error);
    self.postMessage({
      type: "error",
      message: `Failed to initialize: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

async function computeEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    throw new Error("Model not loaded");
  }

  const output = await extractor(text, { pooling: "mean", normalize: true } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Array.from((output as any).data as Float32Array);
}

async function setEntries(newEntries: EmbeddingEntry[]): Promise<void> {
  console.log(`[Embedding Worker] 📊 Received ${newEntries.length} entries to index`);
  entries = newEntries;

  // Appliquer les embeddings pré-calculés si disponibles
  if (precomputedEmbeddings) {
    const appliedCount = applyPrecomputedEmbeddings(entries, precomputedEmbeddings);
    console.log(`[Embedding Worker] ✅ Applied ${appliedCount}/${entries.length} precomputed embeddings`);
    
    // Calculer les embeddings manquants
    const missingCount = entries.length - appliedCount;
    if (missingCount > 0) {
      console.warn(`[Embedding Worker] ⚠️ ${missingCount} entries missing precomputed embeddings, will compute`);
    }
  }

  // Calculer les embeddings manquants (fallback)
  if (isReady && extractor) {
    const missingEntries = entries.filter(e => !e.embedding);
    
    if (missingEntries.length > 0) {
      const indexStartTime = performance.now();
      console.log(`[Embedding Worker] 🔄 Computing ${missingEntries.length} missing embeddings...`);
      
      // Only show progress bar if computing many embeddings (fallback mode)
      const showProgress = missingEntries.length > 10;
      
      if (showProgress) {
        self.postMessage({ type: "progress", progress: 0, status: "Computing embeddings..." });
      }

      for (let i = 0; i < missingEntries.length; i++) {
        const entryStartTime = performance.now();
        missingEntries[i].embedding = await computeEmbedding(missingEntries[i].text);
        const entryDuration = performance.now() - entryStartTime;
        
        // Log every 10th entry to avoid spam
        if (i % 10 === 0 || i === missingEntries.length - 1) {
          console.log(`[Embedding Worker]   Entry ${i + 1}/${missingEntries.length} computed in ${entryDuration.toFixed(0)}ms`);
        }
        
        if (showProgress) {
          self.postMessage({
            type: "progress",
            progress: Math.round((i + 1) / missingEntries.length * 100),
            status: `Computing ${i + 1}/${missingEntries.length}`,
          });
        }
      }
      
      const indexDuration = performance.now() - indexStartTime;
      const avgTimePerEntry = indexDuration / missingEntries.length;
      console.log(`[Embedding Worker] ✅ Missing embeddings computed in ${indexDuration.toFixed(0)}ms (${(indexDuration / 1000).toFixed(1)}s)`);
      console.log(`[Embedding Worker]    Average: ${avgTimePerEntry.toFixed(0)}ms per entry`);
    }

    self.postMessage({ type: "indexed", count: entries.length });
  }
}

async function search(query: string, topK: number = 10, searchId?: number): Promise<SearchResult[]> {
  if (!isReady || !extractor) {
    throw new Error("Model not ready");
  }

  console.log(`[Embedding Worker] Search #${searchId} started for "${query}"`);
  const startTime = performance.now();
  const queryEmbedding = await computeEmbedding(query);
  const embedTime = performance.now() - startTime;

  // Compute similarities
  const allScored = entries
    .filter((e) => e.embedding)
    .map((entry) => ({
      id: entry.id,
      utilId: entry.utilId,
      useCaseIndex: entry.useCaseIndex,
      score: cosineSimilarity(queryEmbedding, entry.embedding!),
      text: entry.text, // Keep for debugging
    }))
    .sort((a, b) => b.score - a.score);

  const totalTime = performance.now() - startTime;

  console.log(`[Embedding Worker] Search #${searchId} completed: "${query}" (embed: ${embedTime.toFixed(0)}ms, total: ${totalTime.toFixed(0)}ms)`);
  console.log(`[Embedding Worker] Top 5 results:`);
  allScored.slice(0, 5).forEach((r, i) => {
    console.log(`  ${i + 1}. score=${r.score.toFixed(4)} | ${r.utilId} | "${r.text.substring(0, 50)}..."`);
  });

  const scored = allScored.slice(0, topK).map(({ text, ...rest }) => rest);

  return scored;
}

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { type, ...data } = event.data;

  try {
    switch (type) {
      case "init":
        console.log(`[Embedding Worker] 🎬 Initialization requested`);
        if (data.baseUrl) workerBaseUrl = data.baseUrl;
        await initModel();
        break;

      case "setEntries":
        await setEntries(data.entries);
        break;

      case "embed":
        if (!isReady) {
          self.postMessage({ type: "error", message: "Model not ready" });
          return;
        }
        const embedding = await computeEmbedding(data.text);
        self.postMessage({ type: "result", id: data.id, embedding });
        break;

      case "search":
        if (!isReady) {
          self.postMessage({ type: "error", message: "Model not ready" });
          return;
        }
        const results = await search(data.query, data.topK || 10, data.searchId);
        self.postMessage({ type: "searchResult", results, searchId: data.searchId });
        break;

      default:
        self.postMessage({ type: "error", message: `Unknown message type: ${type}` });
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

console.log(`[Embedding Worker] 🏁 Worker initialized and ready to receive messages`);

export {};
