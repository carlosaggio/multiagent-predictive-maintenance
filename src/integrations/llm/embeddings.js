import { OpenAIEmbeddings, AzureOpenAIEmbeddings } from "@langchain/openai";

// Environment variables
const LLM_PROVIDER = process.env.LLM_PROVIDER || "openai";

// OpenAI Embeddings configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

// Azure OpenAI Embeddings configuration
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_EMBEDDING_DEPLOYMENT = process.env.AZURE_EMBEDDING_DEPLOYMENT || "text-embedding-3-small";
const AZURE_API_VERSION = process.env.AZURE_API_VERSION || "2024-08-01-preview";

/**
 * Singleton embeddings client instance
 */
let embeddingsClient = null;

/**
 * Create an embeddings client based on the configured provider
 * Supports Azure OpenAI and OpenAI
 * @returns {OpenAIEmbeddings | AzureOpenAIEmbeddings} Initialized embeddings client
 */
function getEmbeddingsClient() {
  if (embeddingsClient) {
    return embeddingsClient;
  }

  const provider = LLM_PROVIDER.toLowerCase();

  if (provider === "azure") {
    if (!AZURE_OPENAI_API_KEY || !AZURE_OPENAI_ENDPOINT) {
      throw new Error(
        "Azure OpenAI Embeddings requires AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT environment variables"
      );
    }
    embeddingsClient = new AzureOpenAIEmbeddings({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT,
      azureOpenAIApiDeploymentName: AZURE_EMBEDDING_DEPLOYMENT,
      azureOpenAIApiVersion: AZURE_API_VERSION,
    });
    console.log(`[Embeddings] Initialized Azure OpenAI Embeddings with deployment: ${AZURE_EMBEDDING_DEPLOYMENT}`);
  } else {
    // Default to OpenAI (also used for Anthropic since Anthropic doesn't have embeddings)
    if (!OPENAI_API_KEY) {
      throw new Error(
        "OpenAI Embeddings requires OPENAI_API_KEY environment variable"
      );
    }
    embeddingsClient = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      model: OPENAI_EMBEDDING_MODEL,
    });
    console.log(`[Embeddings] Initialized OpenAI Embeddings with model: ${OPENAI_EMBEDDING_MODEL}`);
  }

  return embeddingsClient;
}

/**
 * Generate an embedding for a given text
 * @param {string} text - The text to embed
 * @returns {Promise<Array<number>>} The embedding vector
 */
export async function generateEmbedding(text) {
  try {
    const client = getEmbeddingsClient();
    const embedding = await client.embedQuery(text);
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
}

/**
 * Generate embeddings for multiple texts
 * @param {Array<string>} texts - Array of texts to embed
 * @returns {Promise<Array<Array<number>>>} Array of embedding vectors
 */
export async function generateEmbeddings(texts) {
  try {
    const client = getEmbeddingsClient();
    const embeddings = await client.embedDocuments(texts);
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error(`Embeddings generation failed: ${error.message}`);
  }
}

/**
 * Get the current embeddings provider name
 * @returns {string} Current provider name
 */
export function getEmbeddingsProvider() {
  return LLM_PROVIDER === "azure" ? "azure" : "openai";
}

/**
 * Get the embedding dimensions for the current model
 * text-embedding-3-small: 1536 dimensions
 * text-embedding-ada-002: 1536 dimensions
 * @returns {number} Number of dimensions
 */
export function getEmbeddingDimensions() {
  return 1536;
}

/**
 * Reset the embeddings client (useful for testing or reconfiguration)
 */
export function resetEmbeddingsClient() {
  embeddingsClient = null;
}


