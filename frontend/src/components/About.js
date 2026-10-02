import "./About.css";

function About() {
    return (
        <div className="about-page">

            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>About Our Placement Management System</h1>

                    <p>
                        A centralized platform designed to simplify and organize
                        the college placement process for students and administrators.
                    </p>
                </div>
            </section>

            <section className="about-content">

                <div className="about-intro">
                    <h2>What is this system?</h2>

                    <p>
                        The Placement Management System provides a single platform
                        for managing placement activities. Students can maintain
                        their profiles, upload resumes, explore job opportunities,
                        apply for eligible positions, and track their applications.
                    </p>

                    <p>
                        Administrators can manage companies, job opportunities,
                        student applications, placement activities, events,
                        and reports from one centralized system.
                    </p>
                </div>

                <div className="about-cards">

                    <div className="about-card">
                        <div className="about-icon">🎓</div>
                        <h3>For Students</h3>
                        <p>
                            Create and manage profiles, upload resumes, discover
                            suitable jobs, apply for opportunities, and track
                            application status.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="about-icon">🏢</div>
                        <h3>For Administrators</h3>
                        <p>
                            Manage companies, job postings, applications, student
                            information, events, and placement activities.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="about-icon">📊</div>
                        <h3>Centralized Management</h3>
                        <p>
                            Keep important placement information organized in one
                            platform for easier access and management.
                        </p>
                    </div>

                </div>

                <div className="about-goal">
                    <h2>Our Goal</h2>

                    <p>
                        Our goal is to make the placement process more organized,
                        transparent, and convenient by bringing students,
                        administrators, companies, and placement activities
                        together on a single platform.
                    </p>
                </div>

            </section>

        </div>
    );
}

export default About;