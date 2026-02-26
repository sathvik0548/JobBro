import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Header / Navbar */}
            <header className="landing-header">
                <div className="landing-container">
                    <nav className="landing-nav">
                        <div className="landing-logo">
                            <span className="logo-icon">🎓</span>
                            <span className="logo-text">JobBro Portal</span>
                        </div>
                        <ul className="nav-links">
                            <li><a href="#students">Students</a></li>
                            <li><a href="#recruiters">Recruiters</a></li>
                            <li><a href="#resources">Resources</a></li>
                            <li><a href="#stories">Success Stories</a></li>
                        </ul>
                        <div className="nav-actions">
                            <button className="btn btn-ghost" onClick={() => navigate('/login')}>Admin Login</button>
                            <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="landing-container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="hero-badge">
                                📈 Over 500+ Companies Hiring Now
                            </div>
                            <h1 className="hero-title">
                                Your Gateway to <br />
                                <span className="text-highlight">Career Success</span>
                            </h1>
                            <p className="hero-description">
                                Bridging the gap between talented students and top-tier companies.
                                Empowering your professional journey through seamless placements,
                                real-world internships, and elite recruitment tools.
                            </p>
                            <div className="hero-actions">
                                <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Get Started →</button>
                                <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>View Job Board</button>
                            </div>
                            <div className="hero-social-proof">
                                <div className="avatar-group">
                                    <div className="avatar-sm" style={{ background: '#4a5568' }}></div>
                                    <div className="avatar-sm" style={{ background: '#ed8936' }}></div>
                                    <div className="avatar-sm" style={{ background: '#4299e1' }}></div>
                                    <div className="avatar-sm" style={{ background: '#2563eb' }}>+2k</div>
                                </div>
                                <span>Joined by 2,000+ ambitious graduates this month</span>
                            </div>
                        </div>
                        <div className="hero-image-container">
                            <div className="hero-image-wrapper">
                                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" alt="Modern Office" className="hero-main-image" />
                                <div className="hero-stat-card">
                                    <div className="stat-icon">📈</div>
                                    <div>
                                        <div className="stat-label">PLACEMENT RATE</div>
                                        <div className="stat-value">94% Average</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Info Bar */}
            <section className="features-section" id="resources">
                <div className="landing-container">
                    <div className="section-header">
                        <span className="section-badge">FEATURES & BENEFITS</span>
                        <h2 className="section-title">Everything you need to land your dream job</h2>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">👤</div>
                            <h3>Student Profiles</h3>
                            <p>All-powered resume building and detailed skill portfolios that catch the eye of top tech recruiters.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💼</div>
                            <h3>Job Listings</h3>
                            <p>Daily updates with exclusive listings for internships, fellowships, and permanent career roles across all sectors.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>HR Dashboard</h3>
                            <p>Streamlined tools for recruiters to filter talent, manage applicant pools, and post bulk openings in seconds.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📅</div>
                            <h3>Auto-Scheduling</h3>
                            <p>Automatic interview coordination that syncs with your calendar, ensuring you never miss a career opportunity.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dual Sections */}
            <section className="dual-section">
                <div className="landing-container">
                    <div className="dual-grid">
                        <div className="path-card path-dark" id="students">
                            <div className="path-icon">🎓</div>
                            <h2>For Students</h2>
                            <p>Take the next step in your professional journey. Access mock interviews, career roadmap tools, and direct connections to hiring managers.</p>
                            <ul className="path-list">
                                <li><span>✓</span> Personalized Job Matches</li>
                                <li><span>✓</span> Skill Assessment Badges</li>
                                <li><span>✓</span> One-Click Applications</li>
                            </ul>
                            <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Placed Now</button>
                        </div>
                        <div className="path-card path-light" id="recruiters">
                            <div className="path-icon">💼</div>
                            <h2>For Recruiters</h2>
                            <p>Discover the next generation of industry leaders. Our platform provides high-quality candidates vetted by academic excellence.</p>
                            <ul className="path-list">
                                <li><span>✓</span> Vetted Student Records</li>
                                <li><span>✓</span> Bulk Hiring Tools</li>
                                <li><span>✓</span> Direct Campus Engagement</li>
                            </ul>
                            <button className="btn btn-outline" onClick={() => navigate('/login')}>Hire Best Talent</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="landing-container">
                    <div className="cta-card">
                        <h2>Ready to kickstart your career?</h2>
                        <p>Join thousands of students and hundreds of companies already using our platform. Your dream role is just one click away.</p>
                        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your college email" className="cta-input" />
                            <button className="btn-dark" onClick={() => navigate('/register')}>Get Started Free</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="landing-logo">
                                <span className="logo-icon">🎓</span>
                                <span className="logo-text">JobBro Portal</span>
                            </div>
                            <p>Connecting education with industry to build a better future for the next generation of professionals.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Platform</h4>
                            <ul>
                                <li><a href="#">Jobs</a></li>
                                <li><a href="#">Internships</a></li>
                                <li><a href="#">Recruiters</a></li>
                                <li><a href="#">Dashboard</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Privacy</a></li>
                                <li><a href="#">Terms</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Social</h4>
                            <ul>
                                <li><a href="#">LinkedIn</a></li>
                                <li><a href="#">Twitter</a></li>
                                <li><a href="#">Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 JobBro Placement Portal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
