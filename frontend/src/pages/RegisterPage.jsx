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
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', age: '', native_language: '', learning_language: 'en', gender: '', current_level_id: '' })
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
            current_level_id: form.current_level_id === '' ? null : Number(form.current_level_id)
        }

        try {
            await register(payload)
            navigate('/login')
        } catch (err) {
            const detail = err.response?.data?.detail
            const message = Array.isArray(detail)
                ? detail.map((item) => item.msg).join(', ')
                : detail || (err.request ? 'Cannot connect to the server. Start the backend on port 8000 and try again.' : 'Registration failed')
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="auth-card w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <div className="auth-icon" aria-hidden="true">↪</div>
                    <h1 className="text-3xl font-bold text-slate-900">Join NeoLit</h1>
                    <p className="mt-2 text-sm text-slate-600">Build your language streak one lesson at a time</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">First name</label>
                        <input
                            name="first_name"
                            type="text"
                            value={form.first_name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3"
                            placeholder="Alex"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Last name</label>
                        <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Johnson" />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange}
                                minLength={8}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12"
                                placeholder="Create a strong password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="password-toggle absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 hover:text-slate-700"
                            >
                                {showPassword ? (
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 6a12.3 12.3 0 0 1-3.1 3.7M6.2 6.2C3.9 7.7 2.5 9.5 2.5 10c1 2 4.5 6 9.5 6 1 0 2-.2 2.9-.5" />
                                    </svg>
                                ) : (
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                        <circle cx="12" cy="12" r="2.5" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">Age<input name="age" type="number" min="5" max="120" value={form.age} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="25" /></label>
                        <label className="text-sm font-medium text-slate-700">Gender<select name="gender" value={form.gender} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"><option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="non-binary">Non-binary</option><option value="other">Other</option></select></label>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">Native language<input name="native_language" value={form.native_language} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="English" /></label>
                        <label className="text-sm font-medium text-slate-700">Preferred language<select name="learning_language" value={form.learning_language} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" required>{languages.map((language) => <option key={language.id} value={language.code}>{language.name}</option>)}</select></label>
                    </div>

                    <label className="block text-sm font-medium text-slate-700">Current proficiency level<select name="current_level_id" value={form.current_level_id} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" required>{levels.map((level) => <option key={level.id} value={level.id}>{level.name}</option>)}</select></label>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-primary-600 px-4 py-3 font-medium text-white transition hover:bg-primary-700 disabled:opacity-60"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary-600">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
