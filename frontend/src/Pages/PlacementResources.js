
import React from "react";
import "./PlacementResources.css";

function PlacementResources() {
  return (
    <div className="resources-page">

      <div className="resources-header">
        <h1>Placement Resources</h1>
        <p>
          Useful resources to help you prepare for placements
        </p>
      </div>

      <div className="resources-container">

        <a
          href="https://www.indeed.com/career-advice/resumes-cover-letters"
          target="_blank"
          rel="noopener noreferrer"
          className="resource-card"
        >
          <h2>Resume Preparation</h2>
          <p>
            Learn how to create a professional resume highlighting your
            education, skills, projects, certifications, and experience.
          </p>
          <span>Learn More →</span>
        </a>

        <a
          href="https://leetcode.com/problemset/"
          target="_blank"
          rel="noopener noreferrer"
          className="resource-card"
        >
          <h2>DSA Preparation</h2>
          <p>
            Practice important data structures and algorithms through
            coding problems and regular problem solving.
          </p>
          <span>Practice DSA →</span>
        </a>

        <a
          href="https://www.geeksforgeeks.org/technical-interview-preparation/"
          target="_blank"
          rel="noopener noreferrer"
          className="resource-card"
        >
          <h2>Technical Interviews</h2>
          <p>
            Prepare for programming, databases, operating systems,
            computer networks, OOP, and other technical interview topics.
          </p>
          <span>Prepare Now →</span>
        </a>

        <a
          href="https://www.indiabix.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="resource-card"
        >
          <h2>Aptitude Preparation</h2>
          <p>
            Practice quantitative aptitude, logical reasoning, verbal
            ability, probability, percentages, and other placement topics.
          </p>
          <span>Practice Aptitude →</span>
        </a>

        <a
          href="https://www.geeksforgeeks.org/hr-interview-questions/"
          target="_blank"
          rel="noopener noreferrer"
          className="resource-card"
        >
          <h2>HR Interview</h2>
          <p>
            Prepare for common HR questions related to self introduction,
            strengths, weaknesses, teamwork, goals, and experiences.
          </p>
          <span>Prepare for HR →</span>
        </a>

        <a
          href="https://www.geeksforgeeks.org/complete-interview-preparation/"
          target="_blank"
          rel="noopener noreferrer"
          className="resource-card"
        >
          <h2>Placement Tips</h2>
          <p>
            Get guidance for placement preparation, coding practice,
            interviews, resumes, and overall career preparation.
          </p>
          <span>View Tips →</span>
        </a>

      </div>
    </div>
  );
}

export default PlacementResources;

