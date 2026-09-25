import { Link } from 'react-router-dom'
import InstallApp from '../components/InstallApp'

const highlights = [
    { icon: '01', title: 'Learn by doing', text: 'Build useful words, listen, and practice with short lessons.' },
    { icon: '02', title: 'Play your way', text: 'Keep momentum with focused games, challenges, and rounds.' },
    { icon: '03', title: 'Make it yours', text: 'Choose your learning language and follow your own progress.' },
]

export default function LandingPage() {
    return (
        <main className="landing-page">
            <header className="landing-nav">
                <Link to="/" className="landing-brand">Neo<span>Lit</span></Link>
                <div className="landing-nav-actions">
                    <InstallApp compact />
                    <Link to="/login" className="landing-login-link">Log in</Link>
                    <Link to="/register" className="landing-nav-cta">Create account</Link>
                </div>
            </header>

            <section className="landing-hero">
                <div className="landing-hero-copy">
                    <p className="landing-eyebrow">A brighter way to learn languages</p>
                    <h1>Small lessons.<br /><em>Real progress.</em></h1>
                    <p className="landing-intro">NeoLit turns language practice into a daily rhythm you can actually keep: learn, play, and come back stronger.</p>
                    <div className="landing-actions">
                        <Link to="/register" className="landing-primary-action">Create your account <span>→</span></Link>
                        <Link to="/login" className="landing-secondary-action">Continue with NeoLit</Link>
                    </div>
                    <p className="landing-note">Free to start. Pick your language after you join.</p>
                </div>
                <div className="landing-visual" aria-label="NeoLit learning preview">
                    <div className="landing-orbit landing-orbit-one" />
                    <div className="landing-orbit landing-orbit-two" />
                    <div className="landing-mark"><img src="/pwa-icon.svg" alt="" /></div>
                    <span className="landing-float landing-float-one">अक्षर</span>
                    <span className="landing-float landing-float-two">Learn</span>
                    <span className="landing-float landing-float-three">வார்த்தை</span>
                </div>
            </section>

            <section className="landing-highlights" aria-label="NeoLit features">
                {highlights.map((highlight) => (
                    <article key={highlight.icon} className="landing-highlight">
                        <span>{highlight.icon}</span>
                        <div><h2>{highlight.title}</h2><p>{highlight.text}</p></div>
                    </article>
                ))}
            </section>

            <footer className="landing-footer">
                <span>NeoLit</span>
                <p>Your language journey starts with one word.</p>
                <Link to="/register">Start learning →</Link>
            </footer>
        </main>
    )
}
