import "./Contact.css";

function Contact() {
    return (
        <div className="contact-page">

            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>Contact Us</h1>
                    <p>
                        Have a question or need assistance with the
                        Placement Management System? Get in touch with us.
                    </p>
                </div>
            </section>

            <section className="contact-content">

                <div className="contact-info">

                    <div className="contact-card">
                        <div className="contact-icon">📧</div>
                        <h3>Email Support</h3>
                        <p>
                            For placement-related queries and technical support,
                            contact the placement administration team.
                        </p>
                      <a href="mailto:placementmanagementsystem@gmail.com">
    placementmanagementsystem@gmail.com
</a>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon">📍</div>
                        <h3>Placement Office</h3>
                        <p>
                            Visit the placement office during working hours
                            for assistance with placement activities.
                        </p>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon">💬</div>
                        <h3>Student Support</h3>
                        <p>
                            Students can contact the placement administration
                            team for assistance with applications and profiles.
                        </p>
                    </div>

                </div>

                <div className="contact-note">
                    <h2>We're Here to Help</h2>
                    <p>
                        Whether you need help with your student profile,
                        applications, job opportunities, or placement activities,
                        our team is available to assist you.
                    </p>
                </div>

            </section>

        </div>
    );
}

export default Contact;