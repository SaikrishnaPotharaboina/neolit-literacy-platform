import { Link } from 'react-router-dom'
import InstallApp from '../components/InstallApp'

const highlights = [
    { icon: '01', title: 'Learn by doing', text: 'Build useful words, listen, and practice with short lessons.' },
    { icon: '02', title: 'Play your way', text: 'Keep momentum with focused games, challenges, and rounds.' },
    { icon: '03', title: 'Make it yours', text: 'Choose your learning language and follow your own progress.' },
]

const productAreas = [
    { number: '01', label: 'Learning path', title: 'A clear route forward', text: 'Move through units and lessons with a path that keeps your next step obvious.', tone: 'mint' },
    { number: '02', label: 'Lessons', title: 'Practice that sticks', text: 'Read, listen, write, and speak through short activities built around useful words.', tone: 'blue' },
    { number: '03', label: 'Letters', title: 'Start with the script', text: 'Explore vowels, consonants, pronunciation, and example words in your chosen language.', tone: 'gold' },
    { number: '04', label: 'Games', title: 'Learn through play', text: 'Use Word Builder, Word Hunt, Flip Cards, Archer, and more to test your skills.', tone: 'rose' },
    { number: '05', label: 'Progress', title: 'See your momentum', text: 'Track XP, streaks, scores, completed lessons, and personal improvement.', tone: 'violet' },
    { number: '06', label: 'Your profile', title: 'Make it personal', text: 'Choose your native language, learning course, level, and practice rhythm.', tone: 'teal' },
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

            <section className="landing-product" aria-labelledby="landing-product-title">
                <div className="landing-section-heading">
                    <p className="landing-eyebrow">Everything in one place</p>
                    <h2 id="landing-product-title">Your complete language<br /><em>learning space.</em></h2>
                    <p>From your first letter to your next high score, NeoLit brings the whole journey together.</p>
                </div>
                <div className="landing-product-grid">
                    {productAreas.map((area) => (
                        <article key={area.number} className={`landing-product-card ${area.tone}`}>
                            <span className="landing-product-number">{area.number}</span>
                            <p>{area.label}</p>
                            <h3>{area.title}</h3>
                            <span>{area.text}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-stats" aria-label="NeoLit learning promise">
                <div><strong>5</strong><span>learning languages</span></div>
                <div><strong>6+</strong><span>ways to practice</span></div>
                <div><strong>1</strong><span>place for your journey</span></div>
            </section>

            <footer className="landing-footer">
                <span>NeoLit</span>
                <p>Your language journey starts with one word.</p>
                <Link to="/register">Start learning →</Link>
            </footer>
        </main>
    )
}
