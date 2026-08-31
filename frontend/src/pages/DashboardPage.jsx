import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { learningApi } from '../services/learningApi'

const skills = ['reading', 'writing', 'comprehension']

function ProgressBar({ value, accent = 'emerald' }) {
    const width = `${Math.min(100, Math.max(0, value || 0))}%`
    return (
        <div className="dashboard-progress-track">
            <div className={`dashboard-progress-fill ${accent}`} style={{ width }} />
        </div>
    )
}

function ScoreCard({ label, item, featured = false }) {
    return (
        <article className={`dashboard-score-card ${featured ? 'featured' : ''}`}>
            <div className="score-card-top">
                <span>{label}</span>
                <span className="score-card-level">{item?.level || 'Beginner'}</span>
            </div>
            <p className="score-card-value">{item?.score || 0}<span>%</span></p>
            <ProgressBar value={item?.score || 0} accent={featured ? 'emerald' : 'cyan'} />
        </article>
    )
}

function AssessmentCard({ assessment, levelName, active, onSelect }) {
    return (
        <button type="button" onClick={onSelect} className={`assessment-card ${active ? 'active' : ''}`}>
            <div className="assessment-card-head">
                <span className="assessment-type">{assessment.assessment_type}</span>
                <span className="assessment-level">{levelName(assessment.level_id)}</span>
            </div>
            <h3>{assessment.title}</h3>
            <p>{assessment.questions.length} questions � {assessment.total_marks} marks</p>
        </button>
    )
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
    const [nextAssessment, setNextAssessment] = useState(null)
    const [message, setMessage] = useState('')
    const [activeSkill, setActiveSkill] = useState('reading')

    useEffect(() => {
        const load = async () => {
            try {
                const [languageData, levelData, profileData, progressData, assessmentData] = await Promise.all([
                    learningApi.getLanguages(),
                    learningApi.getLevels(),
                    learningApi.getProfile(),
                    learningApi.getProgress(),
                    learningApi.getAssessments(),
                ])

                const language = languageData.find((item) => item.code === profileData.learning_language) || languageData[0]
                setLanguages(languageData)
                setLevels(levelData)
                setProfile(profileData)
                setProgress(progressData)
                setAssessments(assessmentData)
                setModules(await learningApi.getCurriculum({ language_id: language?.id, level_id: profileData.current_level_id || levelData[0]?.id }))
            } catch (error) {
                setMessage(error.response?.data?.detail || 'Unable to load your learning space')
            }
        }
        load()
    }, [])

    const visibleAssessments = useMemo(
        () => assessments.filter((assessment) => assessment.assessment_type === activeSkill),
        [assessments, activeSkill]
    )

    const levelName = (levelId) => levels.find((level) => level.id === levelId)?.name || 'Beginner'
    const lessonCount = modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)

    useEffect(() => {
        if (!selected && visibleAssessments.length) {
            setSelected(visibleAssessments[0])
        }
    }, [selected, visibleAssessments])

    const selectAssessment = (assessment) => {
        setSelected(assessment)
        setAnswers({})
        setResult(null)
        setNextAssessment(null)
    }

    const submit = async (event) => {
        event.preventDefault()

        if (!selected) {
            setMessage('Select an assessment before submitting.')
            return
        }

        const normalizedAnswers = Object.fromEntries(
            Object.entries(answers).map(([questionId, answer]) => {
                if (answer === null || answer === undefined) {
                    return [String(questionId), '']
                }
                return [String(questionId), String(answer).trim()]
            })
        )

        try {
            const assessmentResult = await learningApi.submitAssessment(selected.id, normalizedAnswers)
            const harderAssessment = assessments.find(
                (assessment) => assessment.assessment_type === selected.assessment_type && assessment.level_id > selected.level_id
            )

            setResult(assessmentResult)
            setNextAssessment(harderAssessment || null)
            setSelected(null)
            setAnswers({})
            setProgress(await learningApi.getProgress())
            setMessage(harderAssessment ? 'Saved. Review your result before continuing.' : 'Assessment saved to your progress.')
        } catch (error) {
            const detail = error?.response?.data?.detail
            const message = Array.isArray(detail)
                ? detail.map((item) => item.msg || item).join(', ')
                : detail || 'Unable to submit assessment'
            setMessage(message)
        }
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-shell">
                <header className="dashboard-header">
                    <div className="brand-group">
                        <div className="brand-mark">N</div>
                        <div>
                            <p className="brand-name">NeoLit</p>
                            <p className="brand-subtitle">Learning Lab</p>
                        </div>
                    </div>

                    <div className="dashboard-header-actions">
                        <Link to="/profile" className="profile-pill">
                            <span className="avatar-dot">{user?.first_name?.[0] || 'L'}</span>
                            <span>Profile</span>
                        </Link>
                        <button type="button" onClick={logout} className="logout-btn">Log out</button>
                    </div>
                </header>

                <section className="dashboard-hero">
                    <div className="hero-copy">
                        <p className="eyebrow">Your learning space</p>
                        <h1>Keep your momentum, {user?.first_name || 'learner'}.</h1>
                        <p className="hero-text">
                            Short practice sessions add up. Continue with {lessonCount || 'your'} lessons in{' '}
                            {languages.find((item) => item.code === profile?.learning_language)?.name || 'your chosen language'}.
                        </p>
                    </div>

                    <div className="focus-card">
                        <span>Current focus</span>
                        <strong>{levelName(profile?.current_level_id)}</strong>
                        <small>Keep practicing to reach your next benchmark.</small>
                    </div>
                </section>

                {message && <div className="dashboard-alert">{message}</div>}

                <section className="stats-grid">
                    <ScoreCard label="overall" item={progress?.overall} featured />
                    {skills.map((skill) => (
                        <ScoreCard key={skill} label={skill} item={progress?.[skill]} />
                    ))}
                </section>

                <div className="dashboard-layout">
                    <main className="dashboard-main-panel">
                        <section className="dashboard-panel">
                            <div className="panel-header">
                                <div>
                                    <p className="eyebrow">Learning path</p>
                                    <h2>Your lessons</h2>
                                </div>
                                <span className="module-badge">{modules.length} modules</span>
                            </div>

                            <div className="module-list">
                                {modules.map((module) => (
                                    <article key={module.id} className="module-item">
                                        <button
                                            type="button"
                                            className="module-toggle"
                                            onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                                        >
                                            <div>
                                                <span className="module-index">Module {String(module.order_number).padStart(2, '0')}</span>
                                                <strong>{module.title}</strong>
                                                <small>{module.description}</small>
                                            </div>
                                            <span className="toggle-icon">{expandedModule === module.id ? '-' : '+'}</span>
                                        </button>

                                        {expandedModule === module.id && (
                                            <div className="module-lessons">
                                                {module.lessons.map((lesson) => (
                                                    <div key={lesson.id} className="mini-lesson-card">
                                                        <span>Lesson {lesson.order_number}</span>
                                                        <h3>{lesson.title}</h3>
                                                        <p>{lesson.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="dashboard-panel assessment-panel">
                            <div className="panel-header assessment-header">
                                <div>
                                    <p className="eyebrow">Skill check</p>
                                    <h2>Assessment center</h2>
                                </div>
                                <div className="skill-tabs">
                                    {skills.map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            className={`skill-tab ${activeSkill === skill ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveSkill(skill)
                                                setSelected(null)
                                                setResult(null)
                                                setNextAssessment(null)
                                            }}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="assessment-list">
                                {visibleAssessments.map((assessment) => (
                                    <AssessmentCard
                                        key={assessment.id}
                                        assessment={assessment}
                                        levelName={levelName}
                                        active={selected?.id === assessment.id}
                                        onSelect={() => selectAssessment(assessment)}
                                    />
                                ))}
                            </div>

                            {selected && (
                                <form onSubmit={submit} className="assessment-form">
                                    <div className="assessment-form-header">
                                        <div>
                                            <span className="assessment-form-tag">{levelName(selected.level_id)} challenge</span>
                                            <h3>{selected.title}</h3>
                                        </div>
                                        <span className="assessment-count">{selected.questions.length} questions</span>
                                    </div>

                                    <div className="question-list">
                                        {selected.questions.map((question, index) => (
                                            <fieldset key={question.id} className="question-block">
                                                <legend>
                                                    {index + 1}. {question.question_text}
                                                </legend>
                                                {question.options.length ? (
                                                    <div className="choice-grid">
                                                        {question.options.map((option) => (
                                                            <label key={option.id} className="choice-item">
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${question.id}`}
                                                                    checked={answers[question.id] === option.option_text}
                                                                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.option_text }))}
                                                                />
                                                                <span>{option.option_text}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={answers[question.id] || ''}
                                                        onChange={(event) =>
                                                            setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))
                                                        }
                                                        className="short-answer"
                                                        placeholder="Type your answer"
                                                    />
                                                )}
                                            </fieldset>
                                        ))}
                                    </div>

                                    <button type="submit" className="submit-btn">Submit assessment</button>
                                </form>
                            )}

                            {result && (
                                <div className="result-box">
                                    <h3>Result</h3>
                                    <p>{result.message || 'Assessment completed successfully.'}</p>
                                    {nextAssessment && (
                                        <button type="button" onClick={() => setSelected(nextAssessment)} className="next-btn">
                                            Continue to next challenge
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>
                    </main>

                    <aside className="dashboard-side-panel">
                        <section className="side-card profile-card">
                            <p className="eyebrow">Quick profile</p>
                            <div className="profile-mini">
                                <span className="profile-avatar">{user?.first_name?.[0] || 'L'}</span>
                                <div>
                                    <strong>{profile?.first_name} {profile?.last_name}</strong>
                                    <small>{languages.find((item) => item.code === profile?.learning_language)?.name || 'Learning language'}</small>
                                </div>
                            </div>
                            <Link to="/profile" className="secondary-btn">Edit profile</Link>
                        </section>

                        <section className="side-card reminder-card">
                            <p className="eyebrow">A small reminder</p>
                            <h3>Consistency beats cramming.</h3>
                            <p>Finish one lesson today and let your progress build from there.</p>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    )
}
