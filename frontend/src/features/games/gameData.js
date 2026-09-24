export const DEFAULT_GAME_SETTINGS = {
    seconds: 12,
    points: 10,
}

export const RUNNER_EXTRA_WORDS = {
    en: ['river', 'green', 'book', 'quiet', 'school', 'bright', 'small', 'friend', 'morning', 'street'],
    hi: ['नदी', 'हरा', 'किताब', 'शांत', 'स्कूल', 'उजला', 'छोटा', 'दोस्त', 'सुबह', 'सड़क'],
    kn: ['ನದಿ', 'ಹಸಿರು', 'ಪುಸ್ತಕ', 'ಶಾಂತ', 'ಶಾಲೆ', 'ಬೆಳಕು', 'ಚಿಕ್ಕ', 'ಮಿತ್ರ', 'ಬೆಳಗ್ಗೆ', 'ರಸ್ತೆ'],
    ta: ['ஆறு', 'பச்சை', 'புத்தகம்', 'அமைதி', 'பள்ளி', 'பிரகாசம்', 'சிறிய', 'நண்பர்', 'காலை', 'தெரு'],
    te: ['నది', 'ఆకుపచ్చ', 'పుస్తకం', 'నిశ్శబ్దం', 'పాఠశాల', 'ప్రకాశం', 'చిన్న', 'స్నేహితుడు', 'ఉదయం', 'వీధి'],
}

export const LANGUAGE_GAME_LABELS = {
    en: 'English Games',
    hi: 'Hindi Games',
    kn: 'Kannada Games',
    ta: 'Tamil Games',
    te: 'Telugu Games',
}

export const REMOVED_GAME_IDS = new Set(['listening', 'mystery-word', 'runner'])

export const PERSISTED_ROUND_GAME_IDS = new Set(['word-builder', 'word-hunt', 'flip-card'])
