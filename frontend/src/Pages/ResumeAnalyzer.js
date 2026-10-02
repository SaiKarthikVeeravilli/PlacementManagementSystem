import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axios";
import "./ResumeAnalyzer.css";

const ResumeAnalyzer = () => {
  const { jobId } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resumeProcessed, setResumeProcessed] =
    useState(false);

  // ==========================================
  // PROCESS RESUME
  // ==========================================

  const handleProcessResume = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/student/resume/local-analyze"
      );

      console.log(response.data);

      setResumeProcessed(true);

      alert("Resume processed successfully");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to process resume"
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // ANALYZE JOB
  // ==========================================

  const handleAnalyzeJob = async () => {
    if (!jobId) {
      setError("Job ID not found");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await api.post(
        "/student/resume/local-match-job",
        {
          jobId: jobId,
        }
      );

      console.log(response.data);

      setAnalysis(response.data.analysis);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to analyze job"
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="resume-analyzer">

      {/* HEADER */}

      <div className="resume-analyzer-header">

        <h2>
          Resume Analyzer
        </h2>

        <p>
          Analyze your resume against the
          selected job using AI.
        </p>

      </div>


      {/* STEP 1 */}

      <div className="resume-card">

        <span className="step-label">
          Step 1
        </span>

        <h3>
          Process Your Resume
        </h3>

        <p>
          Process your uploaded resume before
          matching it with the selected job.
        </p>

        <button
          className="resume-btn process-btn"
          onClick={handleProcessResume}
          disabled={
            loading || resumeProcessed
          }
        >
          {loading
            ? "Processing..."
            : resumeProcessed
            ? "Resume Processed ✓"
            : "Process My Resume"}
        </button>

      </div>


      {/* STEP 2 */}

      <div className="resume-card">

        <span className="step-label">
          Step 2
        </span>

        <h3>
          Analyze Selected Job
        </h3>

        <p>
          Your resume will be compared with
          the job description stored in the
          Placement Management System.
        </p>

        <button
          className="resume-btn analyze-btn"
          onClick={handleAnalyzeJob}
          disabled={
            loading || !resumeProcessed
          }
        >
          {loading
            ? "Analyzing..."
            : "Analyze My Resume"}
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="resume-error">
          {error}
        </div>
      )}


      {/* ANALYSIS */}

      {analysis && (
        <div className="analysis-card">

          <h3>
            Resume Analysis
          </h3>


          {/* MATCHING SKILLS */}

          <div className="analysis-section">

            <h4>
              1. Matching Skills
            </h4>

            {analysis.matchingSkills?.length > 0 ? (

              <ul>
                {analysis.matchingSkills.map(
                  (skill, index) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )}
              </ul>

            ) : (

              <p>
                No matching skills identified.
              </p>

            )}

          </div>


          {/* MISSING SKILLS */}

          <div className="analysis-section">

            <h4>
              2. Missing or Weak Skills
            </h4>

            {analysis.missingSkills?.length > 0 ? (

              <ul>
                {analysis.missingSkills.map(
                  (skill, index) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )}
              </ul>

            ) : (

              <p>
                No specific missing requirements
                identified.
              </p>

            )}

          </div>


          {/* PROJECTS */}

          <div className="analysis-section">

            <h4>
              3. Relevant Projects
            </h4>

            {analysis.projects?.length > 0 ? (

              <ul>
                {analysis.projects.map(
                  (project, index) => (
                    <li key={index}>
                      {project}
                    </li>
                  )
                )}
              </ul>

            ) : (

              <p>
                No relevant projects identified.
              </p>

            )}

          </div>


          {/* EXPERIENCE */}

          <div className="analysis-section">

            <h4>
              4. Relevant Experience
            </h4>

            {analysis.experience?.length > 0 ? (

              <ul>
                {analysis.experience.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>

            ) : (

              <p>
                No relevant experience identified.
              </p>

            )}

          </div>


          {/* SUGGESTIONS */}

          <div className="analysis-section">

            <h4>
              5. Suggestions for Improving the Resume
            </h4>

            {analysis.suggestions?.length > 0 ? (

              <ul>
                {analysis.suggestions.map(
                  (suggestion, index) => (
                    <li key={index}>
                      {suggestion}
                    </li>
                  )
                )}
              </ul>

            ) : (

              <p>
                No specific suggestions.
              </p>

            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default ResumeAnalyzer;