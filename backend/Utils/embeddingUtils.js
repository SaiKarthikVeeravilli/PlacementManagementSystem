const openai = require("../config/openai");

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  return response.data[0].embedding;
}

module.exports = {
  generateEmbedding
};