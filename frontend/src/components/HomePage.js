import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import NavBar from "./NavBar";

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  return (
    <>
      <NavBar />

      <section className="hero">

        <div className="left">

          <h1>Placement Management System</h1>

          <p>
            A complete platform for students, recruiters and administrators to
            manage campus placements efficiently.
          </p>

          <div className="heroButtons">

            <button
              className="primary"
              onClick={handleGetStarted}
            >
              Get Started
            </button>

            <button
              className="secondary"
              onClick={handleLearnMore}
            >
              Learn More
            </button>

          </div>

        </div>

        <div className="right">

          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700"
            alt="Students"
          />

        </div>

      </section>

      <section className="features">

        <h2>Features</h2>

        <div className="cards">

          <div className="card">
            <h3>Students</h3>
            <p>Create profile, upload resume and apply for jobs.</p>
          </div>

          <div className="card">
            <h3>Companies</h3>
            <p>Post jobs and shortlist eligible students.</p>
          </div>

          <div className="card">
            <h3>Admin</h3>
            <p>Manage students, recruiters and placement activities.</p>
          </div>

        </div>

      </section>

      <footer>
        <p>© 2026 Placement Management System</p>
      </footer>
    </>
  );
}

export default HomePage;