import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { languages } from '../data/languages'

const levels = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Elementary' },
    { id: 3, name: 'Intermediate' },
    { id: 4, name: 'Upper Intermediate' },
    { id: 5, name: 'Advanced' },
]

export default function RegisterPage() {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        age: '',
        native_language: '',
        learning_language: 'en',
        gender: '',
        current_level_id: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleChange = (event) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        const payload = {
            ...form,
            age: form.age === '' ? null : Number(form.age),
            current_level_id: form.current_level_id === '' ? null : Number(form.current_level_id),
        }

        try {
            await register(payload)
            navigate('/login')
        } catch (err) {
            const detail = err.response?.data?.detail
            const message = Array.isArray(detail)
                ? detail.map((item) => item.msg).join(', ')
                : detail ||
                (err.request
                    ? 'Cannot connect to the server. Start the backend on port 8000 and try again.'
                    : 'Registration failed')
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="neo-auth-page single-form-page">
            <div className="neo-auth-shell register-shell">
                <div className="neo-auth-card neo-register-card single-register-card">
                    <div className="neo-card-icon orange">📖</div>
                    <h2>Create your account</h2>
                    <p>Join NeoLit and start your English journey.</p>

                    <form onSubmit={handleSubmit} className="neo-auth-form">
                        <div className="neo-two-col">
                            <label>
                                <span>First name</span>
                                <input
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder="Alex"
                                    required
                                />
                            </label>
                            <label>
                                <span>Last name</span>
                                <input
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder="Johnson"
                                />
                            </label>
                        </div>

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
                                    placeholder="Create a strong password"
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

                        <div className="neo-strength">
                            <div className="neo-strength-bar"><span /></div>
                            <small>Password strength: Strong</small>
                        </div>

                        <div className="neo-two-col">
                            <label>
                                <span>Age</span>
                                <input
                                    name="age"
                                    type="number"
                                    min="5"
                                    max="120"
                                    value={form.age}
                                    onChange={handleChange}
                                    placeholder="25"
                                />
                            </label>
                            <label>
                                <span>Gender</span>
                                <select name="gender" value={form.gender} onChange={handleChange}>
                                    <option value="">Prefer not to say</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>
                        </div>

                        <div className="neo-two-col">
                            <label>
                                <span>Native language</span>
                                <input
                                    name="native_language"
                                    value={form.native_language}
                                    onChange={handleChange}
                                    placeholder="English"
                                />
                            </label>
                            <label>
                                <span>Choose language</span>
                                <select
                                    name="learning_language"
                                    value={form.learning_language}
                                    onChange={handleChange}
                                    required
                                >
                                    {languages.map((language) => (
                                        <option key={language.id} value={language.code}>
                                            {language.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <label>
                            <span>Current proficiency level</span>
                            <select
                                name="current_level_id"
                                value={form.current_level_id}
                                onChange={handleChange}
                                required
                            >
                                {levels.map((level) => (
                                    <option key={level.id} value={level.id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="neo-check-row">
                            <input type="checkbox" required />
                            <span>I agree to the Terms of Service and Privacy Policy</span>
                        </label>

                        {error && <p className="neo-error-msg">{error}</p>}

                        <button type="submit" className="neo-login-button" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="neo-switch-text">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
