import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { learningApi } from '../services/learningApi'

const skills = ['reading', 'writing', 'comprehension']

function ProgressCard({ skill, item }) {
    return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between"><div><p className="text-sm capitalize text-slate-500">{skill}</p><p className="mt-2 text-3xl font-bold text-slate-950">{item?.score || 0}%</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{item?.level || 'Beginner'}</span></div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${item?.score || 0}%` }} /></div>
    </article>
}

export default function DashboardPage() {
    const { user, logout } = useAuth()
    const [languages, setLanguages] = useState([])
    const [levels, setLevels] = useState([])
    const [modules, setModules] = useState([])
    const [assessments, setAssessments] = useState([])
    const [profile, setProfile] = useState(null)
    const [progress, setProgress] = useState(null)
    const [selected, setSelected] = useState(null)
    const [answers, setAnswers] = useState({})
    const [expandedModule, setExpandedModule] = useState(null)
    const [result, setResult] = useState(null)
    const [message, setMessage] = useState('')

    const load = async () => {
        try {
            const [languageData, levelData, profileData, progressData, assessmentData] = await Promise.all([
                learningApi.getLanguages(), learningApi.getLevels(), learningApi.getProfile(), learningApi.getProgress(), learningApi.getAssessments(),
            ])
            setLanguages(languageData)
            setLevels(levelData)
            setProfile(profileData)
            setProgress(progressData)
            setAssessments(assessmentData)
            const language = languageData.find((item) => item.code === profileData.learning_language) || languageData[0]
            setModules(await learningApi.getCurriculum({ language_id: language?.id, level_id: profileData.current_level_id || levelData[0]?.id }))
        } catch (error) { setMessage(error.response?.data?.detail || 'Unable to load your learning space') }
    }

    useEffect(() => { load() }, [])

    const saveProfile = async (event) => {
        event.preventDefault()
        try { setProfile(await learningApi.updateProfile(profile)); setMessage('Profile updated') } catch (error) { setMessage(error.response?.data?.detail || 'Unable to update profile') }
    }

    const submit = async (event) => {
        event.preventDefault()
        try {
            const assessmentResult = await learningApi.submitAssessment(selected.id, answers)
            setResult(assessmentResult)
            setProgress(await learningApi.getProgress())
            const harderAssessment = assessments.find((assessment) => assessment.assessment_type === selected.assessment_type && assessment.level_id > selected.level_id)
            if (harderAssessment) { setSelected(harderAssessment); setAnswers({}); setMessage('Saved. Your next challenge is ready.') } else { setMessage('Assessment saved.') }
        } catch (error) { setMessage(error.response?.data?.detail || 'Unable to submit assessment') }
    }

    const levelName = (levelId) => levels.find((level) => level.id === levelId)?.name || 'Beginner'

    return <div className="min-h-screen bg-[#f4f7f4] text-slate-900"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
        <header className="mb-8 flex items-center justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">NeoLit / learner space</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Good to see you, {user?.first_name || 'learner'}.</h1><p className="mt-2 text-slate-600">Build a stronger reading life, one focused lesson at a time.</p></div><button onClick={logout} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500">Log out</button></header>
        {message && <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{message}</p>}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><ProgressCard skill="overall" item={progress?.overall} />{skills.map((skill) => <ProgressCard key={skill} skill={skill} item={progress?.[skill]} />)}</section>
        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
            <main className="space-y-6">
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Your path</p><h2 className="mt-1 text-2xl font-bold">Curriculum lessons</h2></div><span className="text-sm font-semibold text-slate-500">{modules.reduce((total, module) => total + module.lessons.length, 0)} lessons available</span></div><div className="mt-6 space-y-3">{modules.map((module) => <article key={module.id} className="overflow-hidden rounded-lg border border-slate-200"><button onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)} className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50"><span><span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Module {module.order_number}</span><span className="mt-1 block font-bold">{module.title}</span><span className="mt-1 block text-sm text-slate-600">{module.description}</span></span><span className="text-xl text-slate-400">{expandedModule === module.id ? '−' : '+'}</span></button>{expandedModule === module.id && <div className="border-t border-slate-200 bg-slate-50 p-4"><div className="grid gap-3 sm:grid-cols-3">{module.lessons.map((lesson) => <div key={lesson.id} className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-semibold text-emerald-700">Lesson {lesson.order_number}</p><h3 className="mt-1 font-bold">{lesson.title}</h3><p className="mt-2 text-sm text-slate-600">{lesson.description}</p><p className="mt-3 text-xs text-slate-500">{lesson.activities.length} activities</p></div>)}</div></div>}</article>)}</div></section>
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Adaptive practice</p><h2 className="mt-1 text-2xl font-bold">Assessment studio</h2><p className="mt-1 text-sm text-slate-600">Complete a set to unlock a harder challenge for the same skill.</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{assessments.map((assessment) => <button key={assessment.id} onClick={() => { setSelected(assessment); setAnswers({}); setResult(null) }} className={`rounded-lg border p-4 text-left transition ${selected?.id === assessment.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400'}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{assessment.assessment_type}</span><span className="text-xs font-semibold text-slate-500">{levelName(assessment.level_id)}</span></div><p className="mt-2 font-bold">{assessment.title}</p></button>)}</div>{selected && <form onSubmit={submit} className="mt-6 space-y-5 border-t border-slate-200 pt-6"><p className="font-semibold">{selected.title}</p><p className="text-sm text-slate-600">{selected.description}</p>{selected.questions.map((question, index) => <fieldset key={question.id}><legend className="text-sm font-semibold">{index + 1}. {question.question_text}</legend>{question.options.length ? <div className="mt-3 space-y-2">{question.options.map((option) => <label key={option.id} className="flex cursor-pointer gap-2 text-sm text-slate-700"><input type="radio" name={`question-${question.id}`} value={option.option_text} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} required />{option.option_text}</label>)}</div> : <textarea className="mt-3 min-h-28 w-full rounded-lg border border-slate-300 p-3" placeholder="Write your response here..." required onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} />}</fieldset>)}<button className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700">Submit and continue</button></form>}{result && <p className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">Previous result: {result.percentage}% • {result.proficiency_level}</p>}</section>
            </main>
            <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Learner profile</p><h2 className="mt-1 text-2xl font-bold">Your settings</h2>{profile && <form onSubmit={saveProfile} className="mt-5 space-y-4">{[['first_name', 'First name'], ['last_name', 'Last name'], ['native_language', 'Native language'], ['education_level', 'Education level']].map(([field, label]) => <label key={field} className="block text-sm font-semibold text-slate-700">{label}<input value={profile[field] || ''} onChange={(event) => setProfile({ ...profile, [field]: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label>)}<label className="block text-sm font-semibold text-slate-700">Learning language<select value={profile.learning_language} onChange={(event) => setProfile({ ...profile, learning_language: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal">{languages.map((language) => <option key={language.id} value={language.code}>{language.name}</option>)}</select></label><label className="block text-sm font-semibold text-slate-700">Current level<select value={profile.current_level_id || levels[0]?.id} onChange={(event) => setProfile({ ...profile, current_level_id: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal">{levels.map((level) => <option key={level.id} value={level.id}>{level.name}</option>)}</select></label><button className="w-full rounded-lg border border-emerald-600 px-4 py-2.5 font-semibold text-emerald-700 transition hover:bg-emerald-50">Save profile</button></form>}</aside>
        </div>
    </div></div>
}
