const { Ollama } = require("ollama");

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "http://localhost:11434",
});

const {
  generateLocalEmbedding,
} = require("./localEmbeddingUtils");

const {
  searchLocalResumeChunks,
} = require("./localVectorSearch");


async function matchResumeWithJobLocal(
  jobDescription,
  studentId,
  resumeId
) {

  // ==========================================
  // 1. CREATE JOB EMBEDDING
  // ==========================================

  const queryEmbedding =
    await generateLocalEmbedding(
      jobDescription
    );


  // ==========================================
  // 2. SEARCH RELEVANT RESUME CHUNKS
  // ==========================================

  const relevantChunks =
    await searchLocalResumeChunks(
      queryEmbedding,
      studentId,
      resumeId,
      5
    );


  // ==========================================
  // 3. CHECK SEARCH RESULTS
  // ==========================================

  if (relevantChunks.length === 0) {

    return {
      relevantChunks: [],

      analysis: {
        matchingSkills: [],
        missingSkills: [],
        projects: [],
        experience: [],
        suggestions: [],
      },
    };
  }


  // ==========================================
  // 4. CREATE RESUME CONTEXT
  // ==========================================

  const resumeContext =
    relevantChunks
      .map((chunk) => chunk.text)
      .join("\n\n");


  // ==========================================
  // 5. ASK LLAMA
  // ==========================================

  const response =
    await ollama.chat({

      model: "llama3.2:latest",

      format: "json",

      messages: [

        // ======================================
        // SYSTEM PROMPT
        // ======================================

        {
          role: "system",

          content: `
You are a strict resume and job matching system.

Compare ONLY the provided JOB DESCRIPTION with the
provided RESUME INFORMATION.

Do not use outside knowledge.

Do not guess.

Do not assume.

Do not invent.


==============================
MATCHING SKILLS
==============================

A skill can be included in matchingSkills ONLY when the
same skill, technology, tool, or requirement is explicitly
written in BOTH the job description and resume.

Do not infer related skills.

Examples:

Express.js does NOT automatically mean REST APIs.

Node.js does NOT automatically mean REST APIs.

JavaScript does NOT mean Java.

Git does NOT mean GitHub.

MongoDB does NOT automatically mean database design.


==============================
MISSING SKILLS
==============================

A skill can be included in missingSkills ONLY when:

1. It is explicitly mentioned or required in the
   job description.

AND

2. It is NOT explicitly mentioned in the resume.

If a skill is present in the resume, it MUST NOT appear
in missingSkills.


==============================
PROJECTS
==============================

Include ONLY projects explicitly mentioned in the resume
that are relevant to the job description.

Do not invent projects.


==============================
EXPERIENCE
==============================

Include ONLY professional experience explicitly stated
in the resume.

IMPORTANT:

A project is NOT professional experience.

If something appears only as a project, do NOT put it
inside experience.

Do not invent job roles.

Do not invent companies.

Do not invent responsibilities.


==============================
SUGGESTIONS
==============================

Every suggestion MUST correspond directly to a skill
inside missingSkills.

If missingSkills is empty:

suggestions MUST be an empty array.

Do not give generic resume advice.

Do not suggest technologies that are not mentioned in
the job description.

Do not invent achievements.

Do not invent percentages.

Do not invent numbers.

Do not invent experience.

Do not tell the candidate to falsely add a skill.


==============================
IMPORTANT
==============================

Use ONLY the supplied text.

If something is not explicitly present, do not assume it.

Return ONLY valid JSON.

The JSON must have exactly these five fields:

{
  "matchingSkills": [],
  "missingSkills": [],
  "projects": [],
  "experience": [],
  "suggestions": []
}

All five fields MUST be arrays of strings.

If there are no items, return an empty array.

Before returning the JSON, verify:

1. Every matching skill exists in BOTH texts.

2. Every missing skill exists in the job description.

3. Every missing skill is absent from the resume.

4. Every project is explicitly present in the resume.

5. Every experience item is explicitly professional
   experience.

6. Projects are NOT included as professional experience.

7. Every suggestion corresponds to a missing skill.

8. No information was invented.
`,
        },


        // ======================================
        // USER DATA
        // ======================================

        {
          role: "user",

          content: `
JOB DESCRIPTION:

${jobDescription}


RESUME INFORMATION:

${resumeContext}
`,
        },
      ],
    });


  // ==========================================
  // 6. PARSE JSON RESPONSE
  // ==========================================

  let analysis;

  try {

    analysis =
      JSON.parse(
        response.message.content
      );

  } catch (error) {

    console.error(
      "Invalid JSON from Ollama:",
      response.message.content
    );

    throw new Error(
      "AI returned an invalid analysis format"
    );
  }


  // ==========================================
  // 7. ENSURE ALL REQUIRED FIELDS EXIST
  // ==========================================

  analysis.matchingSkills =
    Array.isArray(
      analysis.matchingSkills
    )
      ? analysis.matchingSkills
      : [];


  analysis.missingSkills =
    Array.isArray(
      analysis.missingSkills
    )
      ? analysis.missingSkills
      : [];


  analysis.projects =
    Array.isArray(
      analysis.projects
    )
      ? analysis.projects
      : [];


  analysis.experience =
    Array.isArray(
      analysis.experience
    )
      ? analysis.experience
      : [];


  analysis.suggestions =
    Array.isArray(
      analysis.suggestions
    )
      ? analysis.suggestions
      : [];


  // ==========================================
  // 8. REMOVE PROJECTS FROM EXPERIENCE
  // ==========================================

  const projectNames =
    analysis.projects.map(
      (project) =>
        project.toLowerCase().trim()
    );


  analysis.experience =
    analysis.experience.filter(
      (experience) => {

        const experienceText =
          experience.toLowerCase().trim();

        return !projectNames.some(
          (project) =>
            experienceText.includes(project) ||
            project.includes(experienceText)
        );
      }
    );


  // ==========================================
  // 9. CREATE VALID SUGGESTIONS
  // ==========================================

  if (
    analysis.missingSkills.length === 0
  ) {

    analysis.suggestions = [];

  } else {

    analysis.suggestions =
      analysis.missingSkills.map(
        (skill) =>
          `Consider adding ${skill} to your resume if you have actual experience with it.`
      );
  }


  // ==========================================
  // 10. RETURN RESULT
  // ==========================================

  return {
    relevantChunks,

    analysis,
  };
}


module.exports = {
  matchResumeWithJobLocal,
};