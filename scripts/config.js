// Configuration for embedding and vector search indexing
// Using OpenAI text-embedding-3-small (1536 dimensions)
const config = [
  {
    collection: "interviews",
    textFields: ["text"],
    embeddingField: "embedding",
    indexName: "default",
    similarity: "cosine",
    numDimensions: 1536,
  },
  {
    collection: "manuals",
    textFields: ["section", "text"],
    embeddingField: "embedding",
    indexName: "default",
    similarity: "cosine",
    numDimensions: 1536,
  },
  {
    collection: "workorders",
    textFields: ["title", "instructions", "root_cause", "observations"],
    embeddingField: "embedding",
    indexName: "default",
    similarity: "cosine",
    numDimensions: 1536,
  },
];
export default config;
