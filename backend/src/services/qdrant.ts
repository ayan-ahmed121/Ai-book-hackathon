import { QdrantClient } from '@qdrant/js-client-rest';

const COLLECTION_NAME = 'textbook_chunks';
const VECTOR_SIZE = 384; // MiniLM-L6-v2 dimension

let client: QdrantClient | null = null;

export function getQdrantClient(): QdrantClient {
  if (!client) {
    const url = process.env.QDRANT_URL;
    const apiKey = process.env.QDRANT_API_KEY;

    if (!url) {
      throw new Error('QDRANT_URL environment variable is not set');
    }

    client = new QdrantClient({
      url,
      apiKey,
    });
  }
  return client;
}

// Initialize collection if it doesn't exist
export async function initializeCollection(): Promise<void> {
  const qdrant = getQdrantClient();

  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

    if (!exists) {
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      });
      console.log(`Created collection: ${COLLECTION_NAME}`);
    }
  } catch (error) {
    console.error('Failed to initialize Qdrant collection:', error);
    throw error;
  }
}

// Search for similar chunks
export async function searchChunks(
  vector: number[],
  limit: number = 5,
  chapterId?: string
): Promise<SearchResult[]> {
  const qdrant = getQdrantClient();

  const filter = chapterId
    ? {
        must: [{ key: 'chapterId', match: { value: chapterId } }],
      }
    : undefined;

  const results = await qdrant.search(COLLECTION_NAME, {
    vector,
    limit,
    filter,
    with_payload: true,
  });

  return results.map((result) => ({
    id: result.id as string,
    score: result.score,
    text: (result.payload?.text as string) || '',
    chapterId: (result.payload?.chapterId as string) || '',
    sectionTitle: (result.payload?.sectionTitle as string) || '',
    chunkIndex: (result.payload?.chunkIndex as number) || 0,
  }));
}

// Upsert chunks with embeddings
export async function upsertChunks(chunks: ChunkWithEmbedding[]): Promise<void> {
  const qdrant = getQdrantClient();

  const points = chunks.map((chunk) => ({
    id: chunk.id,
    vector: chunk.embedding,
    payload: {
      text: chunk.text,
      chapterId: chunk.chapterId,
      sectionTitle: chunk.sectionTitle,
      chunkIndex: chunk.chunkIndex,
    },
  }));

  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points,
  });
}

// Health check
export async function checkQdrantConnection(): Promise<boolean> {
  try {
    const qdrant = getQdrantClient();
    await qdrant.getCollections();
    return true;
  } catch (error) {
    console.error('Qdrant connection failed:', error);
    return false;
  }
}

// Types
export interface SearchResult {
  id: string;
  score: number;
  text: string;
  chapterId: string;
  sectionTitle: string;
  chunkIndex: number;
}

export interface ChunkWithEmbedding {
  id: string;
  text: string;
  embedding: number[];
  chapterId: string;
  sectionTitle: string;
  chunkIndex: number;
}
