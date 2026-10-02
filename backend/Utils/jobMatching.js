const openai = require("../config/openai");

const {
  generateEmbedding
} = require("./embeddingUtils");

const {
  searchResumeChunks
} = require("./vectorSearch");


async function matchResumeWithJob(
  jobDescription,
  studentId,
  resumeId
) {

  // 1. Convert job description into embedding
  const queryEmbedding = await generateEmbedding(
    jobDescription
  );


  // 2. Search relevant resume chunks
  const relevantChunks = await searchResumeChunks(
    queryEmbedding,
    studentId,
    resumeId,
    5
  );


  // 3. If no relevant chunks found
  if (relevantChunks.length === 0) {
    return {
      relevantChunks: [],
      analysis: "No relevant resume information was found."
    };
  }


  // 4. Combine relevant chunks
  const resumeContext = relevantChunks
    .map((chunk) => chunk.text)
    .join("\n\n");


  // 5. Send relevant information to OpenAI
  const response = await openai.responses.create({

    model: "gpt-5-mini",

    input: `
You are a resume and job matching assistant.

Analyze the candidate's resume information against
the given job description.

JOB DESCRIPTION:
${jobDescription}

RELEVANT RESUME INFORMATION:
${resumeContext}

Provide the following:

1. Matching skills
2. Missing or weak skills
3. Relevant projects
4. Relevant experience
5. Suggestions for improving the resume for this job

Do not invent information.
Only use information present in the resume context.
`
  });


  // 6. Get OpenAI response
  const analysis = response.output_text;


  return {
    relevantChunks,
    analysis
  };
}


module.exports = {
  matchResumeWithJob
};