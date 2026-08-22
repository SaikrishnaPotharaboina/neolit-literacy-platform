import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { learningApi } from '../services/learningApi'

export default function DashboardPage() {
    const { user, logout, setUser } = useAuth()
    const [language, setLanguage] = useState('en')
    const [curricula, setCurricula] = useState([])
    const [assessments, setAssessments] = useState([])
    const [profile, setProfile] = useState({ preferred_language: 'en', proficiency_level: 'beginner', goals: '' })
    const [selectedAssessment, setSelectedAssessment] = useState(null)
    const [answers, setAnswers] = useState({})
    const [result, setResult] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const loadLearning = async () => {
            try {
                const [curriculumData, assessmentData, dashboardData] = await Promise.all([
                    learningApi.getCurricula(language),
                    learningApi.getAssessments(language),
                    learningApi.getDashboard()
                ])
                setCurricula(curriculumData)
                setAssessments(assessmentData)
                setProfile(dashboardData.profile)
            } catch (error) {
                setMessage(error.response?.data?.detail || 'Unable to load learning content')
            }
        }
        loadLearning()
    }, [language])

    const saveProfile = async (event) => {
        event.preventDefault()
        try {
            const updated = await learningApi.updateProfile(profile)
            setProfile(updated)
            setLanguage(updated.preferred_language)
            setMessage('Profile saved')
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Unable to save profile')
        }
    }

    const submitAssessment = async (event) => {
        event.preventDefault()
        try {
            const assessmentResult = await learningApi.submitAssessment(selectedAssessment.id, answers)
            setResult(assessmentResult)
            setUser((currentUser) => ({
                ...currentUser,
                xp: currentUser.xp + assessmentResult.xp_awarded,
                level: Math.max(currentUser.level, 1 + Math.floor((currentUser.xp + assessmentResult.xp_awarded) / 100))
            }))
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Unable to submit assessment')
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
            <div className="mx-auto max-w-6xl">
                <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-primary-600">NeoLit literacy lab</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {user?.name || 'Learner'}!</h1>
                    </div>
                    <button onClick={logout} className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">Log out</button>
                </header>
                {message && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</p>}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    {[['Current level', user?.level || 1], ['XP', user?.xp || 0], ['Streak', `${user?.streak || 0} days`]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>)}
                </div>
                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    <main className="space-y-6">
                        <section className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">Your curriculum</h2><p className="text-sm text-slate-500">Reading, writing, and comprehension practice</p></div><select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="en">English</option><option value="es">Spanish</option></select></div>
                            <div className="space-y-3">{curricula.map((curriculum) => <article key={curriculum.id} className="border-l-4 border-primary-500 bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">{curriculum.title}</h3><p className="mt-1 text-sm text-slate-600">{curriculum.description}</p><div className="mt-3 flex flex-wrap gap-2">{curriculum.content_items.map((item) => <span key={item.id} className="rounded-full bg-white px-3 py-1 text-xs text-slate-600">{item.skill}: {item.title}</span>)}</div></article>)}</div>
                        </section>
                        <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-900">Assessment studio</h2><div className="mt-4 flex flex-wrap gap-2">{assessments.map((assessment) => <button key={assessment.id} onClick={() => { setSelectedAssessment(assessment); setAnswers({}); setResult(null) }} className={`rounded-lg px-3 py-2 text-sm font-medium ${selectedAssessment?.id === assessment.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{assessment.title}</button>)}</div>{selectedAssessment && <form onSubmit={submitAssessment} className="mt-5 space-y-4">{selectedAssessment.questions.map((question, index) => <label key={question.id} className="block text-sm font-medium text-slate-700">{index + 1}. {question.prompt}<input required value={answers[question.id] || ''} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder={question.options?.length ? question.options.join(' / ') : 'Type your answer'} /></label>)}<button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700">Submit assessment</button></form>}{result && <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-900"><strong>{result.percentage}%</strong> • {result.benchmark_level} benchmark • +{result.xp_awarded} XP</div>}</section>
                    </main>
                    <aside className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-900">Learner profile</h2><form onSubmit={saveProfile} className="mt-5 space-y-4"><label className="block text-sm font-medium text-slate-700">Preferred language<select value={profile.preferred_language} onChange={(event) => setProfile({ ...profile, preferred_language: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"><option value="en">English</option><option value="es">Spanish</option></select></label><label className="block text-sm font-medium text-slate-700">Proficiency<select value={profile.proficiency_level} onChange={(event) => setProfile({ ...profile, proficiency_level: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"><option value="beginner">Beginner</option><option value="developing">Developing</option><option value="proficient">Proficient</option></select></label><label className="block text-sm font-medium text-slate-700">Learning goals<textarea value={profile.goals} onChange={(event) => setProfile({ ...profile, goals: event.target.value })} className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="What would you like to read or write?" /></label><button type="submit" className="w-full rounded-lg border border-primary-600 px-4 py-2 font-medium text-primary-700 hover:bg-primary-50">Save profile</button></form></aside>
                </div>
            </div>
        </div>
    )
}
