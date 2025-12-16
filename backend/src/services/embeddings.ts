/**
 * MiniLM Embedding Service
 * Uses all-MiniLM-L6-v2 for generating 384-dimensional embeddings
 *
 * For production, this would call a local model or embedding API.
 * This implementation provides the interface and can be connected to:
 * - Hugging Face Inference API
 * - Local sentence-transformers server
 * - OpenAI embeddings (alternative)
 */

const EMBEDDING_DIMENSION = 384;
const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || 'http://localhost:8080/embed';

export interface EmbeddingResult {
  text: string;
  embedding: number[];
}

/**
 * Generate embeddings for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Truncate text if too long (MiniLM has 256 token limit)
  const truncatedText = text.slice(0, 1000);

  try {
    // Try external embedding service first
    const response = await fetch(EMBEDDING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: truncatedText }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.embedding;
    }
  } catch (error) {
    console.warn('External embedding service unavailable, using fallback');
  }

  // Fallback: Use OpenAI embeddings if available
  if (process.env.OPENAI_API_KEY) {
    return generateOpenAIEmbedding(truncatedText);
  }

  // Last resort: Generate deterministic pseudo-embedding for development
  return generateDevelopmentEmbedding(truncatedText);
}

/**
 * Generate embeddings for multiple texts (batched)
 */
export async function generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  const results: EmbeddingResult[] = [];

  // Process in batches of 32
  const batchSize = 32;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const embeddings = await Promise.all(batch.map(generateEmbedding));

    batch.forEach((text, idx) => {
      results.push({
        text,
        embedding: embeddings[idx],
      });
    });

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < texts.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * OpenAI embeddings fallback
 */
async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: EMBEDDING_DIMENSION, // Request 384 dimensions to match MiniLM
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI embedding failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Development fallback: deterministic pseudo-embedding
 * NOT for production use - only for testing without embedding service
 */
function generateDevelopmentEmbedding(text: string): number[] {
  const embedding: number[] = [];
  let hash = 0;

  // Simple hash function
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  // Generate deterministic values based on hash
  for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
    const seed = hash + i * 31;
    embedding.push(Math.sin(seed) * 0.5);
  }

  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map((val) => val / magnitude);
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have same dimension');
  }

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

export { EMBEDDING_DIMENSION };
