const { Ollama } = require("ollama");

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "http://localhost:11434",
});

async function generateLocalEmbedding(text) {
  const response = await ollama.embed({
    model: "nomic-embed-text",
    input: text,
  });

  return response.embeddings[0];
}

module.exports = {
  generateLocalEmbedding,
};