const ResumeChunkModel =
  require("../Models/ResumeChunkModel");

async function searchLocalResumeChunks(
  queryEmbedding,
  studentId,
  resumeId,
  limit = 5
) {
  

  const storedChunks =
  await ResumeChunkModel.find({})
    .select(
      "studentId resumeId chunkIndex text"
    );



  const results =
    await ResumeChunkModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: limit,
          filter: {
            studentId: studentId,
            resumeId: resumeId
          }
        }
      },
      {
        $project: {
          _id: 1,
          text: 1,
          chunkIndex: 1,
          score: {
            $meta: "vectorSearchScore"
          }
        }
      }
    ]);

  

  return results;
}

module.exports = {
  searchLocalResumeChunks
};