import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { learningApi } from '../services/learningApi'

const lessonContent = {
    en: {
        title: 'Everyday communication',
        questions: [
            { prompt: 'Which word means a friendly greeting?', options: ['Hello', 'Water', 'Book'], answer: 'Hello' },
            { prompt: 'Choose the correct sentence.', options: ['I am learning.', 'Learning am I.', 'Am I learning.'], answer: 'I am learning.' },
            { prompt: 'What do you say when you meet someone?', options: ['Nice to meet you', 'Good night forever', 'See you yesterday'], answer: 'Nice to meet you' },
        ],
    },
    hi: { title: 'रोज़मर्रा की बातचीत', questions: [{ prompt: '“नमस्ते” का अर्थ क्या है?', options: ['Hello', 'Thank you', 'Goodbye'], answer: 'Hello' }, { prompt: 'सही वाक्य चुनें।', options: ['मैं सीख रहा हूँ।', 'सीख रहा मैं।', 'हूँ मैं सीख।'], answer: 'मैं सीख रहा हूँ।' }, { prompt: 'धन्यवाद का अर्थ क्या है?', options: ['Thank you', 'Good morning', 'Welcome'], answer: 'Thank you' }] },
    kn: { title: 'ದೈನಂದಿನ ಸಂಭಾಷಣೆ', questions: [{ prompt: '“ನಮಸ್ಕಾರ” ಎಂದರೆ ಏನು?', options: ['Hello', 'Thank you', 'Goodbye'], answer: 'Hello' }, { prompt: 'ಸರಿಯಾದ ವಾಕ್ಯವನ್ನು ಆರಿಸಿ.', options: ['ನಾನು ಕಲಿಯುತ್ತಿದ್ದೇನೆ.', 'ಕಲಿಯುತ್ತಿದ್ದೇನೆ ನಾನು.', 'ನಾನು ಕಲಿಯುತ್ತೇನೆನಾ.'], answer: 'ನಾನು ಕಲಿಯುತ್ತಿದ್ದೇನೆ.' }, { prompt: 'ಧನ್ಯವಾದಗಳು ಎಂದರೆ ಏನು?', options: ['Thank you', 'Good morning', 'Welcome'], answer: 'Thank you' }] },
    ta: { title: 'அன்றாட உரையாடல்', questions: [{ prompt: '“வணக்கம்” என்றால் என்ன?', options: ['Hello', 'Thank you', 'Goodbye'], answer: 'Hello' }, { prompt: 'சரியான வாக்கியத்தைத் தேர்ந்தெடுக்கவும்.', options: ['நான் கற்றுக்கொள்கிறேன்.', 'கற்றுக்கொள்கிறேன் நான்.', 'நான் கற்றுக்கொள்.'], answer: 'நான் கற்றுக்கொள்கிறேன்.' }, { prompt: 'நன்றி என்றால் என்ன?', options: ['Thank you', 'Good morning', 'Welcome'], answer: 'Thank you' }] },
    te: { title: 'రోజువారీ సంభాషణ', questions: [{ prompt: '“నమస్కారం” అంటే ఏమిటి?', options: ['Hello', 'Thank you', 'Goodbye'], answer: 'Hello' }, { prompt: 'సరైన వాక్యాన్ని ఎంచుకోండి.', options: ['నేను నేర్చుకుంటున్నాను.', 'నేర్చుకుంటున్నాను నేను.', 'నేను నేర్చుకో.'], answer: 'నేను నేర్చుకుంటున్నాను.' }, { prompt: 'ధన్యవాదాలు అంటే ఏమిటి?', options: ['Thank you', 'Good morning', 'Welcome'], answer: 'Thank you' }] },
}

const stageTitles = {
    en: ['Learn words', 'Build sentences', 'Practice conversation'],
    hi: ['शब्द सीखें', 'वाक्य बनाएं', 'बातचीत का अभ्यास करें'],
    kn: ['ಪದಗಳನ್ನು ಕಲಿಯಿರಿ', 'ವಾಕ್ಯಗಳನ್ನು ರಚಿಸಿ', 'ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ ಮಾಡಿ'],
    ta: ['சொற்களைக் கற்போம்', 'வாக்கியங்களை உருவாக்குவோம்', 'உரையாடலைப் பயிற்சி செய்வோம்'],
    te: ['పదాలు నేర్చుకోండి', 'వాక్యాలు నిర్మించండి', 'సంభాషణ సాధన చేయండి'],
}

const stageQuestions = [
    [
        { prompt: 'Which word means a friendly greeting?', options: ['Hello', 'Water', 'Book'], answer: 'Hello' },
        { type: 'write', prompt: 'Type the English word for a drink.', options: [], answer: 'Water' },
        { prompt: 'Which word is an object you can read?', options: ['Book', 'Happy', 'Walk'], answer: 'Book' },
    ],
    [
        { type: 'arrange', prompt: 'Arrange the words into a correct sentence.', options: ['am', 'I', 'learning'], answer: 'I am learning.' },
        { prompt: 'Complete: She ___ English every day.', options: ['learns', 'learning she', 'learn'], answer: 'learns' },
        { type: 'write', prompt: 'Type the sentence: We eat breakfast.', options: [], answer: 'We eat breakfast.' },
    ],
    [
        { prompt: 'What do you say when you meet someone?', options: ['Nice to meet you', 'Good night forever', 'See you yesterday'], answer: 'Nice to meet you' },
        { type: 'write', prompt: 'Type a polite reply to “Thank you”.', options: [], answer: 'You are welcome' },
        { prompt: 'How do you ask about someone’s day?', options: ['How was your day?', 'Where is your day?', 'Day you are?'], answer: 'How was your day?' },
    ],
]

const localizedStageQuestions = {
    hi: [
        [
            { prompt: 'दोस्ताना अभिवादन के लिए कौन-सा शब्द सही है?', options: ['नमस्ते', 'पानी', 'किताब'], answer: 'नमस्ते' },
            { type: 'write', prompt: 'पेय के लिए हिंदी शब्द लिखें।', options: [], answer: 'पानी' },
            { prompt: 'कौन-सी चीज़ पढ़ी जा सकती है?', options: ['किताब', 'खुश', 'चलना'], answer: 'किताब' },
        ],
        [
            { type: 'arrange', prompt: 'शब्दों को सही वाक्य में लगाएँ।', options: ['मैं', 'सीख', 'रहा', 'हूँ'], answer: 'मैं सीख रहा हूँ' },
            { prompt: 'सही वाक्य चुनें।', options: ['वह हर दिन सीखती है।', 'हर दिन वह सीखती।', 'सीखती हर दिन वह है।'], answer: 'वह हर दिन सीखती है।' },
            { type: 'write', prompt: 'यह वाक्य लिखें: हम नाश्ता करते हैं।', options: [], answer: 'हम नाश्ता करते हैं।' },
        ],
        [
            { prompt: 'किसी से पहली बार मिलने पर क्या कहेंगे?', options: ['आपसे मिलकर खुशी हुई', 'कल फिर मिलेंगे', 'शुभ रात्रि हमेशा'], answer: 'आपसे मिलकर खुशी हुई' },
            { type: 'write', prompt: '“धन्यवाद” का विनम्र उत्तर लिखें।', options: [], answer: 'आपका स्वागत है' },
            { prompt: 'किसी के दिन के बारे में कैसे पूछेंगे?', options: ['आपका दिन कैसा रहा?', 'आपका दिन कहाँ है?', 'दिन आप हैं?'], answer: 'आपका दिन कैसा रहा?' },
        ],
    ],
    kn: [
        [
            { prompt: 'ಸ್ನೇಹಪೂರ್ವಕ ಶುಭಾಶಯಕ್ಕೆ ಯಾವ ಪದ ಸರಿಯಾಗಿದೆ?', options: ['ನಮಸ್ಕಾರ', 'ನೀರು', 'ಪುಸ್ತಕ'], answer: 'ನಮಸ್ಕಾರ' },
            { type: 'write', prompt: 'ಪಾನೀಯಕ್ಕೆ ಕನ್ನಡ ಪದವನ್ನು ಬರೆಯಿರಿ.', options: [], answer: 'ನೀರು' },
            { prompt: 'ಓದಬಹುದಾದ ವಸ್ತು ಯಾವುದು?', options: ['ಪುಸ್ತಕ', 'ಸಂತೋಷ', 'ನಡೆಯಿರಿ'], answer: 'ಪುಸ್ತಕ' },
        ],
        [
            { type: 'arrange', prompt: 'ಪದಗಳನ್ನು ಸರಿಯಾದ ವಾಕ್ಯದಲ್ಲಿ ಜೋಡಿಸಿ.', options: ['ನಾನು', 'ಕಲಿಯುತ್ತಿದ್ದೇನೆ'], answer: 'ನಾನು ಕಲಿಯುತ್ತಿದ್ದೇನೆ' },
            { prompt: 'ಸರಿಯಾದ ವಾಕ್ಯವನ್ನು ಆರಿಸಿ.', options: ['ಅವಳು ಪ್ರತಿದಿನ ಕಲಿಯುತ್ತಾಳೆ.', 'ಪ್ರತಿದಿನ ಅವಳು ಕಲಿಯುತ್ತಾಳೆ.', 'ಕಲಿಯುತ್ತಾಳೆ ಅವಳು ಪ್ರತಿದಿನ.'], answer: 'ಅವಳು ಪ್ರತಿದಿನ ಕಲಿಯುತ್ತಾಳೆ.' },
            { type: 'write', prompt: 'ಈ ವಾಕ್ಯವನ್ನು ಬರೆಯಿರಿ: ನಾವು ಉಪಾಹಾರ ತಿನ್ನುತ್ತೇವೆ.', options: [], answer: 'ನಾವು ಉಪಾಹಾರ ತಿನ್ನುತ್ತೇವೆ.' },
        ],
        [
            { prompt: 'ಮೊದಲ ಬಾರಿ ಭೇಟಿಯಾದಾಗ ಏನು ಹೇಳುತ್ತೀರಿ?', options: ['ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿ ಸಂತೋಷವಾಯಿತು', 'ನಾಳೆ ಮತ್ತೆ ಸಿಗೋಣ', 'ಶುಭ ರಾತ್ರಿ ಎಂದೆಂದಿಗೂ'], answer: 'ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿ ಸಂತೋಷವಾಯಿತು' },
            { type: 'write', prompt: '“ಧನ್ಯವಾದಗಳು” ಎಂಬುದಕ್ಕೆ ವಿನಯಪೂರ್ವಕ ಉತ್ತರ ಬರೆಯಿರಿ.', options: [], answer: 'ಸ್ವಾಗತ' },
            { prompt: 'ಯಾರಾದರೂ ದಿನದ ಬಗ್ಗೆ ಹೇಗೆ ಕೇಳುತ್ತೀರಿ?', options: ['ನಿಮ್ಮ ದಿನ ಹೇಗಿತ್ತು?', 'ನಿಮ್ಮ ದಿನ ಎಲ್ಲಿದೆ?', 'ದಿನ ನೀವು ಆಗಿದ್ದೀರಾ?'], answer: 'ನಿಮ್ಮ ದಿನ ಹೇಗಿತ್ತು?' },
        ],
    ],
    ta: [
        [
            { prompt: 'நட்பான வாழ்த்துக்கு சரியான சொல் எது?', options: ['வணக்கம்', 'தண்ணீர்', 'புத்தகம்'], answer: 'வணக்கம்' },
            { type: 'write', prompt: 'ஒரு பானத்திற்கான தமிழ் சொல்லை எழுதுங்கள்.', options: [], answer: 'தண்ணீர்' },
            { prompt: 'படிக்கக்கூடிய பொருள் எது?', options: ['புத்தகம்', 'மகிழ்ச்சி', 'நடக்கவும்'], answer: 'புத்தகம்' },
        ],
        [
            { type: 'arrange', prompt: 'சொற்களை சரியான வாக்கியமாக அமைக்கவும்.', options: ['நான்', 'கற்றுக்கொள்கிறேன்'], answer: 'நான் கற்றுக்கொள்கிறேன்' },
            { prompt: 'சரியான வாக்கியத்தைத் தேர்ந்தெடுக்கவும்.', options: ['அவள் தினமும் கற்றுக்கொள்கிறாள்.', 'தினமும் அவள் கற்றுக்கொள்.', 'கற்றுக்கொள்கிறாள் தினமும் அவள்.'], answer: 'அவள் தினமும் கற்றுக்கொள்கிறாள்.' },
            { type: 'write', prompt: 'இந்த வாக்கியத்தை எழுதுங்கள்: நாங்கள் காலை உணவு சாப்பிடுகிறோம்.', options: [], answer: 'நாங்கள் காலை உணவு சாப்பிடுகிறோம்.' },
        ],
        [
            { prompt: 'ஒருவரை முதன்முதலில் சந்திக்கும்போது என்ன சொல்வீர்கள்?', options: ['உங்களை சந்தித்ததில் மகிழ்ச்சி', 'நேற்று சந்திப்போம்', 'என்றும் இரவு வணக்கம்'], answer: 'உங்களை சந்தித்ததில் மகிழ்ச்சி' },
            { type: 'write', prompt: '“நன்றி” என்பதற்கு மரியாதையான பதிலை எழுதுங்கள்.', options: [], answer: 'பரவாயில்லை' },
            { prompt: 'ஒருவரின் நாளைப் பற்றி எப்படி கேட்பீர்கள்?', options: ['உங்கள் நாள் எப்படி இருந்தது?', 'உங்கள் நாள் எங்கே?', 'நாள் நீங்கள்?'], answer: 'உங்கள் நாள் எப்படி இருந்தது?' },
        ],
    ],
    te: [
        [
            { prompt: 'స్నేహపూర్వక అభివాదానికి సరైన పదం ఏది?', options: ['నమస్కారం', 'నీరు', 'పుస్తకం'], answer: 'నమస్కారం' },
            { type: 'write', prompt: 'పానీయానికి తెలుగు పదాన్ని రాయండి.', options: [], answer: 'నీరు' },
            { prompt: 'చదవగలిగే వస్తువు ఏది?', options: ['పుస్తకం', 'సంతోషం', 'నడవండి'], answer: 'పుస్తకం' },
        ],
        [
            { type: 'arrange', prompt: 'పదాలను సరైన వాక్యంగా అమర్చండి.', options: ['నేను', 'నేర్చుకుంటున్నాను'], answer: 'నేను నేర్చుకుంటున్నాను' },
            { prompt: 'సరైన వాక్యాన్ని ఎంచుకోండి.', options: ['ఆమె ప్రతిరోజూ నేర్చుకుంటుంది.', 'ప్రతిరోజూ ఆమె నేర్చుకుంటుంది.', 'నేర్చుకుంటుంది ప్రతిరోజూ ఆమె.'], answer: 'ఆమె ప్రతిరోజూ నేర్చుకుంటుంది.' },
            { type: 'write', prompt: 'ఈ వాక్యాన్ని రాయండి: మేము అల్పాహారం తింటాము.', options: [], answer: 'మేము అల్పాహారం తింటాము.' },
        ],
        [
            { prompt: 'ఎవరినైనా మొదటిసారి కలిసినప్పుడు ఏమి చెబుతారు?', options: ['మిమ్మల్ని కలవడం ఆనందంగా ఉంది', 'నిన్న కలుద్దాం', 'ఎప్పటికీ శుభ రాత్రి'], answer: 'మిమ్మల్ని కలవడం ఆనందంగా ఉంది' },
            { type: 'write', prompt: '“ధన్యవాదాలు”కు మర్యాదపూర్వక సమాధానం రాయండి.', options: [], answer: 'పర్వాలేదు' },
            { prompt: 'ఎవరైనా రోజు గురించి ఎలా అడుగుతారు?', options: ['మీ రోజు ఎలా గడిచింది?', 'మీ రోజు ఎక్కడ ఉంది?', 'రోజు మీరు?'], answer: 'మీ రోజు ఎలా గడిచింది?' },
        ],
    ],
}

const englishQuestionHints = {
    hi: [
        [
            ['Which word is a friendly greeting?', ['Hello', 'Water', 'Book']],
            ['Write the Hindi word for a drink.', []],
            ['Which thing can be read?', ['Book', 'Happy', 'Walk']],
        ],
        [
            ['Arrange the words into a correct sentence.', ['I', 'learn', 'am', ''],],
            ['Choose the correct sentence.', ['She learns every day.', 'Every day she learns.', 'She learns every day.']],
            ['Write this sentence: We eat breakfast.', []],
        ],
        [
            ['What do you say when meeting someone for the first time?', ['Nice to meet you', 'See you tomorrow', 'Good night forever']],
            ['Write a polite reply to “Thank you”.', []],
            ['How do you ask about someone’s day?', ['How was your day?', 'Where is your day?', 'Are you a day?']],
        ],
    ],
    kn: [
        [['Which word is a friendly greeting?', ['Hello', 'Water', 'Book']], ['Write the Kannada word for a drink.', []], ['Which thing can be read?', ['Book', 'Happy', 'Walk']]],
        [['Arrange the words into a correct sentence.', ['I', 'am learning']], ['Choose the correct sentence.', ['She learns every day.', 'Every day she learns.', 'She learns every day.']], ['Write this sentence: We eat breakfast.', []]],
        [['What do you say when meeting someone for the first time?', ['Nice to meet you', 'See you tomorrow', 'Good night forever']], ['Write a polite reply to “Thank you”.', []], ['How do you ask about someone’s day?', ['How was your day?', 'Where is your day?', 'Are you a day?']]],
    ],
    ta: [
        [['Which word is a friendly greeting?', ['Hello', 'Water', 'Book']], ['Write the Tamil word for a drink.', []], ['Which thing can be read?', ['Book', 'Happy', 'Walk']]],
        [['Arrange the words into a correct sentence.', ['I', 'am learning']], ['Choose the correct sentence.', ['She learns every day.', 'Every day she learns.', 'She learns every day.']], ['Write this sentence: We eat breakfast.', []]],
        [['What do you say when meeting someone for the first time?', ['Nice to meet you', 'See you tomorrow', 'Good night forever']], ['Write a polite reply to “Thank you”.', []], ['How do you ask about someone’s day?', ['How was your day?', 'Where is your day?', 'Are you a day?']]],
    ],
    te: [
        [['Which word is a friendly greeting?', ['Hello', 'Water', 'Book']], ['Write the Telugu word for a drink.', []], ['Which thing can be read?', ['Book', 'Happy', 'Walk']]],
        [['Arrange the words into a correct sentence.', ['I', 'am learning']], ['Choose the correct sentence.', ['She learns every day.', 'Every day she learns.', 'She learns every day.']], ['Write this sentence: We eat breakfast.', []]],
        [['What do you say when meeting someone for the first time?', ['Nice to meet you', 'See you tomorrow', 'Good night forever']], ['Write a polite reply to “Thank you”.', []], ['How do you ask about someone’s day?', ['How was your day?', 'Where is your day?', 'Are you a day?']]],
    ],
}

export default function UnitLessonPage() {
    const { unit = '1' } = useParams()
    const [searchParams] = useSearchParams()
    const lessonStep = Math.min(2, Math.max(0, Number(searchParams.get('step') || 0)))
    const [languageCode, setLanguageCode] = useState('en')
    const [languageName, setLanguageName] = useState('English')
    const [questionIndex, setQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [textAnswer, setTextAnswer] = useState('')
    const [selectedTokens, setSelectedTokens] = useState([])
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)
    const [blocked, setBlocked] = useState(false)

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const [profile, languages] = await Promise.all([learningApi.getProfile(), learningApi.getLanguages()])
                const code = lessonContent[profile.learning_language] ? profile.learning_language : 'en'
                setLanguageCode(code)
                setLanguageName(languages.find((language) => language.code === code)?.name || 'English')
                if (Number(unit) > 1) {
                    const savedProgress = JSON.parse(localStorage.getItem('neolit_completed_path_lessons') || '{}')
                    const previousUnit = savedProgress[`${code}-${Number(unit) - 1}`] || []
                    setBlocked(previousUnit.length < 3)
                }
            } catch {
                setLanguageCode('en')
            }
        }
        loadProfile()
    }, [])

    const baseContent = lessonContent[languageCode]
    const content = {
        ...baseContent,
        title: stageTitles[languageCode]?.[lessonStep] || stageTitles.en[lessonStep],
        questions: localizedStageQuestions[languageCode]?.[lessonStep] || stageQuestions[lessonStep],
    }
    const question = content.questions[questionIndex]
    const englishHint = englishQuestionHints[languageCode]?.[lessonStep]?.[questionIndex]
    const chooseAnswer = (answer) => {
        if (selectedAnswer) return
        setSelectedAnswer(answer)
        if (answer === question.answer) setScore((current) => current + 1)
    }

    const submitAnswer = () => {
        if (selectedAnswer) return
        const answer = question.type === 'write' ? textAnswer.trim() : selectedTokens.join(' ')
        if (!answer) return
        chooseAnswer(answer)
    }

    const nextQuestion = () => {
        if (questionIndex === content.questions.length - 1) {
            const progressKey = `${languageCode}-${unit}`
            const savedProgress = JSON.parse(localStorage.getItem('neolit_completed_path_lessons') || '{}')
            const completed = savedProgress[progressKey] || []
            if (!completed.includes(lessonStep)) {
                savedProgress[progressKey] = [...completed, lessonStep]
                localStorage.setItem('neolit_completed_path_lessons', JSON.stringify(savedProgress))
            }
            setFinished(true)
            return
        }
        setQuestionIndex((current) => current + 1)
        setSelectedAnswer(null)
        setTextAnswer('')
        setSelectedTokens([])
    }

    return (
        <div className="unit-lesson-page">
            <header className="unit-lesson-header">
                <Link to="/dashboard" className="unit-lesson-close" aria-label="Exit lesson">×</Link>
                <div className="unit-lesson-progress"><i style={{ width: `${((questionIndex + (selectedAnswer ? 1 : 0)) / content.questions.length) * 100}%` }} /></div>
                <span className="unit-lesson-hearts">♥ 5</span>
            </header>

            <main className="unit-lesson-main">
                {blocked ? (
                    <section className="unit-complete-card">
                        <div className="unit-complete-icon">🔒</div>
                        <div className="unit-lesson-meta">UNIT {unit} LOCKED</div>
                        <h1>Finish the previous unit first</h1>
                        <p>Complete all three lessons in Unit {Number(unit) - 1} to unlock this unit.</p>
                        <Link to="/dashboard" className="unit-next-button">BACK TO LEARN</Link>
                    </section>
                ) : !finished ? (
                    <>
                        <div className="unit-lesson-meta">SECTION 1 • UNIT {unit} • {['LEARN WORDS', 'BUILD SENTENCES', 'PRACTICE CONVERSATION'][lessonStep]} • {languageName.toUpperCase()}</div>
                        <h1>{content.title}</h1>
                        <p className="unit-lesson-question-count">Question {questionIndex + 1} of {content.questions.length}</p>
                        <section className="unit-question-card">
                            <h2>{question.prompt}</h2>
                            {englishHint && <p className="question-english-help">English: {englishHint[0]}</p>}
                            {question.type === 'write' ? (
                                <div className="unit-write-answer">
                                    <input value={textAnswer} onChange={(event) => setTextAnswer(event.target.value)} placeholder="Type your answer" disabled={Boolean(selectedAnswer)} onKeyDown={(event) => { if (event.key === 'Enter') submitAnswer() }} />
                                    <button type="button" onClick={submitAnswer} disabled={!textAnswer.trim() || Boolean(selectedAnswer)}>CHECK</button>
                                </div>
                            ) : question.type === 'arrange' ? (
                                <div className="unit-arrange-answer">
                                    <div className="unit-selected-tokens">{selectedTokens.length ? selectedTokens.join(' ') : 'Select the words below'}</div>
                                    <div className="unit-token-list">
                                        {question.options.map((option) => (
                                            <button key={option} type="button" disabled={selectedTokens.includes(option) || Boolean(selectedAnswer)} onClick={() => setSelectedTokens((tokens) => [...tokens, option])}>{option}</button>
                                        ))}
                                    </div>
                                    <button type="button" className="unit-check-arrangement" onClick={submitAnswer} disabled={!selectedTokens.length || Boolean(selectedAnswer)}>CHECK ORDER</button>
                                </div>
                            ) : (
                                <div className="unit-answer-list">
                                    {question.options.map((option, optionIndex) => (
                                        <button key={option} type="button" className={selectedAnswer === option ? (option === question.answer ? 'correct' : 'wrong') : ''} onClick={() => chooseAnswer(option)}>{option}{englishHint?.[1]?.[optionIndex] && <small className="option-english-help">{englishHint[1][optionIndex]}</small>}</button>
                                    ))}
                                </div>
                            )}
                            {selectedAnswer && <p className={selectedAnswer === question.answer ? 'unit-answer-feedback correct' : 'unit-answer-feedback wrong'}>{selectedAnswer === question.answer ? 'Correct! +10 XP' : `The answer is: ${question.answer}`}</p>}
                        </section>
                        <button type="button" className="unit-next-button" disabled={!selectedAnswer} onClick={nextQuestion}>{questionIndex === content.questions.length - 1 ? 'FINISH LESSON' : 'CONTINUE'}</button>
                    </>
                ) : (
                    <section className="unit-complete-card">
                        <div className="unit-complete-icon">✓</div>
                        <div className="unit-lesson-meta">UNIT {unit} COMPLETE</div>
                        <h1>Great work!</h1>
                        <p>You scored {score} out of {content.questions.length} in {languageName}.</p>
                        <div className="unit-complete-stats"><strong>+{score * 10} XP</strong><span>♥ 5 hearts left</span></div>
                        {lessonStep < 2 ? <Link to={`/lesson/${unit}?step=${lessonStep + 1}`} className="unit-next-button">NEXT LESSON</Link> : <Link to="/dashboard" className="unit-next-button">BACK TO LEARN</Link>}
                    </section>
                )}
            </main>
        </div>
    )
}
