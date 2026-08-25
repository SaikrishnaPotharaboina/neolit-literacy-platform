import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { learningApi } from '../services/learningApi'

export default function RegisterPage() {
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', age: '', native_language: '', learning_language: 'en', education_level: '', current_level_id: '' })
    const [languages, setLanguages] = useState([])
    const [levels, setLevels] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        Promise.all([learningApi.getLanguages(), learningApi.getLevels()])
            .then(([languageData, levelData]) => {
                const availableLanguages = Array.isArray(languageData) ? languageData : languageData.data || []
                const availableLevels = Array.isArray(levelData) ? levelData : levelData.data || []
                setLanguages(availableLanguages)
                setLevels(availableLevels)
                setForm((current) => ({ ...current, learning_language: current.learning_language || availableLanguages[0]?.code || '', current_level_id: current.current_level_id || availableLevels[0]?.id || '' }))
            })
            .catch(() => setError('Unable to load learner options'))
    }, [])

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
                : detail || 'Registration failed'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
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
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            minLength={8}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3"
                            placeholder="Create a strong password"
                            required
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">Age<input name="age" type="number" min="5" max="120" value={form.age} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="25" /></label>
                        <label className="text-sm font-medium text-slate-700">Education level<input name="education_level" value={form.education_level} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="College" /></label>
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
