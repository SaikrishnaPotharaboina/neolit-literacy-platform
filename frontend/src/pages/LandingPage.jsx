import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="neo-landing-page">
            <div className="neo-landing-container">
                <div className="neo-landing-content">
                    <div className="neo-landing-brand">NeoLit</div>

                    <h1>Learn English.<br />Open New Worlds.</h1>

                    <p>
                        Build your vocabulary, practice speaking,<br />
                        and master English with personalized lessons.
                    </p>

                    <div className="neo-landing-features">
                        <div className="neo-landing-feature">
                            <span>◎</span>
                            <div>
                                <strong>Personalized Learning</strong>
                                <small>Lessons tailored to your level and goals.</small>
                            </div>
                        </div>
                        <div className="neo-landing-feature">
                            <span>✦</span>
                            <div>
                                <strong>Daily Streaks</strong>
                                <small>Stay consistent and unlock rewards.</small>
                            </div>
                        </div>
                        <div className="neo-landing-feature">
                            <span>🏆</span>
                            <div>
                                <strong>Track Your Progress</strong>
                                <small>See how you're improving every day.</small>
                            </div>
                        </div>
                    </div>

                    <div className="neo-landing-owl">
                        <div className="neo-owl-body" />
                        <div className="neo-owl-eye left" />
                        <div className="neo-owl-eye right" />
                        <div className="neo-owl-beak" />
                    </div>

                    <div className="neo-landing-buttons">
                        <Link to="/register" className="neo-landing-btn primary">
                            Create Account
                        </Link>
                        <Link to="/login" className="neo-landing-btn secondary">
                            Log In
                        </Link>
                    </div>

                    <p className="neo-landing-tagline">Learn a little every day. Go anywhere.</p>
                </div>
            </div>
        </div>
    )
}
