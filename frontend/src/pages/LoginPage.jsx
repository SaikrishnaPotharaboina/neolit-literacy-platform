import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (event) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(form)
            navigate('/learning-path')
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="neo-auth-page login-page-only">
            <div className="neo-auth-shell login-shell">
                <aside className="neo-left-card">
                    <div className="neo-brand">NeoLit</div>

                    <h1>
                        Learn English.<br />
                        Open <span>New Worlds.</span>
                    </h1>

                    <p>
                        Interactive lessons, real conversations,<br />
                        and personalized practice to help you
                        speak with confidence.
                    </p>

                    <div className="neo-feature-list">
                        <div className="neo-feature-item">
                            <span className="neo-feature-icon orange">📘</span>
                            <div>
                                <strong>Expert Lessons</strong>
                                <small>Learn with structured and engaging content.</small>
                            </div>
                        </div>

                        <div className="neo-feature-item">
                            <span className="neo-feature-icon yellow">🗣️</span>
                            <div>
                                <strong>Practice Speaking</strong>
                                <small>Improve your speaking with real-life conversations.</small>
                            </div>
                        </div>

                        <div className="neo-feature-item">
                            <span className="neo-feature-icon green">📈</span>
                            <div>
                                <strong>Track Progress</strong>
                                <small>Monitor your progress and achieve your goals.</small>
                            </div>
                        </div>
                    </div>

                    <div className="neo-owl-wrap">
                        <div className="neo-owl">
                            <div className="neo-owl-body" />
                            <div className="neo-owl-eye left" />
                            <div className="neo-owl-eye right" />
                            <div className="neo-owl-beak" />
                        </div>
                    </div>

                    <div className="neo-quote-block">
                        <span className="neo-quote-mark">“</span>
                        <p>
                            The beautiful thing about learning
                            is that no one can take it away from you.
                        </p>
                        <span className="neo-quote-author">— B.B. King</span>
                    </div>
                </aside>

                <div className="neo-auth-card neo-login-card">
                    <div className="neo-card-icon orange">📖</div>
                    <h2>Welcome back!</h2>
                    <p className="neo-subtitle">Log in to continue your learning journey.</p>

                    <form onSubmit={handleSubmit} className="neo-auth-form">
                        <label>
                            <span>Email</span>
                            <div className="neo-input-wrap">
                                <span className="neo-input-icon">✉</span>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </label>

                        <label>
                            <span>Password</span>
                            <div className="neo-input-wrap">
                                <span className="neo-input-icon">🔒</span>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="neo-eye-btn"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    onClick={() => setShowPassword((visible) => !visible)}
                                >
                                    {showPassword ? '◉' : '◌'}
                                </button>
                            </div>
                        </label>

                        <div className="neo-row-between">
                            <label className="neo-remember">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>

                        {error && <p className="neo-error-msg">{error}</p>}

                        <button type="submit" className="neo-login-button-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'} <span className="neo-arrow">→</span>
                        </button>
                    </form>

                    <div className="neo-divider">or continue with</div>

                    <div className="neo-social-grid">
                        <button type="button" className="neo-social-btn">
                            <span className="neo-social-icon">G</span> Continue with Google
                        </button>
                        <button type="button" className="neo-social-btn">
                            <span className="neo-social-icon">🍎</span> Continue with Apple
                        </button>
                        <button type="button" className="neo-social-btn">
                            <span className="neo-social-icon">f</span> Continue with Facebook
                        </button>
                    </div>

                    <div className="neo-security-note">
                        <span className="neo-security-icon">🛡️</span>
                        <div>
                            <p>Your data is safe with us.</p>
                            <p>We never share your information.</p>
                        </div>
                    </div>

                    <p className="neo-switch-text">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
