import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { learningApi } from '../services/learningApi'

const skills = ['reading', 'writing', 'comprehension']
const supportedLanguageCodes = ['en', 'hi', 'kn', 'ta', 'te']
const nativeLanguageCodes = {
    English: 'en',
    Hindi: 'hi',
    Kannada: 'kn',
    Tamil: 'ta',
    Telugu: 'te',
}

const dashboardUiCopy = {
    en: { learn: 'Learn', letters: 'Letters', leaderboard: 'Leaderboard', quests: 'Quests', shop: 'Shop', profile: 'Profile', more: 'More', logout: 'Logout', myCourse: 'MY COURSE', myCourses: 'MY COURSES', native: 'NATIVE', learning: 'LEARNING', section: 'SECTION', unit: 'UNIT', complete: 'COMPLETE', completed: 'Completed', startHere: 'Start here', previousLesson: 'Complete the previous lesson', viewAll: 'VIEW ALL', unlockLeaderboards: 'Unlock Leaderboards!', readyToCompete: 'You are ready to compete!', competePrompt: 'Complete {count} more lessons to start competing', dailyQuests: 'Daily Quests', earnXp: 'Earn 10 XP', reviewUnit: 'REVIEW UNIT', goToUnit: 'GO TO UNIT', unitSummary: 'Unit {unit} • 3 lessons • +10 XP each' },
    hi: { learn: 'सीखें', letters: 'अक्षर', leaderboard: 'लीडरबोर्ड', quests: 'अभियान', shop: 'दुकान', profile: 'प्रोफ़ाइल', more: 'और', logout: 'लॉग आउट', myCourse: 'मेरा कोर्स', myCourses: 'मेरे कोर्स', native: 'मातृभाषा', learning: 'सीखने की भाषा', section: 'खंड', unit: 'यूनिट', complete: 'पूर्ण', completed: 'पूरा हुआ', startHere: 'यहाँ शुरू करें', previousLesson: 'पिछला पाठ पूरा करें', viewAll: 'सभी देखें', unlockLeaderboards: 'लीडरबोर्ड अनलॉक करें!', readyToCompete: 'आप प्रतिस्पर्धा के लिए तैयार हैं!', competePrompt: 'प्रतिस्पर्धा शुरू करने के लिए {count} और पाठ पूरे करें', dailyQuests: 'दैनिक मिशन', earnXp: '10 XP कमाएँ', reviewUnit: 'यूनिट रिव्यू', goToUnit: 'यूनिट पर जाएँ', unitSummary: 'यूनिट {unit} • 3 पाठ • प्रत्येक +10 XP' },
    kn: { learn: 'ಕಲಿಯಿರಿ', letters: 'ಅಕ್ಷರಗಳು', leaderboard: 'ಮುನ್ನಡೆ ಪಟ್ಟಿ', quests: 'ಗುರಿಗಳು', shop: 'ಅಂಗಡಿ', profile: 'ಪ್ರೊಫೈಲ್', more: 'ಇನ್ನಷ್ಟು', logout: 'ಲಾಗ್ ಔಟ್', myCourse: 'ನನ್ನ ಕೋರ್ಸ್', myCourses: 'ನನ್ನ ಕೋರ್ಸ್‌ಗಳು', native: 'ಮಾತೃಭಾಷೆ', learning: 'ಕಲಿಯುವ ಭಾಷೆ', section: 'ವಿಭಾಗ', unit: 'ಯುನಿಟ್', complete: 'ಪೂರ್ಣ', completed: 'ಪೂರ್ಣವಾಗಿದೆ', startHere: 'ಇಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿ', previousLesson: 'ಮುನ್ಸೂಚನೆ ಪಾಠವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ', viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ', unlockLeaderboards: 'ಲೀಡರ್‌ಬೋರ್ಡ್ ಅನ್ಲಾಕ್ ಮಾಡಿ!', readyToCompete: 'ನೀವು ಸ್ಪರ್ಧೆಗೆ ಸಿದ್ಧರಾಗಿದ್ದೀರಿ!', competePrompt: 'ಸ್ಪರ್ಧೆಯನ್ನು शुरू ಮಾಡಲು {count} ಇನ್ನಷ್ಟು ಪಾಠಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ', dailyQuests: 'ದೈನಂದಿನ ಗುರಿಗಳು', earnXp: '10 XP ಗಳಿಸಿ', reviewUnit: 'ಯುನಿಟ್ ಅನ್ನು ರಿವ್ಯೂ ಮಾಡಿ', goToUnit: 'ಯುನಿಟ್‌ಗೆ ಹೋಗಿ', unitSummary: 'ಯುನಿಟ್ {unit} • 3 ಪಾಠಗಳು • ಪ್ರತಿ +10 XP' },
    ta: { learn: 'கற்க', letters: 'எழுத்துகள்', leaderboard: 'முன்னணி பட்டியல்', quests: 'சவால்கள்', shop: 'கடை', profile: 'சுயவிவரம்', more: 'மேலும்', logout: 'வெளியேறு', myCourse: 'என் பாடநெறி', myCourses: 'என் பாடநெறிகள்', native: 'தாய்மொழி', learning: 'கற்கும் மொழி', section: 'பிரிவு', unit: 'அலகு', complete: 'முடிந்தது', completed: 'முடிந்தது', startHere: 'இங்கே தொடங்குங்கள்', previousLesson: 'முந்தைய பாடத்தை முடிக்கவும்', viewAll: 'அனைத்தையும் காண்க', unlockLeaderboards: 'முன்னணி பட்டியலைத் திறக்கவும்!', readyToCompete: 'நீங்கள் போட்டிக்கு தயார்!', competePrompt: 'போட்டியைத் தொடங்க {count} மேலும் பாடங்களை முடிக்கவும்', dailyQuests: 'அன்றாட சவால்கள்', earnXp: '10 XP பெறுங்கள்', reviewUnit: 'அலகை மறுஆய்வு செய்யுங்கள்', goToUnit: 'அலகுக்குச் செல்லுங்கள்', unitSummary: 'அலகு {unit} • 3 பாடங்கள் • ஒவ்வொன்றும் +10 XP' },
    te: { learn: 'నేర్చుకోండి', letters: 'అక్షరాలు', leaderboard: 'లీడర్‌బోర్డ్', quests: 'లక్ష్యాలు', shop: 'దుకాణం', profile: 'ప్రొఫైల్', more: 'మరిన్ని', logout: 'లాగ్ అవుట్', myCourse: 'నా కోర్సు', myCourses: 'నా కోర్సులు', native: 'మాతృభాష', learning: 'నేర్చుకునే భాష', section: 'విభాగం', unit: 'యూనిట్', complete: 'పూర్తి', completed: 'పూర్తయింది', startHere: 'ఇక్కడ ప్రారంభించండి', previousLesson: 'మునుపటి పాఠాన్ని పూర్తి చేయండి', viewAll: 'అన్ని చూడండి', unlockLeaderboards: 'లీడర్‌బోర్డ్ Unlock చేయండి!', readyToCompete: 'మీరు పోటీకి సిద్ధంగా ఉన్నారు!', competePrompt: 'పోటీ ప్రారంభించడానికి {count} మరిన్ని పాఠాలు పూర్తి చేయండి', dailyQuests: 'రోజువారీ లక్ష్యాలు', earnXp: '10 XP సంపాదించండి', reviewUnit: 'యూనిట్‌ను రివ్యూ చేయండి', goToUnit: 'యూనిట్‌కి వెళ్లండి', unitSummary: 'యూనిట్ {unit} • 3 పాఠాలు • ప్రతి +10 XP' },
}
const dashboardPageCopy = {
    en: { welcome: 'Welcome back', ready: 'Ready to learn,', journey: 'YOUR LEARNING JOURNEY', heroFirst: 'Small steps.', heroSecond: 'Big progress.', heroDescription: 'Continue learning and build your language skills every day.', continue: 'Continue learning', yourPath: 'YOUR PATH', lessonsCompleted: 'lessons completed', assessment: 'UNIT ASSESSMENT', test: 'Test your knowledge', assessmentDescription: 'Try a fresh set of questions about what you have learned.', questions: 'questions', minutes: 'min', upTo: 'Up to', startAssessment: 'Start assessment', streak: 'Streak', todayQuest: "Today's quest", completeLessons: 'Complete {count} lessons', progress: 'Your progress', totalXp: 'Total XP', hearts: 'Hearts', otherLessons: 'Other lessons', exit: 'Exit', question: 'Question', of: 'of', next: 'Continue', submit: 'Submit assessment', typeAnswer: 'Type your answer', complete: 'Assessment complete!', score: 'Score', xpEarned: 'XP earned', done: 'Done', noAssessment: 'No assessment is available for this course yet.' },
    hi: { welcome: 'वापसी पर स्वागत है', ready: 'सीखने के लिए तैयार,', journey: 'आपकी सीखने की यात्रा', heroFirst: 'छोटे कदम।', heroSecond: 'बड़ी प्रगति।', heroDescription: 'सीखना जारी रखें और हर दिन अपनी भाषा का कौशल बढ़ाएँ।', continue: 'सीखना जारी रखें', yourPath: 'आपका सीखने का रास्ता', lessonsCompleted: 'पाठ पूरे', assessment: 'यूनिट मूल्यांकन', test: 'अपनी जानकारी जाँचें', assessmentDescription: 'सीखी हुई बातों पर नए प्रश्न हल करें।', questions: 'प्रश्न', minutes: 'मिनट', upTo: 'तक', startAssessment: 'मूल्यांकन शुरू करें', streak: 'लगातार दिन', todayQuest: 'आज का लक्ष्य', completeLessons: '{count} पाठ पूरे करें', progress: 'आपकी प्रगति', totalXp: 'कुल XP', hearts: 'दिल', otherLessons: 'अन्य पाठ', exit: 'बाहर जाएँ', question: 'प्रश्न', of: 'में से', next: 'आगे बढ़ें', submit: 'मूल्यांकन जमा करें', typeAnswer: 'अपना उत्तर लिखें', complete: 'मूल्यांकन पूरा हुआ!', score: 'अंक', xpEarned: 'XP अर्जित', done: 'हो गया', noAssessment: 'इस कोर्स के लिए अभी कोई मूल्यांकन उपलब्ध नहीं है।' },
    kn: { welcome: 'ಮರಳಿ ಸ್ವಾಗತ', ready: 'ಕಲಿಯಲು ಸಿದ್ಧರಿದ್ದೀರಾ,', journey: 'ನಿಮ್ಮ ಕಲಿಕೆಯ ಪಯಣ', heroFirst: 'ಸಣ್ಣ ಹೆಜ್ಜೆಗಳು.', heroSecond: 'ದೊಡ್ಡ ಪ್ರಗತಿ.', heroDescription: 'ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ, ಪ್ರತಿದಿನ ನಿಮ್ಮ ಭಾಷಾ ಕೌಶಲ್ಯ ಬೆಳೆಸಿಕೊಳ್ಳಿ.', continue: 'ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ', yourPath: 'ನಿಮ್ಮ ಕಲಿಕೆಯ ಹಾದಿ', lessonsCompleted: 'ಪಾಠಗಳು ಪೂರ್ಣ', assessment: 'ಯುನಿಟ್ ಮೌಲ್ಯಮಾಪನ', test: 'ನಿಮ್ಮ ಜ್ಞಾನ ಪರೀಕ್ಷಿಸಿ', assessmentDescription: 'ಕಲಿತ ವಿಷಯಗಳ ಕುರಿತು ಹೊಸ ಪ್ರಶ್ನೆಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ.', questions: 'ಪ್ರಶ್ನೆಗಳು', minutes: 'ನಿಮಿಷ', upTo: 'ವರೆಗೆ', startAssessment: 'ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ', streak: 'ಸತತ ದಿನಗಳು', todayQuest: 'ಇಂದಿನ ಗುರಿ', completeLessons: '{count} ಪಾಠಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ', progress: 'ನಿಮ್ಮ ಪ್ರಗತಿ', totalXp: 'ಒಟ್ಟು XP', hearts: 'ಹೃದಯಗಳು', otherLessons: 'ಇತರ ಪಾಠಗಳು', exit: 'ನಿರ್ಗಮಿಸಿ', question: 'ಪ್ರಶ್ನೆ', of: 'ರಲ್ಲಿ', next: 'ಮುಂದುವರಿಸಿ', submit: 'ಮೌಲ್ಯಮಾಪನ ಸಲ್ಲಿಸಿ', typeAnswer: 'ನಿಮ್ಮ ಉತ್ತರ ಬರೆಯಿರಿ', complete: 'ಮೌಲ್ಯಮಾಪನ ಪೂರ್ಣಗೊಂಡಿದೆ!', score: 'ಅಂಕ', xpEarned: 'ಗಳಿಸಿದ XP', done: 'ಆಯಿತು', noAssessment: 'ಈ ಕೋರ್ಸ್‌ಗೆ ಇನ್ನೂ ಮೌಲ್ಯಮಾಪನ ಲಭ್ಯವಿಲ್ಲ.' },
    ta: { welcome: 'மீண்டும் வரவேற்கிறோம்', ready: 'கற்கத் தயாரா,', journey: 'உங்கள் கற்றல் பயணம்', heroFirst: 'சிறிய படிகள்.', heroSecond: 'பெரிய முன்னேற்றம்.', heroDescription: 'தொடர்ந்து கற்று, தினமும் உங்கள் மொழித் திறனை வளர்த்துக் கொள்ளுங்கள்.', continue: 'கற்றலைத் தொடரவும்', yourPath: 'உங்கள் கற்றல் பாதை', lessonsCompleted: 'பாடங்கள் முடிந்தன', assessment: 'அலகு மதிப்பீடு', test: 'உங்கள் அறிவைச் சோதிக்கவும்', assessmentDescription: 'கற்றவற்றைப் பற்றிய புதிய கேள்விகளை முயற்சிக்கவும்.', questions: 'கேள்விகள்', minutes: 'நிமிடம்', upTo: 'வரை', startAssessment: 'மதிப்பீட்டைத் தொடங்கு', streak: 'தொடர் நாட்கள்', todayQuest: 'இன்றைய இலக்கு', completeLessons: '{count} பாடங்களை முடிக்கவும்', progress: 'உங்கள் முன்னேற்றம்', totalXp: 'மொத்த XP', hearts: 'இதயங்கள்', otherLessons: 'பிற பாடங்கள்', exit: 'வெளியேறு', question: 'கேள்வி', of: 'இல்', next: 'தொடரவும்', submit: 'மதிப்பீட்டைச் சமர்ப்பிக்கவும்', typeAnswer: 'உங்கள் பதிலை எழுதுங்கள்', complete: 'மதிப்பீடு முடிந்தது!', score: 'மதிப்பெண்', xpEarned: 'பெற்ற XP', done: 'முடிந்தது', noAssessment: 'இந்தப் பாடநெறிக்கு மதிப்பீடு இன்னும் கிடைக்கவில்லை.' },
    te: { welcome: 'తిరిగి స్వాగతం', ready: 'నేర్చుకోవడానికి సిద్ధమా,', journey: 'మీ అభ్యాస ప్రయాణం', heroFirst: 'చిన్న అడుగులు.', heroSecond: 'పెద్ద పురోగతి.', heroDescription: 'నేర్చుకుంటూ ఉండండి, ప్రతిరోజూ మీ భాషా నైపుణ్యాలను పెంచుకోండి.', continue: 'అభ్యాసాన్ని కొనసాగించండి', yourPath: 'మీ అభ్యాస మార్గం', lessonsCompleted: 'పాఠాలు పూర్తయ్యాయి', assessment: 'యూనిట్ మూల్యాంకనం', test: 'మీ జ్ఞానాన్ని పరీక్షించండి', assessmentDescription: 'మీరు నేర్చుకున్న విషయాలపై కొత్త ప్రశ్నలను ప్రయత్నించండి.', questions: 'ప్రశ్నలు', minutes: 'నిమిషాలు', upTo: 'వరకు', startAssessment: 'మూల్యాంకనం ప్రారంభించండి', streak: 'వరుస రోజులు', todayQuest: 'నేటి లక్ష్యం', completeLessons: '{count} పాఠాలు పూర్తి చేయండి', progress: 'మీ పురోగతి', totalXp: 'మొత్తం XP', hearts: 'హృదయాలు', otherLessons: 'ఇతర పాఠాలు', exit: 'నిష్క్రమించండి', question: 'ప్రశ్న', of: 'లో', next: 'కొనసాగించండి', submit: 'మూల్యాంకనాన్ని సమర్పించండి', typeAnswer: 'మీ సమాధానాన్ని రాయండి', complete: 'మూల్యాంకనం పూర్తయింది!', score: 'స్కోరు', xpEarned: 'సంపాదించిన XP', done: 'పూర్తయింది', noAssessment: 'ఈ కోర్సుకు ఇంకా మూల్యాంకనం అందుబాటులో లేదు.' },
}
const courseAssessmentTitles = { en: 'COURSE ASSESSMENT', hi: 'कोर्स मूल्यांकन', kn: 'ಕೋರ್ಸ್ ಮೌಲ್ಯಮಾಪನ', ta: 'பாடநெறி மதிப்பீடு', te: 'కోర్సు మూల్యాంకనం' }
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

const questCopy = {
    en: {
        title: 'Quests',
        subtitle: 'Small goals that turn practice into progress.',
        lessons: ['Complete 3 lessons', 'Keep your daily goal moving'],
        xp: ['Earn 30 XP', 'Build your weekly momentum'],
        streak: ['Practice your streak', (days) => `${days} days in a row`],
    },
    hi: {
        title: 'अभियान',
        subtitle: 'छोटे लक्ष्य अभ्यास को प्रगति में बदलते हैं।',
        lessons: ['3 पाठ पूरे करें', 'अपना दैनिक लक्ष्य पूरा करें'],
        xp: ['30 XP कमाएँ', 'साप्ताहिक प्रगति बनाएँ'],
        streak: ['अपनी स्ट्रीक का अभ्यास करें', (days) => `${days} दिन लगातार`],
    },
    kn: {
        title: 'ಗುರಿಗಳು',
        subtitle: 'ಸಣ್ಣ ಗುರಿಗಳು ಅಭ್ಯಾಸವನ್ನು ಪ್ರಗತಿಯಾಗಿ ಬದಲಿಸುತ್ತವೆ.',
        lessons: ['3 ಪಾಠಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ', 'ನಿಮ್ಮ ದೈನಂದಿನ ಗುರಿಯನ್ನು ಮುಂದುವರಿಸಿ'],
        xp: ['30 XP ಗಳಿಸಿ', 'ನಿಮ್ಮ ವಾರದ ಪ್ರಗತಿಯನ್ನು ಬೆಳೆಸಿ'],
        streak: ['ನಿಮ್ಮ ಸ್ಟ್ರೀಕ್ ಅಭ್ಯಾಸ ಮಾಡಿ', (days) => `${days} ದಿನಗಳು ಸತತವಾಗಿ`],
    },
    ta: {
        title: 'சவால்கள்',
        subtitle: 'சிறிய இலக்குகள் பயிற்சியை முன்னேற்றமாக மாற்றும்.',
        lessons: ['3 பாடங்களை முடிக்கவும்', 'உங்கள் தினசரி இலக்கை தொடரவும்'],
        xp: ['30 XP பெறுங்கள்', 'வாராந்திர முன்னேற்றத்தை உருவாக்குங்கள்'],
        streak: ['உங்கள் தொடர்ச்சியைப் பயிற்சி செய்யுங்கள்', (days) => `${days} நாட்கள் தொடர்ந்து`],
    },
    te: {
        title: 'లక్ష్యాలు',
        subtitle: 'చిన్న లక్ష్యాలు అభ్యాసాన్ని పురోగతిగా మారుస్తాయి.',
        lessons: ['3 పాఠాలను పూర్తి చేయండి', 'మీ రోజువారీ లక్ష్యాన్ని కొనసాగించండి'],
        xp: ['30 XP సంపాదించండి', 'వారపు పురోగతిని పెంచండి'],
        streak: ['మీ స్ట్రీక్‌ను సాధన చేయండి', (days) => `${days} రోజులు వరుసగా`],
    },
}

const leaderboardCopy = {
    en: { title: 'Leaderboards', subtitle: 'Compete with learners and keep your streak moving.', weekly: 'Weekly', monthly: 'Monthly', note: (period, language) => `Your ${period.toLowerCase()} ${language} group, updated from your lesson progress.` },
    hi: { title: 'लीडरबोर्ड', subtitle: 'अन्य शिक्षार्थियों के साथ प्रतिस्पर्धा करें और अपनी स्ट्रीक बनाए रखें।', weekly: 'साप्ताहिक', monthly: 'मासिक', note: (period, language) => `${language} का ${period.toLowerCase()} समूह, आपकी प्रगति के अनुसार अपडेट किया गया।` },
    kn: { title: 'ಮುನ್ನಡೆ ಪಟ್ಟಿ', subtitle: 'ಇತರ ಕಲಿಯುವವರೊಂದಿಗೆ ಸ್ಪರ್ಧಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಸ್ಟ್ರೀಕ್ ಮುಂದುವರಿಸಿ.', weekly: 'ವಾರದ', monthly: 'ಮಾಸಿಕ', note: (period, language) => `${language} ${period.toLowerCase()} ಗುಂಪು, ನಿಮ್ಮ ಪಾಠದ ಪ್ರಗತಿಯ ಆಧಾರದ ಮೇಲೆ ನವೀಕರಿಸಲಾಗಿದೆ.` },
    ta: { title: 'முன்னணி பட்டியல்', subtitle: 'கற்றவர்களுடன் போட்டியிட்டு உங்கள் தொடர்ச்சியைத் தொடருங்கள்.', weekly: 'வாராந்திர', monthly: 'மாதாந்திர', note: (period, language) => `${language} ${period.toLowerCase()} குழு, உங்கள் பாட முன்னேற்றத்தின் அடிப்படையில் புதுப்பிக்கப்பட்டது.` },
    te: { title: 'లీడర్‌బోర్డ్', subtitle: 'ఇతర అభ్యాసకులతో పోటీ పడి మీ స్ట్రీక్‌ను కొనసాగించండి.', weekly: 'వారపు', monthly: 'నెలవారీ', note: (period, language) => `${language} ${period.toLowerCase()} సమూహం, మీ పాఠాల పురోగతి ఆధారంగా నవీకరించబడింది.` },
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

const unitLessonLabelsByLanguage = {
    en: ['Reading', 'Word forms', 'Comprehension'],
    hi: ['पठन', 'शब्द रूप', 'बोध'],
    kn: ['ಓದುವುದು', 'ಪದ ರೂಪಗಳು', 'ಗ್ರಹಣ'],
    ta: ['வாசிப்பு', 'சொல் வடிவம்', 'புரிந்துகொள்ளல்'],
    te: ['చదవడం', 'పద రూపాలు', 'అర్థం'],
}
const unitLessonLabels = unitLessonLabelsByLanguage.en

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
    const { user, logout, setUser } = useAuth()
    const [languages, setLanguages] = useState([])
    const [levels, setLevels] = useState([])
    const [assessments, setAssessments] = useState([])
    const [profile, setProfile] = useState(null)
    const [progress, setProgress] = useState(null)
    const [learningState, setLearningState] = useState(null)
    const [leaderboardRows, setLeaderboardRows] = useState([])
    const [leaderboardPage, setLeaderboardPage] = useState(1)
    const [selected, setSelected] = useState(null)
    const [answers, setAnswers] = useState({})
    const [assessmentOpen, setAssessmentOpen] = useState(false)
    const [assessmentQuestionIndex, setAssessmentQuestionIndex] = useState(0)
    const [expandedModule, setExpandedModule] = useState(null)
    const [result, setResult] = useState(null)
    const [message, setMessage] = useState('')
    const [activeSkill, setActiveSkill] = useState('reading')
    const [selectedLesson, setSelectedLesson] = useState('reading')
    const [activeSection, setActiveSection] = useState('learn')
    const [searchParams] = useSearchParams()
    const [lettersStarted, setLettersStarted] = useState(false)
    const [letterProgress, setLetterProgress] = useState({})
    const [speakingLetter, setSpeakingLetter] = useState(null)
    const speechAudioRef = useRef(null)
    const speechObjectUrlRef = useRef(null)
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
    const [selectedLanguageCode, setSelectedLanguageCode] = useState(() => localStorage.getItem('neolit_selected_language') || user?.learning_language || 'en')

    useEffect(() => {
        const section = searchParams.get('section')
        if (section === 'progress') {
            setActiveSection('leaderboard')
        } else if (['learn', 'letters', 'leaderboard', 'quests'].includes(section)) {
            setActiveSection(section)
        }
    }, [searchParams])
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
                const leaderboard = await learningApi.getLeaderboard().catch(() => [])
                const supportedLanguages = dashboard.languages.filter((item) => supportedLanguageCodes.includes(item.code))
                setLanguages(supportedLanguages)
                setLevels(dashboard.levels)
                setProfile(dashboard.profile)
                setSelectedLanguageCode(localStorage.getItem('neolit_selected_language') || dashboard.profile?.learning_language || 'en')
                setProgress(dashboard.progress)
                setLearningState(dashboard.learning_state)
                setCompletedPathLessons((dashboard.learning_state.completions || []).reduce((groups, completion) => {
                    const key = `${completion.language_code}-${completion.unit_number}`
                    groups[key] = [...(groups[key] || []), completion.lesson_step]
                    return groups
                }, {}))
                setAssessments(dashboard.assessments)
                setLeaderboardRows(leaderboard)
                setLeaderboardPage(1)
            } catch (error) {
                setMessage(error.response?.data?.detail || 'Unable to load your learning space')
            }
        }
        load()
    }, [])

    useEffect(() => {
        const syncSelectedCourse = async () => {
            const storedCourse = localStorage.getItem('neolit_selected_language')
            if (!storedCourse || !supportedLanguageCodes.includes(storedCourse)) return

            setSelectedLanguageCode(storedCourse)
            setAssessmentOpen(false)
            setSelected(null)
            setAnswers({})

            try {
                const dashboard = await learningApi.getDashboardBootstrap()
                setProfile(dashboard.profile)
                setProgress(dashboard.progress)
                setLearningState(dashboard.learning_state)
                setAssessments(dashboard.assessments)
            } catch {
                setMessage('Unable to refresh the selected course')
            }
        }

        window.addEventListener('neolit-course-changed', syncSelectedCourse)
        return () => window.removeEventListener('neolit-course-changed', syncSelectedCourse)
    }, [])

    const visibleAssessments = useMemo(
        () => assessments.filter((assessment) => assessment.assessment_type === activeSkill),
        [assessments, activeSkill]
    )

    const selectedLanguageName = languages.find((item) => item.code === selectedLanguageCode)?.name || 'English'
    const nativeLanguageName = localStorage.getItem('neolit_native_language') || profile?.native_language || user?.native_language || 'English'
    const nativeLanguageCode = nativeLanguageCodes[nativeLanguageName] || 'en'
    const uiCopy = dashboardUiCopy[nativeLanguageCode] || dashboardUiCopy.en
    const pageCopy = dashboardPageCopy[nativeLanguageCode] || dashboardPageCopy.en
    const learnerName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || profile?.first_name || 'Learner'
    const activeStageCopy = lessonStageCopy[nativeLanguageCode]?.[selectedLesson] || lessonStageCopy.en[selectedLesson] || 'Talk about food'
    const selectedLessonTitle = lessonTitles[nativeLanguageCode] || lessonTitles.en
    const selectedUnits = courseUnits[nativeLanguageCode] || courseUnits.en
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
    const unitLessonLabels = unitLessonLabelsByLanguage[nativeLanguageCode] || unitLessonLabelsByLanguage.en
    const unitProgressPercent = unitLessonLabels.length
        ? Math.round((completedLessons.length / unitLessonLabels.length) * 100)
        : 0
    const letterItems = useMemo(
        () => [...selectedLetters.vowels, ...selectedLetters.consonants],
        [selectedLetters]
    )
    const practicedLetters = Object.keys(letterProgress).length
    const quizItem = letterItems[quizIndex % letterItems.length]
    const quizOptions = Array.from({ length: 5 }, (_, optionIndex) => letterItems[(quizIndex + optionIndex * 3) % letterItems.length])

    const levelName = (levelId) => levels.find((level) => level.id === levelId)?.name || 'Beginner'
    const mockupCopy = {
        en: { section: 'SECTION', unit: 'UNIT', guidebook: 'GUIDEBOOK', start: 'START' },
        hi: { section: 'खंड', unit: 'यूनिट', guidebook: 'गाइडबुक', start: 'शुरू' },
        kn: { section: 'ವಿಭಾಗ', unit: 'ಯುನಿಟ್', guidebook: 'ಗೈಡ್‌ಬುಕ್', start: 'ಪ್ರಾರಂಭ' },
        ta: { section: 'பிரிவு', unit: 'அலகு', guidebook: 'கையேடு', start: 'தொடங்கு' },
        te: { section: 'విభాగం', unit: 'యూనిట్', guidebook: 'గైడ్‌బుక్', start: 'ప్రారంభం' },
    }
    const exactMockupText = mockupCopy[nativeLanguageCode] || mockupCopy.en

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

    const selectAssessment = (assessment) => {
        setSelected(getAssessmentRound(assessment))
        setAnswers({})
        setResult(null)
        setAssessmentQuestionIndex(0)
        setAssessmentOpen(true)
    }

    const openUnitAssessment = () => {
        const assessment = visibleAssessments[0] || assessments[0]
        if (!assessment) {
            setMessage(pageCopy.noAssessment)
            return
        }
        selectAssessment(assessment)
    }

    const closeAssessment = () => {
        setAssessmentOpen(false)
        setSelected(null)
        setAnswers({})
        setResult(null)
        setAssessmentQuestionIndex(0)
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
            const refreshedLeaderboard = await learningApi.getLeaderboard().catch(() => null)
            setProgress(progressData)
            setLearningState(learningStateData)
            if (refreshedLeaderboard) setLeaderboardRows(refreshedLeaderboard)
            setMessage(harderAssessment ? 'Saved. Review your result before continuing.' : 'Assessment saved to your progress.')
        } catch (error) {
            const detail = error?.response?.data?.detail
            const message = Array.isArray(detail)
                ? detail.map((item) => item.msg || item).join(', ')
                : detail || 'Unable to submit assessment'
            setMessage(message)
        }
    }

    const speakLetter = async (letter, word) => {
        setLetterProgress((prev) => ({ ...prev, [letter]: true }))
        const localeByLanguage = {
            en: 'en-US',
            hi: 'hi-IN',
            kn: 'kn-IN',
            ta: 'ta-IN',
            te: 'te-IN',
        }
        const locale = localeByLanguage[selectedLanguageCode] || 'en-US'
        const phrase = `${letter}. ${word}.`

        if (window.speechSynthesis) window.speechSynthesis.cancel()
        if (speechAudioRef.current) {
            speechAudioRef.current.pause()
            speechAudioRef.current = null
        }
        if (speechObjectUrlRef.current) {
            URL.revokeObjectURL(speechObjectUrlRef.current)
            speechObjectUrlRef.current = null
        }

        const voices = window.speechSynthesis?.getVoices() || []
        const matchingVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith(selectedLanguageCode))

        if (matchingVoice || selectedLanguageCode === 'en') {
            if (!window.speechSynthesis) return
            const utterance = new SpeechSynthesisUtterance(phrase)
            utterance.lang = locale
            utterance.voice = matchingVoice || null
            utterance.rate = 0.78
            utterance.pitch = 1
            utterance.onstart = () => setSpeakingLetter(letter)
            utterance.onend = () => setSpeakingLetter(null)
            utterance.onerror = () => setSpeakingLetter(null)
            window.speechSynthesis.speak(utterance)
            return
        }

        try {
            const audioBlob = await learningApi.getSpeech(phrase, selectedLanguageCode)
            const objectUrl = URL.createObjectURL(audioBlob)
            speechObjectUrlRef.current = objectUrl
            const audio = new Audio(objectUrl)
            speechAudioRef.current = audio
            setSpeakingLetter(letter)
            audio.onended = () => {
                speechAudioRef.current = null
                URL.revokeObjectURL(objectUrl)
                speechObjectUrlRef.current = null
                setSpeakingLetter(null)
            }
            audio.onerror = () => {
                speechAudioRef.current = null
                URL.revokeObjectURL(objectUrl)
                speechObjectUrlRef.current = null
                setSpeakingLetter(null)
            }
            await audio.play()
        } catch {
            speechAudioRef.current = null
            setSpeakingLetter(null)
        }
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
            setUser((currentUser) => ({
                ...(currentUser || {}),
                ...updatedProfile,
                learning_language: updatedProfile.learning_language,
                native_language: updatedProfile.native_language,
            }))
            localStorage.setItem('neolit_selected_language', languageCode)
            const refreshedDashboard = await learningApi.getDashboardBootstrap()
            const refreshedLeaderboard = await learningApi.getLeaderboard().catch(() => [])
            setAssessments(refreshedDashboard.assessments)
            setLeaderboardRows(refreshedLeaderboard)
            setLeaderboardPage(1)
            setCourseMenuOpen(false)
            setMessage('Course changed successfully.')
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Unable to change course')
        } finally {
            setChangingCourse(false)
        }
    }

    const listenForAnswer = (question) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setMessage('Speech input is not supported in this browser. You can type the answer instead.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = selectedLanguageCode === 'en' ? 'en-US' : `${selectedLanguageCode}-IN`
        recognition.interimResults = false
        recognition.maxAlternatives = 1
        recognition.onresult = (event) => {
            setAnswers((previous) => ({ ...previous, [question.id]: event.results[0][0].transcript }))
        }
        recognition.onerror = () => setMessage('We could not hear that. Please try speaking again.')
        recognition.start()
    }

    const renderLetters = () => {
        const lettersCopy = {
            en: {
                start: 'START +10 XP',
                started: 'PRACTICE STARTED',
                practiceQuiz: 'PRACTICE QUIZ',
                pronunciationQuiz: 'PRONUNCIATION QUIZ',
                soundPrompt: 'Which sound is this?',
                hear: 'Hear',
                next: 'NEXT SOUND',
                correct: 'Correct! +10 XP',
                answer: 'The answer is',
                vowels: 'Vowels',
                consonants: 'Consonants',
                practiced: 'sounds practiced',
            },
            hi: {
                start: 'शुरू +10 XP',
                started: 'अभ्यास शुरू',
                practiceQuiz: 'अभ्यास क्विज़',
                pronunciationQuiz: 'उच्चारण क्विज़',
                soundPrompt: 'यह कौन-सा ध्वनि है?',
                hear: 'सुनें',
                next: 'अगला ध्वनि',
                correct: 'सही! +10 XP',
                answer: 'सही उत्तर है',
                vowels: 'स्वर',
                consonants: 'व्यंजन',
                practiced: 'ध्वनियाँ अभ्यास की गईं',
            },
        }
        const copy = lettersCopy[nativeLanguageCode] || lettersCopy.en

        return (
            <section className="letters-page">
                <div className="letters-heading">
                    <h1>{selectedLetters.title}</h1>
                    <p>{selectedLetters.subtitle}</p>
                    <button type="button" className="letters-start-button" onClick={() => setLettersStarted(true)}>
                        {lettersStarted ? copy.started : copy.start}
                    </button>
                    <div className="letters-progress-summary">
                        <span>{practicedLetters} / {letterItems.length} {copy.practiced}</span>
                        <div><i style={{ width: `${(practicedLetters / letterItems.length) * 100}%` }} /></div>
                    </div>
                    <button type="button" className="letters-quiz-button" onClick={() => { setLettersStarted(true); setQuizOpen(true); setQuizAnswer(null); setQuizIndex(0); setQuizScore(0) }}>
                        {quizOpen ? copy.pronunciationQuiz : copy.practiceQuiz}
                    </button>
                </div>

                {quizOpen && (
                    <div className="letters-quiz-card">
                        <div>
                            <span className="section-kicker">{copy.pronunciationQuiz}</span>
                            <h2>{copy.soundPrompt}</h2>
                            <button type="button" className="quiz-sound-button" onClick={() => speakLetter(quizItem[0], quizItem[1])}>
                                ▶ {copy.hear} “{quizItem[1]}”
                            </button>
                        </div>
                        <div className="quiz-options">
                            {quizOptions.map(([letter, word]) => (
                                <button key={`${letter}-${word}`} type="button" className={quizAnswer === letter ? (letter === quizItem[0] ? 'correct' : 'wrong') : ''} onClick={() => { setQuizAnswer(letter); if (letter === quizItem[0]) setQuizScore((score) => score + 1) }}>
                                    <strong>{letter}</strong>
                                    <small>{word}</small>
                                </button>
                            ))}
                        </div>
                        {quizAnswer && (
                            <>
                                <p className={quizAnswer === quizItem[0] ? 'quiz-feedback correct' : 'quiz-feedback wrong'}>{quizAnswer === quizItem[0] ? copy.correct : `${copy.answer} ${quizItem[0]}`}</p>
                                <button type="button" className="quiz-next-button" onClick={() => { setQuizIndex((index) => index + 1); setQuizAnswer(null) }}>{copy.next}</button>
                            </>
                        )}
                    </div>
                )}

                {['vowels', 'consonants'].map((group) => (
                    <section key={group} className="letters-group">
                        <h2><span />{group === 'vowels' ? copy.vowels : copy.consonants}<span /></h2>
                        <div className="letters-grid">
                            {selectedLetters[group].map(([letter, word]) => (
                                <button key={`${letter}-${word}`} type="button" className={`letter-card ${speakingLetter === letter ? 'speaking' : ''}`} onClick={() => speakLetter(letter, word)} title={`Hear ${letter} in ${selectedLanguageName}`} aria-label={`Hear ${letter} and ${word} in ${selectedLanguageName}`}>
                                    <strong>{letter}</strong>
                                    <small>{word}</small>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </section>
        )
    }

    const renderLeaderboard = () => (
        (() => {
            const copy = leaderboardCopy[nativeLanguageCode] || leaderboardCopy.en
            const pageSize = 6
            const pageCount = Math.max(1, Math.ceil(leaderboardRows.length / pageSize))
            const visibleRows = leaderboardRows.slice((leaderboardPage - 1) * pageSize, leaderboardPage * pageSize)
            return (
                <section className="leaderboard-page">
                    <div className="leaderboard-heading">
                        <span className="section-kicker">{selectedLanguageName} course</span>
                        <h1>{copy.title}</h1>
                        <p>{copy.subtitle}</p>
                    </div>

                    <div className="leaderboard-tabs" role="tablist" aria-label="Leaderboard period">
                        {['weekly', 'monthly'].map((period) => (
                            <button key={period} type="button" className={leaderboardPeriod === period ? 'active' : ''} onClick={() => setLeaderboardPeriod(period)} role="tab" aria-selected={leaderboardPeriod === period}>
                                {copy[period]}
                            </button>
                        ))}
                    </div>

                    <div className="leaderboard-card">
                        <div className="leaderboard-card-header"><span>RANK</span><span>LEARNER</span><span>XP</span><span>STREAK</span></div>
                        {visibleRows.map((row, index) => {
                            const liveRow = row.current ? { ...row, xp: xpTotal, streak: streakDays, name: user?.first_name || row.name } : row
                            return (
                                <div key={row.id || `${leaderboardPage}-${index}-${row.name}`} className={`leaderboard-row ${row.current ? 'current' : ''}`}>
                                    <strong className="leaderboard-rank">{(leaderboardPage - 1) * pageSize + index + 1}</strong>
                                    <span className="leaderboard-name"><i>{liveRow.name[0]}</i>{liveRow.name}</span>
                                    <strong>{liveRow.xp.toLocaleString()}</strong>
                                    <span className="leaderboard-streak">🔥 {liveRow.streak}</span>
                                </div>
                            )
                        })}
                    </div>
                    {pageCount > 1 && <div className="leaderboard-pagination" aria-label="Leaderboard pages">
                        <button type="button" onClick={() => setLeaderboardPage((page) => Math.max(1, page - 1))} disabled={leaderboardPage === 1} aria-label="Previous leaderboard page">←</button>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                            <button key={page} type="button" className={leaderboardPage === page ? 'active' : ''} onClick={() => setLeaderboardPage(page)} aria-label={`Leaderboard page ${page}`}>{page}</button>
                        ))}
                        <button type="button" onClick={() => setLeaderboardPage((page) => Math.min(pageCount, page + 1))} disabled={leaderboardPage === pageCount} aria-label="Next leaderboard page">→</button>
                    </div>}
                    <p className="leaderboard-note">{copy.note(copy[leaderboardPeriod], selectedLanguageName)}</p>
                </section>
            )
        })()
    )

    const renderQuests = () => {
        const copy = questCopy[nativeLanguageCode] || questCopy.en
        const quests = [
            { title: copy.lessons[0], detail: copy.lessons[1], current: Math.min(totalCompletedLessons, 3), target: 3, icon: '📚' },
            { title: copy.xp[0], detail: copy.xp[1], current: Math.min(xpTotal, 30), target: 30, icon: '⚡' },
            { title: copy.streak[0], detail: copy.streak[1](streakDays), current: Math.min(streakDays, 7), target: 7, icon: '🔥' },
        ]

        return (
            <section className="quests-page">
                <div className="leaderboard-heading">
                    <span className="section-kicker">{selectedLanguageName} course</span>
                    <h1>{copy.title}</h1>
                    <p>{copy.subtitle}</p>
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

    const currentLessonStep = Math.min(currentPathLesson, unitLessonLabels.length - 1)
    const openLesson = (step = currentLessonStep) => isUnitUnlocked(activeUnit) && step <= currentPathLesson

    return (
        <div className="neo-learn-dashboard">
            {message && <div className="neo-dashboard-message" role="status">{message}</div>}

            {activeSection === 'learn' ? (
                <>
                    <header className="neo-dashboard-topline">
                        <div>
                            <span className="neo-dashboard-welcome">{pageCopy.welcome}</span>
                            <h1>{pageCopy.ready} <span>{learnerName.split(' ')[0]}?</span></h1>
                        </div>
                        <div className="neo-dashboard-stats">
                            <div><span>🔥</span><strong>{streakDays}</strong><small>{pageCopy.streak}</small></div>
                            <div><span>⭐</span><strong>{xpTotal}</strong><small>{pageCopy.totalXp}</small></div>
                            <div><span>❤️</span><strong>{heartsRemaining}</strong><small>{pageCopy.hearts}</small></div>
                        </div>
                    </header>

                    <section className="neo-learning-hero">
                        <div className="neo-learning-hero-copy">
                            <span>{pageCopy.journey}</span>
                            <h2>{pageCopy.heroFirst}<br />{pageCopy.heroSecond}</h2>
                            <p>{pageCopy.heroDescription}</p>
                            {openLesson() ? <Link className="neo-primary-button" to={`/lesson/${activeUnit}?step=${currentLessonStep}`}>{pageCopy.continue}<span aria-hidden="true">→</span></Link> : <button className="neo-primary-button" type="button" disabled>🔒 {pageCopy.continue}</button>}
                        </div>
                        <div className="neo-learning-hero-art" aria-hidden="true">
                            <span className="neo-hero-sun" />
                            <span className="neo-hero-mountain neo-hero-mountain-back" />
                            <span className="neo-hero-mountain neo-hero-mountain-front" />
                            <span className="neo-hero-tree neo-hero-tree-one">🌲</span>
                            <span className="neo-hero-tree neo-hero-tree-two">🌲</span>
                            <span className="neo-hero-tree neo-hero-tree-three">🌲</span>
                            <span className="neo-hero-owl">🦉</span>
                        </div>
                    </section>

                    <div className="neo-dashboard-content-grid">
                        <main className="neo-learning-section">
                            <header className="neo-section-heading">
                                <div>
                                    <span>{pageCopy.yourPath}</span>
                                    <h2>{activeUnitDetails?.[0] || selectedLessonTitle}</h2>
                                    <p>{activeUnitDetails?.[1] || activeStageCopy}</p>
                                </div>
                                <div className="neo-unit-progress-ring" style={{ '--unit-progress': `${unitProgressPercent}%` }}>
                                    <span>{unitProgressPercent}%</span>
                                </div>
                            </header>

                            <div className="neo-unit-tabs" aria-label={pageCopy.yourPath}>
                                {selectedUnits.map(([title, description], index) => {
                                    const unitNumber = index + 1
                                    const done = completedPathLessons[`${selectedLanguageCode}-${unitNumber}`]?.length || 0
                                    const unlocked = isUnitUnlocked(unitNumber)
                                    return (
                                        <button key={`${selectedLanguageCode}-${unitNumber}`} type="button" disabled={!unlocked} onClick={() => setActiveUnit(unitNumber)} className={`neo-unit-tab ${activeUnit === unitNumber ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}>
                                            <span className="neo-unit-tab-icon">{unitNumber === 1 ? '🌱' : unitNumber === 2 ? '🌿' : unitNumber === 3 ? '🍎' : '💬'}</span>
                                            <span className="neo-unit-tab-copy"><small>{uiCopy.unit} {unitNumber}</small><strong>{title}</strong><i><span style={{ width: `${Math.round((done / unitLessonLabels.length) * 100)}%` }} /></i></span>
                                        </button>
                                    )
                                })}
                            </div>

                            <section className="neo-path-card" aria-label={`${pageCopy.yourPath}: ${activeUnitDetails?.[0] || selectedLessonTitle}`}>
                                <div className="neo-path-background" aria-hidden="true" />
                                <div className="neo-learning-path">
                                    {unitLessonLabels.map((label, index) => {
                                        const completed = completedLessons.includes(index)
                                        const current = index === currentPathLesson && !completed
                                        const unlocked = isUnitUnlocked(activeUnit) && index <= currentPathLesson
                                        const position = index % 2 === 0 ? 'path-left' : 'path-right'
                                        return (
                                            <div key={label} className={`neo-path-step ${position}`}>
                                                {index < unitLessonLabels.length - 1 && <div className="neo-path-connector" aria-hidden="true"><span /></div>}
                                                <Link aria-disabled={!unlocked} onClick={(event) => { if (!unlocked) event.preventDefault(); else setSelectedLesson(lessonStages[index]?.id || 'reading') }} to={unlocked ? `/lesson/${activeUnit}?step=${index}` : '#'} className={`neo-lesson-node ${completed ? 'completed' : current ? 'current' : 'locked'}`}>
                                                    <span>{completed ? '✓' : current ? '▶' : '🔒'}</span>
                                                </Link>
                                                <div className="neo-lesson-label"><strong>{label}</strong><span>{completed ? uiCopy.completed : current ? `+10 XP · ${uiCopy.startHere}` : uiCopy.previousLesson}</span></div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>

                            <section className="neo-assessment-card">
                                <span className="neo-assessment-icon" aria-hidden="true">📝</span>
                                <div className="neo-assessment-copy">
                                    <small>{courseAssessmentTitles[nativeLanguageCode] || pageCopy.assessment}</small>
                                    <h3>{pageCopy.test}</h3>
                                    <p>{pageCopy.assessmentDescription}</p>
                                    <div><span>✦ {(visibleAssessments[0] || assessments[0])?.questions.length || 0} {pageCopy.questions}</span><span>◷ ~5 {pageCopy.minutes}</span><span>⭐ {pageCopy.upTo} 20 XP</span></div>
                                </div>
                                <button type="button" className="neo-assessment-button" onClick={openUnitAssessment}>{pageCopy.startAssessment}<span aria-hidden="true">→</span></button>
                            </section>
                        </main>

                        <aside className="neo-dashboard-aside">
                            <article className="neo-side-card neo-streak-card">
                                <header><span aria-hidden="true">🔥</span><strong>{pageCopy.streak}</strong></header>
                                <div className="neo-streak-value">{streakDays}<small> {pageCopy.streak === 'Streak' ? 'days' : ''}</small></div>
                                <div className="neo-week-days">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`} className={index < streakDays % 7 ? 'active' : ''}>{day}<i>{index < streakDays % 7 ? '✓' : ''}</i></span>)}</div>
                            </article>

                            <article className="neo-side-card neo-quest-card">
                                <header><span aria-hidden="true">🎯</span><strong>{pageCopy.todayQuest}</strong></header>
                                <p>{pageCopy.completeLessons.replace('{count}', dailyGoalTarget)}</p>
                                <div className="neo-quest-progress"><span style={{ width: `${dailyGoalProgress}%` }} /></div>
                                <footer><span>{dailyLessons} / {dailyGoalTarget} {pageCopy.lessonsCompleted}</span><strong>+30 XP</strong></footer>
                            </article>

                            <article className="neo-side-card neo-progress-card">
                                <header><span aria-hidden="true">🏅</span><strong>{pageCopy.progress}</strong></header>
                                <div className="neo-total-lessons"><span>{pageCopy.lessonsCompleted}</span><strong>{totalCompletedLessons}</strong></div>
                                <div className="neo-progress-track"><span style={{ width: `${Math.min(100, (totalCompletedLessons / selectedUnits.length) * 100)}%` }} /></div>
                                <div className="neo-progress-stat"><span>{pageCopy.totalXp}</span><strong>⭐ {xpTotal}</strong></div>
                                <div className="neo-progress-stat"><span>{pageCopy.hearts}</span><strong>❤️ {heartsRemaining}</strong></div>
                            </article>
                        </aside>
                    </div>
                </>
            ) : (
                <div className="duolingo-app-content">
                    {activeSection === 'letters' ? renderLetters() : activeSection === 'leaderboard' ? renderLeaderboard() : renderQuests()}
                </div>
            )}

            {assessmentOpen && (
                <div className="neo-assessment-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeAssessment()}>
                    <section className="neo-assessment-dialog" role="dialog" aria-modal="true" aria-label={pageCopy.assessment}>
                        {result ? (
                            <div className="neo-assessment-result"><span aria-hidden="true">🎉</span><h2>{pageCopy.complete}</h2><strong>{result.percentage}%</strong><p>{pageCopy.score}: {result.score} / {result.total_marks}</p><p>⭐ +{result.xp_earned} {pageCopy.xpEarned}</p><button type="button" onClick={closeAssessment}>{pageCopy.done}</button></div>
                        ) : selected?.questions?.length ? (
                            <form onSubmit={submit}>
                                <header className="neo-assessment-dialog-head"><div><small>{selected.title}</small><button type="button" onClick={closeAssessment} aria-label={pageCopy.exit}>×</button></div><i><span style={{ width: `${((assessmentQuestionIndex + 1) / selected.questions.length) * 100}%` }} /></i></header>
                                {(() => {
                                    const question = selected.questions[assessmentQuestionIndex]
                                    const answer = answers[question.id] ?? ''
                                    return <>
                                        <p className="neo-assessment-question-count">{pageCopy.question} {assessmentQuestionIndex + 1} {pageCopy.of} {selected.questions.length}</p>
                                        <h2>{question.question_text}</h2>
                                        {question.options?.length ? <div className="neo-assessment-options">{question.options.map((option) => <button key={option.id} type="button" className={answer === option.option_text ? 'selected' : ''} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.option_text }))}>{option.option_text}</button>)}</div> : <input value={answer} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder={pageCopy.typeAnswer} />}
                                        <footer><button type="button" className="secondary" onClick={closeAssessment}>{pageCopy.exit}</button>{assessmentQuestionIndex < selected.questions.length - 1 ? <button type="button" disabled={!String(answer).trim()} onClick={() => setAssessmentQuestionIndex((index) => index + 1)}>{pageCopy.next}</button> : <button type="submit" disabled={!String(answer).trim()}>{pageCopy.submit}</button>}</footer>
                                    </>
                                })()}
                            </form>
                        ) : (
                            <div className="neo-assessment-result"><p>{pageCopy.noAssessment}</p><button type="button" onClick={closeAssessment}>{pageCopy.done}</button></div>
                        )}
                    </section>
                </div>
            )}
        </div>
    )
}
