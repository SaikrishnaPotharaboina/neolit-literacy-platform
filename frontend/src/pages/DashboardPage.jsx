import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { learningApi } from '../services/learningApi'

const skills = ['reading', 'writing', 'comprehension']
const lessonStages = [
    { id: 'reading', icon: '🧠', label: 'Reading' },
    { id: 'writing', icon: '💡', label: 'Writing' },
    { id: 'comprehension', icon: '⭐', label: 'Comprehension' },
    { id: 'progress', icon: '🏆', label: 'Progress' },
]

const lessonStageCopy = {
    en: {
        reading: 'Talk about food',
        writing: 'Write simple sentences',
        comprehension: 'Recognize key phrases',
        progress: 'Track your learning progress',
    },
    hi: {
        reading: 'खाने के बारे में बात करें',
        writing: 'सरल वाक्य लिखें',
        comprehension: 'मुख्य वाक्यांश पहचानें',
        progress: 'अपना सीखना ट्रैक करें',
    },
    kn: {
        reading: 'ಆಹಾರದ ಬಗ್ಗೆ ಮಾತನಾಡಿ',
        writing: 'ಸರಳ ವಾಕ್ಯಗಳನ್ನು ಬರೆಯಿರಿ',
        comprehension: 'ಮುಖ್ಯ ಪದಗುಚ್ಛಗಳನ್ನು ಗುರುತಿಸಿ',
        progress: 'ನಿಮ್ಮ ಕಲಿಕೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    },
    ta: {
        reading: 'உணவு பற்றிப் பேசுங்கள்',
        writing: 'எளிய வாக்கியங்களை எழுதுங்கள்',
        comprehension: 'முக்கிய சொற்றொடர்களை அடையாளம் காணுங்கள்',
        progress: 'உங்கள் கற்றலைப் பின்பற்றுங்கள்',
    },
    te: {
        reading: 'ఆహారం గురించి మాట్లాడండి',
        writing: 'సాధారణ వాక్యాలను రాయండి',
        comprehension: 'ముఖ్య వాక్యాల భాగాలను గుర్తించండి',
        progress: 'మీ అభ్యాసాన్ని ట్రాక్ చేయండి',
    },
}

const lessonTitles = {
    en: 'Form basic sentences',
    hi: 'मूल वाक्य बनाइए',
    kn: 'ಮೂಲ ವಾಕ್ಯಗಳನ್ನು ರಚಿಸಿ',
    ta: 'அடிப்படை வாக்கியங்களை உருவாக்கு',
    te: 'ప్రాథమిక వాక్యాలను రూపొందించండి',
}

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
    const [selectedLesson, setSelectedLesson] = useState('reading')

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

    const selectedLanguageCode = profile?.learning_language || 'en'
    const selectedLanguageName = languages.find((item) => item.code === selectedLanguageCode)?.name || 'English'
    const activeStageCopy = (lessonStageCopy[selectedLanguageCode] || lessonStageCopy.en)[selectedLesson] || 'Talk about food'
    const selectedLessonTitle = lessonTitles[selectedLanguageCode] || lessonTitles.en

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
        <div className="duolingo-reference-page">
            <aside className="duolingo-sidebar">
                <div className="duolingo-logo">NeoLit</div>

                <nav className="duolingo-sidebar-nav" aria-label="Main navigation">
                    <Link to="/dashboard" className="sidebar-item active"><span className="nav-icon">🏠</span> LEARN</Link>
                    <Link to="/dashboard" className="sidebar-item"><span className="nav-icon">✎</span> LETTERS</Link>
                    <Link to="/dashboard" className="sidebar-item"><span className="nav-icon">🏆</span> LEADERBOARDS</Link>
                    <Link to="/dashboard" className="sidebar-item"><span className="nav-icon">🎯</span> QUESTS</Link>
                    <Link to="/dashboard" className="sidebar-item"><span className="nav-icon">🛒</span> SHOP</Link>
                    <Link to="/profile" className="sidebar-item"><span className="nav-icon">👤</span> PROFILE</Link>
                    <Link to="/dashboard" className="sidebar-item"><span className="nav-icon">⋯</span> MORE</Link>
                </nav>

                <div className="duolingo-sidebar-status">
                    <span>31°C</span>
                    <small>Partly sunny</small>
                </div>

                <button type="button" className="duolingo-logout-button" onClick={logout}>
                    LOG OUT
                </button>
            </aside>

            <div className="duolingo-app-content">
                <main className="duolingo-reference-main">
                    <section className="duolingo-reference-content">
                        <div className="duolingo-reference-banner">
                            <div className="banner-left">
                                <span className="banner-arrow">←</span>
                                <span className="banner-text">SECTION 1, UNIT 1</span>
                            </div>
                            <div className="banner-chip">GUIDEBOOK</div>
                        </div>

                        <h1>{selectedLessonTitle}</h1>

                        <div className="duolingo-reference-scene" aria-label="Lesson focus options">
                            {lessonStages.map((stage, index) => (
                                <button
                                    key={stage.id}
                                    type="button"
                                    className={`scene-item item-${index + 1} ${selectedLesson === stage.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedLesson(stage.id)
                                        if (stage.id !== 'progress') {
                                            setActiveSkill(stage.id)
                                        }
                                    }}
                                    aria-label={stage.label}
                                    title={stage.label}
                                >
                                    {stage.icon}
                                </button>
                            ))}
                        </div>

                        <div className="duolingo-reference-divider">{activeStageCopy}</div>

                        <div className="duolingo-reference-cta">
                            <button type="button" className="jump-btn" onClick={() => setActiveSkill(selectedLesson === 'progress' ? 'reading' : selectedLesson)}>JUMP HERE?</button>
                            <button type="button" className="play-btn" onClick={() => setActiveSkill(selectedLesson === 'progress' ? 'reading' : selectedLesson)}>▶</button>
                        </div>
                    </section>

                    <aside className="duolingo-reference-side">
                        <div className="duolingo-course-panel">
                            <div className="language-card-row">
                                <span className="language-pill">{selectedLanguageName}</span>
                                <button type="button" className="mini-add-btn">＋</button>
                            </div>
                            <div className="course-art">✦</div>
                        </div>

                        <div className="mini-card promo-card">
                            <button type="button">TRY 1 WEEK FREE</button>
                        </div>

                        <div className="mini-card">
                            <h3>Unlock Leaderboards!</h3>
                            <div className="leaderboard-line">
                                <span>🏆</span>
                                <span>Complete 3 more lessons to start competing</span>
                            </div>
                        </div>

                        <div className="mini-card">
                            <div className="mini-header">
                                <h3>Daily Quests</h3>
                                <span>VIEW ALL</span>
                            </div>
                            <div className="quest-row">
                                <div className="quest-copy">
                                    <strong>Earn 10 XP</strong>
                                    <div className="quest-bar"><span /></div>
                                </div>
                                <span className="quest-badge">🏆</span>
                            </div>
                        </div>

                        <div className="mini-card discover-card">
                            <h3>Discover more</h3>
                            <button type="button">Take Sociology Courses <span>›</span></button>
                            <button type="button">Stream History Documentaries <span>›</span></button>
                            <button type="button">Get Study Guides <span>›</span></button>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    )
}
