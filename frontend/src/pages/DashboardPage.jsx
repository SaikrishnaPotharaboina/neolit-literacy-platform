import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { learningApi } from '../services/learningApi'

const skills = ['reading', 'writing', 'comprehension']
const supportedLanguageCodes = ['en', 'hi', 'kn', 'ta', 'te']
const leaderboardRows = [
    { name: 'Aarav', xp: 1840, streak: 18 },
    { name: 'Meera', xp: 1620, streak: 14 },
    { name: 'You', xp: 0, streak: 0, current: true },
    { name: 'Rohan', xp: 1110, streak: 7 },
    { name: 'Ananya', xp: 980, streak: 6 },
]
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
    en: 'Build basic sentences',
    hi: 'मूल वाक्य बनाइए',
    kn: 'ಮೂಲ ವಾಕ್ಯಗಳನ್ನು ರಚಿಸಿ',
    ta: 'அடிப்படை வாக்கியங்களை உருவாக்கு',
    te: 'ప్రాథమిక వాక్యాలను రూపొందించండి',
}

const courseUnits = {
    en: [
        ['Build basic sentences', 'Greetings and everyday words'],
        ['Talk about your day', 'Simple routines and useful verbs'],
        ['Food and preferences', 'Order food and share opinions'],
        ['Make real conversations', 'Bring your new skills together'],
        ['Travel and directions', 'Ask for help and follow instructions'],
        ['Family and relationships', 'Talk about people you care about'],
        ['Plans and future goals', 'Share what you want to do next'],
        ['Daily confidence', 'Use your language naturally in real life'],
    ],
    hi: [['मूल वाक्य बनाइए', 'अभिवादन और रोज़मर्रा के शब्द'], ['अपने दिन के बारे में बात करें', 'सरल दिनचर्या और क्रियाएँ'], ['खाने और पसंद के बारे में', 'खाना ऑर्डर करना सीखें'], ['बातचीत का अभ्यास करें', 'अपने कौशल को साथ लाएँ'], ['यात्रा और रास्ते', 'मदद मांगें और निर्देशों का पालन करें'], ['परिवार और रिश्ते', 'अपने प्रियजनों के बारे में बात करें'], ['योजनाएँ और लक्ष्यों', 'अगला कदम साझा करें'], ['दैनिक आत्मविश्वास', 'जीवन में भाषा का सही उपयोग करें']],
    kn: [['ಮೂಲ ವಾಕ್ಯಗಳನ್ನು ರಚಿಸಿ', 'ಶುಭಾಶಯಗಳು ಮತ್ತು ದೈನಂದಿನ ಪದಗಳು'], ['ನಿಮ್ಮ ದಿನದ ಬಗ್ಗೆ ಮಾತನಾಡಿ', 'ಸರಳ ದಿನಚರಿ ಮತ್ತು ಕ್ರಿಯಾಪದಗಳು'], ['ಆಹಾರ ಮತ್ತು ಇಷ್ಟಗಳು', 'ಆಹಾರವನ್ನು ಆರ್ಡರ್ ಮಾಡಲು ಕಲಿಯಿರಿ'], ['ನೈಜ ಸಂಭಾಷಣೆ ಮಾಡಿ', 'ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ'], ['ಪ್ರಯಾಣ ಮತ್ತು ದಿಕ್ಕುಗಳು', 'ಸಹಾಯ ಕೇಳಿ ಮತ್ತು ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ'], ['ಕುಟುಂಬ ಮತ್ತು ಸಂಬಂಧಗಳು', 'ಪ್ಯಾರಿನ ಜನರ ಬಗ್ಗೆ ಮಾತನಾಡಿ'], ['ಯೋಜನೆಗಳು ಮತ್ತು ಗುರಿಗಳು', 'ಮುಂದಿನದನ್ನು ಹಂಚಿಕೊಳ್ಳಿ'], ['ದೈನಂದಿನ ಆತ್ಮವಿಶ್ವಾಸ', 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಸ್ವಾಭಾವಿಕವಾಗಿ ಬಳಸಿ']],
    ta: [['அடிப்படை வாக்கியங்களை உருவாக்கு', 'வாழ்த்துகள் மற்றும் அன்றாட சொற்கள்'], ['உங்கள் நாளைப் பற்றி பேசுங்கள்', 'எளிய பழக்கங்கள் மற்றும் வினைச்சொற்கள்'], ['உணவு மற்றும் விருப்பங்கள்', 'உணவை ஆர்டர் செய்ய கற்றுக்கொள்ளுங்கள்'], ['உண்மையான உரையாடல்கள்', 'உங்கள் திறன்களை ஒன்றிணைக்கவும்'], ['பயணம் மற்றும் திசைகள்', 'உதவி கேட்கவும், வழிமுறைகளைப் பின்பற்றவும்'], ['குடும்பம் மற்றும் உறவுகள்', 'உங்களை நேசிக்கும் மக்களைப் பற்றி பேசுங்கள்'], ['திட்டங்கள் மற்றும் இலக்குகள்', 'அடுத்ததைப் பற்றி பகிர்ந்து கொள்ளுங்கள்'], ['அன்றாட நம்பிக்கை', 'உங்கள் மொழியை இயல்பாகப் பயன்படுத்துங்கள்']],
    te: [['ప్రాథమిక వాక్యాలను రూపొందించండి', 'శుభాకాంక్షలు మరియు రోజువారీ పదాలు'], ['మీ రోజు గురించి మాట్లాడండి', 'సులభమైన దినచర్యలు మరియు క్రియలు'], ['ఆహారం మరియు అభిరుచులు', 'ఆహారం ఆర్డర్ చేయడం నేర్చుకోండి'], ['నిజమైన సంభాషణలు చేయండి', 'మీ నైపుణ్యాలను కలపండి'], ['ప్రయాణం మరియు దిశలు', 'సహాయం అడిగి, సూచనలను అనుసరించండి'], ['పరివారము మరియు సంబంధాలు', 'మీ చిన్నచిన్నవారిని గురించి మాట్లాడండి'], ['ప్లాన్లు మరియు లక్ష్యాలు', 'తదుపరి పనిని పంచుకోండి'], ['రోజువారీ నైపుణ్యం', 'మీ భాషను సహజంగా ఉపయోగించండి']],
}

const unitLessonLabels = ['Learn words', 'Build sentences', 'Practice conversation']

const letterLessons = {
    en: {
        title: "Let's learn English sounds!",
        subtitle: 'Train your ear and learn to pronounce English sounds',
        vowels: [
            ['ɑ', 'hot'], ['æ', 'cat'], ['ʌ', 'but'], ['ɛ', 'bed'], ['eɪ', 'say'], ['ɝ', 'bird'],
            ['ɪ', 'ship'], ['i', 'sheep'], ['ə', 'about'], ['oʊ', 'boat'], ['ʊ', 'foot'], ['u', 'food'],
            ['aʊ', 'cow'], ['aɪ', 'time'], ['ɔɪ', 'boy'],
        ],
        consonants: [
            ['b', 'book'], ['tʃ', 'chair'], ['d', 'day'], ['f', 'fish'], ['g', 'go'], ['h', 'home'],
            ['dʒ', 'job'], ['k', 'key'], ['l', 'lion'], ['m', 'moon'], ['n', 'nose'], ['ŋ', 'sing'],
            ['p', 'pig'], ['ɹ', 'red'], ['s', 'see'], ['ʒ', 'measure'], ['ʃ', 'shoe'], ['t', 'time'],
            ['ð', 'then'], ['θ', 'think'], ['v', 'very'], ['w', 'water'], ['j', 'you'], ['z', 'zoo'],
        ],
    },
    hi: {
        title: 'आइए हिंदी अक्षर सीखें!',
        subtitle: 'स्वर और व्यंजन का उच्चारण सीखें',
        vowels: [['अ', 'अदरक'], ['आ', 'आम'], ['इ', 'इमली'], ['ई', 'ईख'], ['उ', 'उल्लू'], ['ऊ', 'ऊन'], ['ए', 'एक'], ['ऐ', 'ऐनक'], ['ओ', 'ओखली'], ['औ', 'औरत']],
        consonants: [['क', 'कमल'], ['ख', 'खरगोश'], ['ग', 'गमला'], ['घ', 'घर'], ['च', 'चम्मच'], ['छ', 'छाता'], ['ज', 'जहाज'], ['ट', 'टमाटर'], ['ड', 'डमरू'], ['त', 'तरबूज'], ['द', 'दवात'], ['न', 'नल'], ['प', 'पतंग'], ['ब', 'बकरी'], ['म', 'मछली'], ['र', 'रस्सी'], ['ल', 'लड्डू'], ['स', 'सेब'], ['ह', 'हाथी']],
    },
    kn: {
        title: 'ಕನ್ನಡ ಅಕ್ಷರಗಳನ್ನು ಕಲಿಯೋಣ!',
        subtitle: 'ಸ್ವರಗಳು ಮತ್ತು ವ್ಯಂಜನಗಳನ್ನು ಉಚ್ಚರಿಸಲು ಕಲಿಯಿರಿ',
        vowels: [['ಅ', 'ಅಕ್ಕ'], ['ಆ', 'ಆನೆ'], ['ಇ', 'ಇಲಿ'], ['ಈ', 'ಈಜು'], ['ಉ', 'ಉಪ್ಪು'], ['ಊ', 'ಊಟ'], ['ಎ', 'ಎಲೆ'], ['ಏ', 'ಏಣಿ'], ['ಒ', 'ಒಂಟೆ'], ['ಓ', 'ಓಡು']],
        consonants: [['ಕ', 'ಕಮಲ'], ['ಖ', 'ಖಡ್ಗ'], ['ಗ', 'ಗಿಡ'], ['ಘ', 'ಘಂಟೆ'], ['ಚ', 'ಚಂದ್ರ'], ['ಜ', 'ಜಿಂಕೆ'], ['ಟ', 'ಟಗರು'], ['ಡ', 'ಡಬ್ಬಿ'], ['ತ', 'ತಲೆ'], ['ದ', 'ದನ'], ['ನ', 'ನದಿ'], ['ಪ', 'ಪಟ'], ['ಬ', 'ಬಾಳೆ'], ['ಮ', 'ಮನೆ'], ['ಯ', 'ಯಾನ'], ['ರ', 'ರಥ'], ['ಲ', 'ಲತೆ'], ['ವ', 'ವನು'], ['ಸ', 'ಸೂರ್ಯ'], ['ಹ', 'ಹಸು']],
    },
    ta: {
        title: 'தமிழ் எழுத்துக்களை கற்போம்!',
        subtitle: 'உயிர் மற்றும் மெய் எழுத்துக்களை உச்சரிக்க கற்றுக்கொள்ளுங்கள்',
        vowels: [['அ', 'அம்மா'], ['ஆ', 'ஆடு'], ['இ', 'இலை'], ['ஈ', 'ஈ'], ['உ', 'உப்பு'], ['ஊ', 'ஊர்'], ['எ', 'எலி'], ['ஏ', 'ஏணி'], ['ஐ', 'ஐந்து'], ['ஒ', 'ஒட்டகம்'], ['ஓ', 'ஓநாய்'], ['ஔ', 'ஔவை']],
        consonants: [['க்', 'கல்'], ['ங்', 'மாங்காய்'], ['ச்', 'சங்கு'], ['ஞ்', 'ஞாயிறு'], ['ட்', 'பட்டு'], ['ண்', 'மண்'], ['த்', 'தமிழ்'], ['ந்', 'நதி'], ['ப்', 'பல்'], ['ம்', 'மரம்'], ['ய்', 'மயில்'], ['ர்', 'மரம்'], ['ல்', 'இலை'], ['வ்', 'வலை'], ['ழ்', 'தமிழ்'], ['ள்', 'வாள்'], ['ற்', 'காற்று'], ['ன்', 'மீன்']],
    },
    te: {
        title: 'తెలుగు అక్షరాలు నేర్చుకుందాం!',
        subtitle: 'అచ్చులు మరియు హల్లులను పలకడం నేర్చుకోండి',
        vowels: [['అ', 'అమ్మ'], ['ఆ', 'ఆవు'], ['ఇ', 'ఇల్లు'], ['ఈ', 'ఈగ'], ['ఉ', 'ఉడుత'], ['ఊ', 'ఊయల'], ['ఋ', 'ఋషి'], ['ఎ', 'ఎలుక'], ['ఏ', 'ఏనుగు'], ['ఐ', 'ఐదు'], ['ఒ', 'ఒంటె'], ['ఓ', 'ఓడ'], ['ఔ', 'ఔషధం']],
        consonants: [['క', 'కమలం'], ['ఖ', 'ఖడ్గం'], ['గ', 'గడియారం'], ['ఘ', 'ఘటం'], ['చ', 'చిలుక'], ['జ', 'జింక'], ['ట', 'టమాటా'], ['డ', 'డబ్బా'], ['త', 'తల'], ['ద', 'దీపం'], ['న', 'నది'], ['ప', 'పండు'], ['బ', 'బడి'], ['మ', 'మామిడి'], ['య', 'యానం'], ['ర', 'రథం'], ['ల', 'లత'], ['వ', 'వాన'], ['శ', 'శంఖం'], ['స', 'సూర్యుడు'], ['హ', 'హంస']],
    },
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
    const [assessments, setAssessments] = useState([])
    const [profile, setProfile] = useState(null)
    const [progress, setProgress] = useState(null)
    const [learningState, setLearningState] = useState(null)
    const [selected, setSelected] = useState(null)
    const [answers, setAnswers] = useState({})
    const [expandedModule, setExpandedModule] = useState(null)
    const [result, setResult] = useState(null)
    const [message, setMessage] = useState('')
    const [activeSkill, setActiveSkill] = useState('reading')
    const [selectedLesson, setSelectedLesson] = useState('reading')
    const [activeSection, setActiveSection] = useState('learn')
    const [lettersStarted, setLettersStarted] = useState(false)
    const [letterProgress, setLetterProgress] = useState({})
    const [quizOpen, setQuizOpen] = useState(false)
    const [quizAnswer, setQuizAnswer] = useState(null)
    const [quizScore, setQuizScore] = useState(0)
    const [quizIndex, setQuizIndex] = useState(0)
    const [courseMenuOpen, setCourseMenuOpen] = useState(false)
    const [changingCourse, setChangingCourse] = useState(false)
    const [leaderboardPeriod, setLeaderboardPeriod] = useState('weekly')
    const [activeUnit, setActiveUnit] = useState(1)
    const [sectionUnlockNotice, setSectionUnlockNotice] = useState('')
    const [seenQuestions, setSeenQuestions] = useState({})
    const [completedPathLessons, setCompletedPathLessons] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('neolit_completed_path_lessons') || '{}')
        } catch {
            return {}
        }
    })

    useEffect(() => {
        const load = async () => {
            try {
                const dashboard = await learningApi.getDashboardBootstrap()
                const supportedLanguages = dashboard.languages.filter((item) => supportedLanguageCodes.includes(item.code))
                setLanguages(supportedLanguages)
                setLevels(dashboard.levels)
                setProfile(dashboard.profile)
                setProgress(dashboard.progress)
                setLearningState(dashboard.learning_state)
                setCompletedPathLessons((dashboard.learning_state.completions || []).reduce((groups, completion) => {
                    const key = `${completion.language_code}-${completion.unit_number}`
                    groups[key] = [...(groups[key] || []), completion.lesson_step]
                    return groups
                }, {}))
                setAssessments(dashboard.assessments)
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

    const selectedLanguageCode = profile?.learning_language || localStorage.getItem('neolit_selected_language') || 'en'
    const selectedLanguageName = languages.find((item) => item.code === selectedLanguageCode)?.name || 'English'
    const activeStageCopy = lessonStageCopy[selectedLanguageCode]?.[selectedLesson] || lessonStageCopy.en[selectedLesson] || 'Talk about food'
    const selectedLessonTitle = lessonTitles[selectedLanguageCode] || lessonTitles.en
    const selectedUnits = courseUnits[selectedLanguageCode] || courseUnits.en
    const totalUnitsPerSection = 4
    const sectionNumber = Math.ceil(activeUnit / totalUnitsPerSection)
    const sectionStartIndex = (sectionNumber - 1) * totalUnitsPerSection
    const sectionUnits = selectedUnits.slice(sectionStartIndex, Math.min(sectionStartIndex + totalUnitsPerSection, selectedUnits.length))
    const activeUnitDetails = selectedUnits[activeUnit - 1]
    const unitProgressKey = `${selectedLanguageCode}-${activeUnit}`
    const completedLessons = completedPathLessons[unitProgressKey] || []
    const totalCompletedLessons = learningState?.completions?.length ?? Object.values(completedPathLessons).reduce((sum, unitProgress) => sum + unitProgress.length, 0)
    const currentPathLesson = completedLessons.length
    const examScore = Number(progress?.overall?.score || 0)
    const xpTotal = learningState?.xp ?? totalCompletedLessons * 10 + examScore
    const streakDays = learningState?.streak_days ?? 0
    const gemsTotal = learningState?.gems ?? 0
    const heartsRemaining = learningState?.hearts ?? 5
    const dailyGoalTarget = 3
    const dailyLessons = learningState?.daily_lessons ?? 0
    const dailyGoalProgress = Math.min(100, (dailyLessons / dailyGoalTarget) * 100)
    const areAllLessonsCompleted = (unitNumber) => (completedPathLessons[`${selectedLanguageCode}-${unitNumber}`] || []).length === unitLessonLabels.length
    const isUnitUnlocked = (unitNumber) => unitNumber === 1 || areAllLessonsCompleted(unitNumber - 1)
    const selectedLetters = letterLessons[selectedLanguageCode] || letterLessons.en
    const letterItems = useMemo(
        () => [...selectedLetters.vowels, ...selectedLetters.consonants],
        [selectedLetters]
    )
    const practicedLetters = Object.keys(letterProgress).length
    const quizItem = letterItems[quizIndex % letterItems.length]
    const quizOptions = [quizItem, letterItems[(quizIndex + 3) % letterItems.length], letterItems[(quizIndex + 7) % letterItems.length]]

    const levelName = (levelId) => levels.find((level) => level.id === levelId)?.name || 'Beginner'

    useEffect(() => {
        if (!selectedUnits.length) return
        const highestUnlockedUnit = selectedUnits.reduce((highest, _, index) => {
            const unitNumber = index + 1
            return isUnitUnlocked(unitNumber) ? unitNumber : highest
        }, 1)

        if (activeUnit > highestUnlockedUnit) {
            setActiveUnit(highestUnlockedUnit)
        }

        const currentSection = Math.ceil(activeUnit / totalUnitsPerSection)
        const isFinalUnitOfSection = activeUnit % totalUnitsPerSection === 0 || activeUnit === selectedUnits.length
        const nextSectionNumber = currentSection + 1

        if (areAllLessonsCompleted(activeUnit) && activeUnit < selectedUnits.length && isUnitUnlocked(activeUnit + 1)) {
            const targetUnit = activeUnit + 1
            const targetSection = Math.ceil(targetUnit / totalUnitsPerSection)
            setActiveUnit((current) => (current === activeUnit ? targetUnit : current))
            if (isFinalUnitOfSection && targetSection > currentSection) {
                setSectionUnlockNotice(`Section ${targetSection} unlocked`)
            } else {
                setSectionUnlockNotice(`Section ${targetSection} unlocked`)
            }
        }
    }, [activeUnit, completedPathLessons, selectedLanguageCode, selectedUnits])

    const getAssessmentRound = (assessment) => {
        const pool = Array.isArray(assessment?.questions) ? assessment.questions : []
        if (!pool.length) return assessment

        const seenForAssessment = seenQuestions[assessment.id] || []
        const unseen = pool.filter((question) => !seenForAssessment.includes(question.id))
        const nextQuestions = unseen.length ? unseen : pool
        const shuffled = [...nextQuestions].sort(() => Math.random() - 0.5)

        return { ...assessment, questions: shuffled }
    }

    useEffect(() => {
        if (!selected && visibleAssessments.length) {
            setSelected(getAssessmentRound(visibleAssessments[0]))
        }
    }, [selected, visibleAssessments, seenQuestions])

    const selectAssessment = (assessment) => {
        setSelected(getAssessmentRound(assessment))
        setAnswers({})
        setResult(null)
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

            const usedQuestionIds = (selected.questions || []).map((question) => question.id)
            setSeenQuestions((previous) => ({
                ...previous,
                [selected.id]: [...(previous[selected.id] || []), ...usedQuestionIds],
            }))

            setResult(assessmentResult)
            setSelected(null)
            setAnswers({})
            const [progressData, learningStateData] = await Promise.all([
                learningApi.getProgress(),
                learningApi.getLearningState(),
            ])
            setProgress(progressData)
            setLearningState(learningStateData)
            setMessage(harderAssessment ? 'Saved. Review your result before continuing.' : 'Assessment saved to your progress.')
        } catch (error) {
            const detail = error?.response?.data?.detail
            const message = Array.isArray(detail)
                ? detail.map((item) => item.msg || item).join(', ')
                : detail || 'Unable to submit assessment'
            setMessage(message)
        }
    }

    const speakLetter = (letter, word) => {
        setLetterProgress((prev) => ({ ...prev, [letter]: true }))
        if (!window.speechSynthesis) return
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(`${letter}, ${word}`)
        utterance.lang = selectedLanguageCode === 'en' ? 'en-US' : `${selectedLanguageCode}-IN`
        window.speechSynthesis.speak(utterance)
    }

    const goToNextUnlockedUnit = () => {
        const nextUnit = selectedUnits.findIndex((_, index) => index + 1 > activeUnit && isUnitUnlocked(index + 1)) + 1
        const targetUnit = nextUnit > 0 ? nextUnit : activeUnit
        setActiveUnit(targetUnit)
        setSectionUnlockNotice('')
    }

    const changeCourse = async (languageCode) => {
        if (!profile || languageCode === selectedLanguageCode) {
            setCourseMenuOpen(false)
            return
        }

        setChangingCourse(true)
        try {
            const updatedProfile = await learningApi.updateProfile({
                ...profile,
                first_name: profile.first_name || user?.first_name || 'Learner',
                last_name: profile.last_name || user?.last_name || '',
                learning_language: languageCode,
            })
            setProfile(updatedProfile)
            localStorage.setItem('neolit_selected_language', languageCode)
            setCourseMenuOpen(false)
            setMessage('Course changed successfully.')
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Unable to change course')
        } finally {
            setChangingCourse(false)
        }
    }

    const renderLetters = () => (
        <section className="letters-page">
            <div className="letters-heading">
                <h1>{selectedLetters.title}</h1>
                <p>{selectedLetters.subtitle}</p>
                <button type="button" className="letters-start-button" onClick={() => setLettersStarted(true)}>
                    {lettersStarted ? 'PRACTICE STARTED' : 'START +10 XP'}
                </button>
                <div className="letters-progress-summary">
                    <span>{practicedLetters} / {letterItems.length} sounds practiced</span>
                    <div><i style={{ width: `${(practicedLetters / letterItems.length) * 100}%` }} /></div>
                </div>
                <button type="button" className="letters-quiz-button" onClick={() => { setLettersStarted(true); setQuizOpen(true); setQuizAnswer(null); setQuizIndex(0); setQuizScore(0) }}>
                    {quizOpen ? 'PRONUNCIATION QUIZ' : 'PRACTICE QUIZ'}
                </button>
            </div>

            {quizOpen && (
                <div className="letters-quiz-card">
                    <div>
                        <span className="section-kicker">Pronunciation quiz</span>
                        <h2>Which sound is this?</h2>
                        <button type="button" className="quiz-sound-button" onClick={() => speakLetter(quizItem[0], quizItem[1])}>
                            ▶ Hear “{quizItem[1]}”
                        </button>
                    </div>
                    <div className="quiz-options">
                        {quizOptions.map(([letter, word]) => (
                            <button key={`${letter}-${word}`} type="button" className={quizAnswer === letter ? (letter === quizItem[0] ? 'correct' : 'wrong') : ''} onClick={() => { setQuizAnswer(letter); if (letter === quizItem[0]) setQuizScore((score) => score + 1) }}>
                                {letter}
                            </button>
                        ))}
                    </div>
                    {quizAnswer && (
                        <>
                            <p className={quizAnswer === quizItem[0] ? 'quiz-feedback correct' : 'quiz-feedback wrong'}>{quizAnswer === quizItem[0] ? 'Correct! +10 XP' : `The answer is ${quizItem[0]}`}</p>
                            <button type="button" className="quiz-next-button" onClick={() => { setQuizIndex((index) => index + 1); setQuizAnswer(null) }}>NEXT SOUND</button>
                        </>
                    )}
                </div>
            )}

            {['vowels', 'consonants'].map((group) => (
                <section key={group} className="letters-group">
                    <h2><span />{group === 'vowels' ? 'Vowels' : 'Consonants'}<span /></h2>
                    <div className="letters-grid">
                        {selectedLetters[group].map(([letter, word]) => (
                            <button key={`${letter}-${word}`} type="button" className="letter-card" onClick={() => speakLetter(letter, word)} title={`Hear ${letter}`}>
                                <strong>{letter}</strong>
                                <small>{word}</small>
                                <i />
                            </button>
                        ))}
                    </div>
                </section>
            ))}
        </section>
    )

    const renderLeaderboard = () => (
        <section className="leaderboard-page">
            <div className="leaderboard-heading">
                <span className="section-kicker">{selectedLanguageName} course</span>
                <h1>Leaderboards</h1>
                <p>Compete with learners and keep your streak moving.</p>
            </div>

            <div className="leaderboard-tabs" role="tablist" aria-label="Leaderboard period">
                {['weekly', 'monthly'].map((period) => (
                    <button key={period} type="button" className={leaderboardPeriod === period ? 'active' : ''} onClick={() => setLeaderboardPeriod(period)} role="tab" aria-selected={leaderboardPeriod === period}>
                        {period}
                    </button>
                ))}
            </div>

            <div className="leaderboard-card">
                <div className="leaderboard-card-header"><span>RANK</span><span>LEARNER</span><span>XP</span><span>STREAK</span></div>
                {[...leaderboardRows].map((row, index) => {
                    const liveRow = row.current ? { ...row, xp: xpTotal, streak: streakDays, name: user?.first_name || row.name } : row
                    return (
                        <div key={row.name} className={`leaderboard-row ${row.current ? 'current' : ''}`}>
                            <strong className="leaderboard-rank">{index + 1}</strong>
                            <span className="leaderboard-name"><i>{liveRow.name[0]}</i>{liveRow.name}</span>
                            <strong>{liveRow.xp.toLocaleString()}</strong>
                            <span className="leaderboard-streak">🔥 {liveRow.streak}</span>
                        </div>
                    )
                })}
            </div>
            <p className="leaderboard-note">Your {leaderboardPeriod} {selectedLanguageName} group, updated from your lesson progress.</p>
        </section>
    )

    const renderQuests = () => {
        const quests = [
            { title: 'Complete 3 lessons', detail: 'Keep your daily goal moving', current: Math.min(totalCompletedLessons, 3), target: 3, icon: '📚' },
            { title: 'Earn 30 XP', detail: 'Build your weekly momentum', current: Math.min(xpTotal, 30), target: 30, icon: '⚡' },
            { title: 'Practice your streak', detail: `${streakDays} days in a row`, current: Math.min(streakDays, 7), target: 7, icon: '🔥' },
        ]

        return (
            <section className="quests-page">
                <div className="leaderboard-heading">
                    <span className="section-kicker">{selectedLanguageName} course</span>
                    <h1>Quests</h1>
                    <p>Small goals that turn practice into progress.</p>
                </div>
                <div className="quests-grid">
                    {quests.map((quest) => (
                        <article key={quest.title} className="quest-card">
                            <div className="quest-card-icon">{quest.icon}</div>
                            <div className="quest-card-copy">
                                <h2>{quest.title}</h2>
                                <p>{quest.detail}</p>
                                <div className="quest-progress-track"><span style={{ width: `${(quest.current / quest.target) * 100}%` }} /></div>
                                <strong>{quest.current}/{quest.target}</strong>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        )
    }

    return (
        <div className="duolingo-reference-page">
            <aside className="duolingo-sidebar">
                <div className="duolingo-logo">NeoLit</div>

                <nav className="duolingo-sidebar-nav" aria-label="Main navigation">
                    <button type="button" className={`sidebar-item sidebar-button ${activeSection === 'learn' ? 'active' : ''}`} onClick={() => setActiveSection('learn')}><span className="nav-icon">🏠</span> LEARN</button>
                    <button type="button" className={`sidebar-item sidebar-button ${activeSection === 'letters' ? 'active' : ''}`} onClick={() => setActiveSection('letters')}><span className="nav-icon">✎</span> LETTERS</button>
                    <button type="button" className={`sidebar-item sidebar-button ${activeSection === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveSection('leaderboard')}><span className="nav-icon">🏆</span> LEADERBOARDS</button>
                    <button type="button" className={`sidebar-item sidebar-button ${activeSection === 'quests' ? 'active' : ''}`} onClick={() => setActiveSection('quests')}><span className="nav-icon">🎯</span> QUESTS</button>
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
                <div className="course-switcher">
                    <button type="button" className="course-switcher-button" onClick={() => setCourseMenuOpen((open) => !open)} aria-expanded={courseMenuOpen}>
                        <span className="course-switcher-flag">🌐</span>
                        <span><small>MY COURSE</small><strong>{selectedLanguageName}</strong></span>
                        <span className="course-switcher-chevron">⌄</span>
                    </button>
                    {courseMenuOpen && (
                        <div className="course-menu">
                            <strong>MY COURSES</strong>
                            {languages.map((language) => (
                                <button key={language.code} type="button" className={language.code === selectedLanguageCode ? 'selected' : ''} onClick={() => changeCourse(language.code)} disabled={changingCourse}>
                                    <span>{language.code === selectedLanguageCode ? '✓' : '+'}</span>
                                    {language.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {activeSection === 'letters' ? renderLetters() : activeSection === 'leaderboard' ? renderLeaderboard() : activeSection === 'quests' ? renderQuests() : <main className="duolingo-reference-main">
                    <section className="duolingo-reference-content">
                        <div className="duolingo-reference-banner">
                            <div className="banner-left">
                                <span className="banner-arrow">←</span>
                                <span className="banner-text">SECTION {sectionNumber}, UNIT {activeUnit}</span>
                            </div>
                            <div className="banner-chip">{Math.round((completedLessons.length / unitLessonLabels.length) * 100)}% COMPLETE</div>
                        </div>

                        <div className="unit-selector" aria-label="Course units">
                            {sectionUnits.map(([title, description], index) => {
                                const unitNumber = sectionStartIndex + index + 1
                                return (
                                    <button key={`${selectedLanguageCode}-${unitNumber}`} type="button" disabled={!isUnitUnlocked(unitNumber)} className={`unit-selector-card ${activeUnit === unitNumber ? 'active' : ''} ${!isUnitUnlocked(unitNumber) ? 'locked' : ''}`} onClick={() => setActiveUnit(unitNumber)}>
                                        <span className="unit-number">UNIT {unitNumber}</span>
                                        <strong>{title}</strong>
                                        <small>{description}</small>
                                        <span className="unit-progress"><i style={{ width: `${unitNumber === activeUnit ? (completedLessons.length / unitLessonLabels.length) * 100 : unitNumber < activeUnit ? 100 : 0}%` }} /></span>
                                    </button>
                                )
                            })}
                        </div>

                        <h1>{activeUnitDetails?.[0] || selectedLessonTitle}</h1>

                        <div className="course-path" aria-label={`Lessons in Unit ${activeUnit}`}>
                            <div className="course-path-line" />
                            {unitLessonLabels.map((label, index) => {
                                const completed = completedLessons.includes(index)
                                const current = index === currentPathLesson && !completed
                                const unlocked = index <= currentPathLesson
                                return (
                                    <Link key={label} to={unlocked ? `/lesson/${activeUnit}?step=${index}` : '#'} className={`course-path-node path-node-${index + 1} ${completed ? 'completed' : ''} ${current ? 'current' : ''} ${!unlocked ? 'locked' : ''}`}>
                                        <span>{completed ? '✓' : current ? '▶' : '🔒'}</span>
                                        <strong>{label}</strong>
                                        <small>{completed ? 'Completed' : current ? '+10 XP • Start here' : 'Complete the previous lesson'}</small>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="duolingo-reference-divider">{activeStageCopy}</div>

                        <div className="duolingo-reference-cta">
                            <div className="cta-copy">
                                <strong>{activeUnitDetails?.[0] || selectedLessonTitle}</strong>
                                <span>Unit {activeUnit} • 3 lessons • +10 XP each</span>
                            </div>
                            <div className="cta-actions">
                                <button type="button" onClick={goToNextUnlockedUnit} className="jump-btn" style={{ border: 'none', cursor: 'pointer' }}>
                                    {activeUnit < selectedUnits.length ? `GO TO UNIT ${Math.min(activeUnit + 1, selectedUnits.length)}` : `REVIEW UNIT ${activeUnit}`}
                                </button>
                                <button type="button" onClick={goToNextUnlockedUnit} className="play-btn" aria-label={`Go to next unlocked unit`} title={`Go to next unlocked unit`} style={{ border: 'none', cursor: 'pointer' }}>▶</button>
                            </div>
                        </div>
                    </section>
                    <aside className="duolingo-reference-side" aria-label="Progress and daily goals">
                        <div className="reference-stat-row">
                            <span>🌐 {selectedLanguageName}</span>
                            <span>🔥 {streakDays}</span>
                            <span>💎 {gemsTotal}</span>
                            <span>♥ {heartsRemaining}</span>
                        </div>
                        <article className="reference-side-card leaderboard-unlock-card">
                            <h2>Unlock Leaderboards!</h2>
                            <div className="reference-card-detail">
                                <span className="reference-card-icon">🏅</span>
                                <strong>{totalCompletedLessons >= 3 ? 'You are ready to compete!' : `Complete ${Math.max(0, 3 - totalCompletedLessons)} more lessons to start competing`}</strong>
                            </div>
                        </article>
                        <article className="reference-side-card daily-quests-card">
                            <div className="reference-side-card-header"><h2>Daily Quests</h2><button type="button" onClick={() => setActiveSection('quests')}>VIEW ALL</button></div>
                            <div className="reference-quest-row">
                                <span className="quest-lightning">⚡</span>
                                <div><strong>Earn 10 XP</strong><div className="reference-quest-progress"><span style={{ width: `${Math.min(100, (xpTotal / 10) * 100)}%` }} /></div><small>{Math.min(xpTotal, 10)} / 10</small></div>
                                <span>🎁</span>
                            </div>
                        </article>
                    </aside>
                </main>}
            </div>
        </div>
    )
}
