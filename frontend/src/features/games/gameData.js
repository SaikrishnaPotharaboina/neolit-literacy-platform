export const DEFAULT_GAME_SETTINGS = {
    seconds: 12,
    points: 10,
}

export const RUNNER_EXTRA_WORDS = {
    en: ['river', 'green', 'book', 'quiet', 'school', 'bright', 'small', 'friend', 'morning', 'street'],
    hi: ['नदी', 'हरा', 'किताब', 'शांत', 'स्कूल', 'उजला', 'छोटा', 'दोस्त', 'सुबह', 'सड़क'],
    kn: ['ನದಿ', 'ಹಸಿರು', 'ಪುಸ್ತಕ', 'ಶಾಂತ', 'ಶಾಲೆ', 'ಬೆಳಕು', 'ಚಿಕ್ಕ', 'ಮित्र', 'ಬೆಳಗ್ಗೆ', 'ರಸ್ತೆ'],
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

export const PERSISTED_ROUND_GAME_IDS = new Set(['word-builder', 'word-hunt', 'flip-card', 'archer'])

const shuffleGameOptions = (items) => [...items].sort(() => Math.random() - 0.5)

const buildWordHuntTemplates = (languageCode) => {
    const templates = {
        en: [
            { prompt: 'Find 3 words related to food.', answers: ['BOOK', 'APPLE', 'HOUSE', 'WATER', 'BREAD', 'DOG'], correct: ['APPLE', 'WATER', 'BREAD'] },
            { prompt: 'Find 3 words related to places.', answers: ['SCHOOL', 'CAT', 'MARKET', 'RIVER', 'HOUSE', 'GREEN'], correct: ['SCHOOL', 'MARKET', 'HOUSE'] },
            { prompt: 'Find 3 words related to nature.', answers: ['TREE', 'BOOK', 'RIVER', 'SUN', 'CHAIR', 'DOG'], correct: ['TREE', 'RIVER', 'SUN'] },
            { prompt: 'Find 3 words related to animals.', answers: ['DOG', 'TABLE', 'CAT', 'BIRD', 'HOUSE', 'BLUE'], correct: ['DOG', 'CAT', 'BIRD'] },
            { prompt: 'Find 3 words related to school.', answers: ['PENCIL', 'RIVER', 'TEACHER', 'BOOK', 'APPLE', 'MOON'], correct: ['PENCIL', 'TEACHER', 'BOOK'] },
            { prompt: 'Find 3 words related to travel.', answers: ['TRAIN', 'WATER', 'MAP', 'DESK', 'BAG', 'WINDOW'], correct: ['TRAIN', 'MAP', 'BAG'] },
            { prompt: 'Find 3 words related to emotions.', answers: ['HAPPY', 'TABLE', 'FRIEND', 'SAD', 'SHOES', 'LIGHT'], correct: ['HAPPY', 'FRIEND', 'SAD'] },
            { prompt: 'Find 3 words related to time.', answers: ['MORNING', 'BOOK', 'CLOCK', 'SCHOOL', 'NIGHT', 'LEAF'], correct: ['MORNING', 'CLOCK', 'NIGHT'] },
            { prompt: 'Find 3 words related to weather.', answers: ['RAIN', 'BREAD', 'CLOUD', 'SOFA', 'SUN', 'DOOR'], correct: ['RAIN', 'CLOUD', 'SUN'] },
            { prompt: 'Find 3 words related to home.', answers: ['HOUSE', 'BOOK', 'BED', 'RIVER', 'TABLE', 'BIRD'], correct: ['HOUSE', 'BED', 'TABLE'] },
            { prompt: 'Find 3 words related to music.', answers: ['SONG', 'MARKET', 'GUITAR', 'CUP', 'DRUM', 'PENCIL'], correct: ['SONG', 'GUITAR', 'DRUM'] },
            { prompt: 'Find 3 words related to colors.', answers: ['BLUE', 'RIVER', 'GREEN', 'TEACHER', 'PAPER', 'BOOK'], correct: ['BLUE', 'GREEN', 'PAPER'] },
        ],
        hi: [
            { prompt: 'खाने से जुड़े 3 शब्द ढूँढें।', answers: ['किताब', 'सेब', 'घर', 'पानी', 'रोटी', 'कुत्ता'], correct: ['सेब', 'पानी', 'रोटी'] },
            { prompt: 'जगहों से जुड़े 3 शब्द ढूँढें।', answers: ['स्कूल', 'बिल्ली', 'बाज़ार', 'नदी', 'घर', 'हरा'], correct: ['स्कूल', 'बाज़ार', 'घर'] },
            { prompt: 'प्रकृति से जुड़े 3 शब्द ढूँढें।', answers: ['पेड़', 'किताब', 'नदी', 'सूर्य', 'कुर्सी', 'कुत्ता'], correct: ['पेड़', 'नदी', 'सूर्य'] },
            { prompt: 'पशुओं से जुड़े 3 शब्द ढूँढें।', answers: ['कुत्ता', 'मेज़', 'बिल्ली', 'चिड़िया', 'घर', 'नीला'], correct: ['कुत्ता', 'बिल्ली', 'चिड़िया'] },
            { prompt: 'स्कूल से जुड़े 3 शब्द ढूँढें।', answers: ['पेंसिल', 'नदी', 'शिक्षक', 'किताब', 'सेब', 'चाँद'], correct: ['पेंसिल', 'शिक्षक', 'किताब'] },
            { prompt: 'यात्रा से जुड़े 3 शब्द ढूँढें।', answers: ['रेल', 'पानी', 'नक्शा', 'डेस्क', 'बैग', 'खिड़की'], correct: ['रेल', 'नक्शा', 'बैग'] },
            { prompt: 'भावनाओं से जुड़े 3 शब्द ढूँढें।', answers: ['खुश', 'मेज़', 'दोस्त', 'दुखी', 'जूते', 'रोशनी'], correct: ['खुश', 'दोस्त', 'दुखी'] },
            { prompt: 'समय से जुड़े 3 शब्द ढूँढें।', answers: ['सुबह', 'किताब', 'घड़ी', 'स्कूल', 'रात', 'पत्ता'], correct: ['सुबह', 'घड़ी', 'रात'] },
            { prompt: 'मौसम से जुड़े 3 शब्द ढूँढें।', answers: ['बारिश', 'रोटी', 'बादल', 'सोफ़ा', 'सूर्य', 'दरवाज़ा'], correct: ['बारिश', 'बादल', 'सूर्य'] },
            { prompt: 'घर से जुड़े 3 शब्द ढूँढें।', answers: ['घर', 'किताब', 'बिस्तर', 'नदी', 'मेज़', 'चिड़िया'], correct: ['घर', 'बिस्तर', 'मेज़'] },
            { prompt: 'संगीत से जुड़े 3 शब्द ढूँढें।', answers: ['गाना', 'बाज़ार', 'गिटार', 'कप', 'ड्रम', 'पेंसिल'], correct: ['गाना', 'गिटार', 'ड्रम'] },
            { prompt: 'रंगों से जुड़े 3 शब्द ढूँढें।', answers: ['नीला', 'नदी', 'हरा', 'शिक्षक', 'कागज़', 'किताब'], correct: ['नीला', 'हरा', 'कागज़'] },
        ],
        kn: [
            { prompt: 'ಆಹಾರಕ್ಕೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಪುಸ್ತಕ', 'ಆಪಲ್', 'ಮನೆ', 'ನೀರು', 'ರೊಟ್ಟಿ', 'ನಾಯಿ'], correct: ['ಆಪಲ್', 'ನೀರು', 'ರೊಟ್ಟಿ'] },
            { prompt: 'ಸ್ಥಳಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಶಾಲೆ', 'ಪಕ್ಷಿ', 'ಮಾರುಕಟ್ಟೆ', 'ನದಿ', 'ಮನೆ', 'ಹಸಿರು'], correct: ['ಶಾಲೆ', 'ಮಾರುಕಟ್ಟೆ', 'ಮನೆ'] },
            { prompt: 'ಪ್ರಕೃತಿಗೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಮರ', 'ಪುಸ್ತಕ', 'ನದಿ', 'ಸೂರ್ಯ', 'ಕುರ್ಚಿ', 'ನಾಯಿ'], correct: ['ಮರ', 'ನದಿ', 'ಸೂರ್ಯ'] },
            { prompt: 'ಪ್ರಾಣಿಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ನಾಯಿ', 'ಮಂಚ', 'ಬೆಕ್ಕು', 'ಪಕ್ಷಿ', 'ಮನೆ', 'ನೀಲಿ'], correct: ['ನಾಯಿ', 'ಬೆಕ್ಕು', 'ಪಕ್ಷಿ'] },
            { prompt: 'ಶಾಲೆಗೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಪೆನ್ಸಿಲ್', 'ನದಿ', 'ಶಿಕ್ಷಕ', 'ಪುಸ್ತಕ', 'ಆಪಲ್', 'ಚಂದ್ರ'], correct: ['ಪೆನ್ಸಿಲ್', 'ಶಿಕ್ಷಕ', 'ಪುಸ್ತಕ'] },
            { prompt: 'ಪ್ರಯಾಣಕ್ಕೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ರೈಲು', 'ನೀರು', 'ಮ್ಯಾಪ್', 'ಮೇಜ್', 'ಚೀಲ', 'ಕಿಟಕಿ'], correct: ['ರೈಲು', 'ಮ್ಯಾಪ್', 'ಚೀಲ'] },
            { prompt: 'ಅಭಿವ್ಯಕ್ತಿಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಖುಷಿ', 'ಮಂಚ', 'ಮಿತ್ರ', 'ದುಃಖ', 'ಕಾಲುಬಟ್ಟೆ', 'ಬೆಳಕು'], correct: ['ಖುಷಿ', 'ಮಿತ್ರ', 'ದುಃಖ'] },
            { prompt: 'ಸಮಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಬೆಳಿಗ್ಗೆ', 'ಪುಸ್ತಕ', 'ಗಡಿಯಾರ', 'ಶಾಲೆ', 'ರಾತ್ರಿ', 'ಎಲೆ'], correct: ['ಬೆಳಿಗ್ಗೆ', 'ಗಡಿಯಾರ', 'ರಾತ್ರಿ'] },
            { prompt: 'ಮಳೆಗೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಮಳೆ', 'ರೊಟ್ಟಿ', 'ಮೋಡ', 'ಸೋಫಾ', 'ಸೂರ್ಯ', 'ಕತ್ತೆ'], correct: ['ಮಳೆ', 'ಮೋಡ', 'ಸೂರ್ಯ'] },
            { prompt: 'ಮನೆಗೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಮನೆ', 'ಪುಸ್ತಕ', 'ಹಾಸಿಗೆ', 'ನದಿ', 'ಮೇಜ್', 'ಪಕ್ಷಿ'], correct: ['ಮನೆ', 'ಹಾಸಿಗೆ', 'ಮೇಜ್'] },
            { prompt: 'ಸಂಗೀತಕ್ಕೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ಗೀತೆ', 'ಮಾರುಕಟ್ಟೆ', 'ಗಿಟಾರ್', 'ಕಪ್', 'ಡ್ರಮ್', 'ಪೆನ್ಸಿಲ್'], correct: ['ಗೀತೆ', 'ಗಿಟಾರ್', 'ಡ್ರಮ್'] },
            { prompt: 'ಬಣ್ಣಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['ನೀಲಿ', 'ನದಿ', 'ಹಸಿರು', 'ಶಿಕ್ಷಕ', 'ಕಾಗದ', 'ಪುಸ್ತಕ'], correct: ['ನೀಲಿ', 'ಹಸಿರು', 'ಕಾಗದ'] },
        ],
        ta: [
            { prompt: 'உணவுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['புத்தகம்', 'ஆப்பிள்', 'வீடு', 'நீர்', 'ரொட்டி', 'நாய்'], correct: ['ஆப்பிள்', 'நீர்', 'ரொட்டி'] },
            { prompt: 'இடங்களுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['பள்ளி', 'பூனை', 'சந்தை', 'ஆறு', 'வீடு', 'பச்சை'], correct: ['பள்ளி', 'சந்தை', 'வீடு'] },
            { prompt: 'இயற்கையுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['மரம்', 'புத்தகம்', 'ஆறு', 'சூரியன்', 'கதிர்', 'நாய்'], correct: ['மரம்', 'ஆறு', 'சூரியன்'] },
            { prompt: 'விலங்குகளுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['நாய்', 'மேசை', 'பூனை', 'பறவை', 'வீடு', 'நீலம்'], correct: ['நாய்', 'பூனை', 'பறவை'] },
            { prompt: 'பள்ளியுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['பென்சில்', 'ஆறு', 'ஆசிரியர்', 'புத்தகம்', 'ஆப்பிள்', 'சந்திரன்'], correct: ['பென்சில்', 'ஆசிரியர்', 'புத்தகம்'] },
            { prompt: 'பயணத்துடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['ரயில்', 'நீர்', 'வரைபடம்', 'டெஸ்க்', 'பை', 'ஜன்னல்'], correct: ['ரயில்', 'வரைபடம்', 'பை'] },
            { prompt: 'உணர்வுகளுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['மகிழ்ச்சி', 'மேசை', 'நண்பர்', 'சோகம்', 'சூடுகள்', 'ஒளி'], correct: ['மகிழ்ச்சி', 'நண்பர்', 'சோகம்'] },
            { prompt: 'காலத்துடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['காலை', 'புத்தகம்', 'கடிகாரம்', 'பள்ளி', 'இரவு', 'இலை'], correct: ['காலை', 'கடிகாரம்', 'இரவு'] },
            { prompt: 'வானிலையுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['மழை', 'ரொட்டி', 'மேகம்', 'சோபா', 'சூரியன்', 'கதவு'], correct: ['மழை', 'மேகம்', 'சூரியன்'] },
            { prompt: 'வீட்டுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['வீடு', 'புத்தகம்', 'படுக்கை', 'ஆறு', 'மேசை', 'பறவை'], correct: ['வீடு', 'படுக்கை', 'மேசை'] },
            { prompt: 'இசையுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['பாடல்', 'சந்தை', 'கிட்டார்', 'கோப்பை', 'டிரம்', 'பென்சில்'], correct: ['பாடல்', 'கிட்டார்', 'டிரம்'] },
            { prompt: 'நிறங்களுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['நீலம்', 'ஆறு', 'பச்சை', 'ஆசிரியர்', 'காகிதம்', 'புத்தகம்'], correct: ['நீலம்', 'பச்சை', 'காகிதம்'] },
        ],
        te: [
            { prompt: 'ఆహారం సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['పుస్తకం', 'ఆపిల్', 'ఇల్లు', 'నీరు', 'రొట్టె', 'కుక్క'], correct: ['ఆపిల్', 'నీరు', 'రొట్టె'] },
            { prompt: 'స్థలాలకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['పాఠశాల', 'పిల్లి', 'మార్కెట్', 'నది', 'ఇల్లు', 'ఆకుపచ్చ'], correct: ['పాఠశాల', 'మార్కెట్', 'ఇల్లు'] },
            { prompt: 'ప్రకృతికి సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['చెట్టు', 'పుస్తకం', 'నది', 'సూర్యుడు', 'కుర్చీ', 'కుక్క'], correct: ['చెట్టు', 'నది', 'సూర్యుడు'] },
            { prompt: 'జంతువులకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['కుక్క', 'మెజా', 'పిల్లి', 'పక్షి', 'ఇల్లు', 'నీలం'], correct: ['కుక్క', 'పిల్లి', 'పక్షి'] },
            { prompt: 'పాఠశాలకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['పెన్సిల్', 'నది', 'ఉపాధ్యాయుడు', 'పుస్తకం', 'ఆపిల్', 'చంద్రుడు'], correct: ['పెన్సిల్', 'ఉపాధ్యాయుడు', 'పుస్తకం'] },
            { prompt: 'ప్రయాణానికి సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['రైలు', 'నీరు', 'మ్యాప్', 'డెస్క్', 'బ్యాగ్', 'కిటికీ'], correct: ['రైలు', 'మ్యాప్', 'బ్యాగ్'] },
            { prompt: 'భావాలకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['సంతోషం', 'మెజా', 'స్నేహితుడు', 'చింత', 'షూస్', 'కాంతి'], correct: ['సంతోషం', 'స్నేహితుడు', 'చింత'] },
            { prompt: 'సమయానికి సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['ఉదయం', 'పుస్తకం', 'గడియారం', 'పాఠశాల', 'రాత్రి', 'ఆకు'], correct: ['ఉదయం', 'గడియారం', 'రాత్రి'] },
            { prompt: 'వాతావరణానికి సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['వర్షం', 'రొట్టె', 'మేఘం', 'సోఫా', 'సూర్యుడు', 'తలుపు'], correct: ['వర్షం', 'మేఘం', 'సూర్యుడు'] },
            { prompt: 'ఇల్లుకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['ఇల్లు', 'పుస్తకం', 'బడక', 'నది', 'మెజా', 'పక్షి'], correct: ['ఇల్లు', 'బడక', 'మెజా'] },
            { prompt: 'సంగీతానికి సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['పాట', 'మార్కెట్', 'గిటార్', 'కప్పు', 'డ్రమ్', 'పెన్సిల్'], correct: ['పాట', 'గిటార్', 'డ్రమ్'] },
            { prompt: 'రంగులకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['నీలం', 'నది', 'ఆకుపచ్చ', 'ఉపాధ్యాయుడు', 'కాగితం', 'పుస్తకం'], correct: ['నీలం', 'ఆకుపచ్చ', 'కాగితం'] },
        ],
    }

    const bank = templates[languageCode] || templates.en
    return Array.from({ length: 50 }, (_, index) => ({
        ...bank[index % bank.length],
        id: `word-hunt-${languageCode}-${index + 1}`,
    }))
}

const buildFlipCardTemplates = (languageCode) => {
    const templates = {
        en: [
            { prompt: 'Choose the correct greeting word.', answers: ['HELLO', 'WINDOW', 'TABLE', 'MORNING', 'BOOK'], correct: 'HELLO' },
            { prompt: 'Choose the correct word for a daily action.', answers: ['LEARN', 'GOODBYE', 'MOUNTAIN', 'BREAD', 'GARDEN'], correct: 'LEARN' },
            { prompt: 'Choose the correct word for a place to study.', answers: ['SCHOOL', 'RIVER', 'CLOUD', 'CHAIR', 'SUN'], correct: 'SCHOOL' },
            { prompt: 'Choose the correct word for a drink.', answers: ['WATER', 'HOUSE', 'TRAIN', 'FRIEND', 'TREE'], correct: 'WATER' },
            { prompt: 'Choose the correct fruit word.', answers: ['APPLE', 'BOOK', 'DOOR', 'BIRD', 'RAIN'], correct: 'APPLE' },
            { prompt: 'Choose the word that means “a place to live”.', answers: ['HOUSE', 'CHERRY', 'CLOUD', 'SMILE', 'MUSIC'], correct: 'HOUSE' },
            { prompt: 'Choose the correct word for a warm feeling.', answers: ['HAPPY', 'SILENT', 'ROCKET', 'METAL', 'MIRROR'], correct: 'HAPPY' },
            { prompt: 'Select the word that matches “to travel”.', answers: ['TRAVEL', 'SANDWICH', 'PLANET', 'TUNNEL', 'BREEZE'], correct: 'TRAVEL' },
            { prompt: 'Find the correct word for a group of people learning together.', answers: ['CLASS', 'RIDDLE', 'SHADOW', 'RIVER', 'BRIDGE'], correct: 'CLASS' },
            { prompt: 'Choose the word that means “a place to read”.', answers: ['LIBRARY', 'MARKET', 'WIND', 'CANDLE', 'CLOCK'], correct: 'LIBRARY' },
            { prompt: 'Choose the correct word for a day beginning.', answers: ['MORNING', 'NIGHT', 'SQUARE', 'WINDOW', 'STONE'], correct: 'MORNING' },
            { prompt: 'Select the correct word for a warm drink.', answers: ['TEA', 'CLOUD', 'BREAD', 'CHAIR', 'SHEEP'], correct: 'TEA' },
        ],
        hi: [
            { prompt: 'सही अभिवादन शब्द चुनें।', answers: ['नमस्ते', 'खिड़की', 'मेज़', 'सुबह', 'किताब'], correct: 'नमस्ते' },
            { prompt: 'दैनिक क्रिया का सही शब्द चुनें।', answers: ['सीखना', 'अलविदा', 'पहाड़', 'रोटी', 'बगीचा'], correct: 'सीखना' },
            { prompt: 'पढ़ने की जगह का सही शब्द चुनें।', answers: ['स्कूल', 'नदी', 'बादल', 'कुर्सी', 'सूर्य'], correct: 'स्कूल' },
            { prompt: 'पेय का सही शब्द चुनें।', answers: ['पानी', 'घर', 'रेल', 'दोस्त', 'पेड़'], correct: 'पानी' },
            { prompt: 'फल का सही शब्द चुनें।', answers: ['सेब', 'किताब', 'दरवाज़ा', 'पक्षी', 'बारिश'], correct: 'सेब' },
            { prompt: '“रहने की जगह” से सही शब्द चुनें।', answers: ['घर', 'आम', 'बादल', 'हँसी', 'संगीत'], correct: 'घर' },
            { prompt: 'सही शब्द चुनें जो “सुखद महसूस” बताता है।', answers: ['खुश', 'शांत', 'रॉकेट', 'धातु', 'दर्पण'], correct: 'खुश' },
            { prompt: '“यात्रा” से मेल खाने वाला शब्द चुनें।', answers: ['यात्रा', 'सैंडविच', 'ग्रह', 'सुरंग', 'हवा'], correct: 'यात्रा' },
            { prompt: 'एक साथ सीखने वालों के समूह का सही शब्द चुनें।', answers: ['कक्षा', 'पहेली', 'छाया', 'नदी', 'पुल'], correct: 'कक्षा' },
            { prompt: '“पढ़ने की जगह” सही शब्द चुनें।', answers: ['पुस्तकालय', 'बाज़ार', 'हवा', 'मोमबत्ती', 'घड़ी'], correct: 'पुस्तकालय' },
            { prompt: 'दिन की शुरुआत शब्द चुनें।', answers: ['सुबह', 'रात', 'आकार', 'खिड़की', 'पत्थर'], correct: 'सुबह' },
            { prompt: 'गर्म पेय का सही शब्द चुनें।', answers: ['चाय', 'बादल', 'रोटी', 'कुर्सी', 'भेड़'], correct: 'चाय' },
        ],
        kn: [
            { prompt: 'ಸರಿಯಾದ ಸ್ವಾಗತ ಪದವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಹಲೋ', 'ಕಿಟಕಿ', 'ಮಂಚ', 'ಬೆಳಗ್ಗೆ', 'ಪುಸ್ತಕ'], correct: 'ಹಲೋ' },
            { prompt: 'ದೈನಂದಿನ ಕ್ರಿಯೆಗೆ ಸರಿಯಾದ ಪದವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಕಲಿಯಿರಿ', 'ಅಲविदಾ', 'ಪರ್ವತ', 'ರೊಟ್ಟಿ', 'ತೋಟ'], correct: 'ಕಲಿಯಿರಿ' },
            { prompt: 'ಸಮೀಕ್ಷಿತ ಸ್ಥಳದ ಸರಿಯಾದ ಪದವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಪಾಠಶಾಲೆ', 'ನದಿ', 'ಮೋಡ', 'ಕುರ್ಚಿ', 'ಸೂರ್ಯ'], correct: 'ಪಾಠಶಾಲೆ' },
            { prompt: 'ಪಾನೀಯದ ಸರಿಯಾದ ಪದವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', answers: ['ನೀರು', 'ಮನೆ', 'ರೈಲು', 'ಮಿತ್ರ', 'ಮರ'], correct: 'ನೀರು' },
            { prompt: 'ಹಣ್ಣಿನ ಸರಿಯಾದ ಪದವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಆಪಲ್', 'ಪುಸ್ತಕ', 'ಕದ', 'ಪಕ್ಷಿ', 'ಮಳೆ'], correct: 'ಆಪಲ್' },
            { prompt: '“ವಾಸಸ್ಥಾನ”ಕ್ಕೆ ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ.', answers: ['ಮನೆ', 'ಚೆರ್ರಿ', 'ಮೋಡ', 'ನಗು', 'ಸಂಗೀತ'], correct: 'ಮನೆ' },
            { prompt: '“ಸಂತೋಷದ ಸಂಜ್ಞೆ”ಯ ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ.', answers: ['ಸಂತೋಷ', 'ಮೌನ', 'ರಾಕೆಟ್', 'ಲೋಹ', 'ಕನ್ನಡಿ'], correct: 'ಸಂತೋಷ' },
            { prompt: '“ಪ್ರಯಾಣ”ಕ್ಕೆ ಹೊಂದುವ ಪದವನ್ನು ಆರಿಸಿ.', answers: ['ಪ್ರಯಾಣ', 'ಸ್ಯಾಂಡ್ವಿಚ್', 'ಗ್ರಹ', 'ಸುಮಾರು', 'ಗಾಳಿ'], correct: 'ಪ್ರಯಾಣ' },
            { prompt: 'ಒಟ್ಟಿಗೆ ಕಲಿಯುವ ಜನರಿಗೆ ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ.', answers: ['ಕ್ಲಾಸ್', 'ರಿಡಲ್', 'ನೆರಳು', 'ನದಿ', 'ಸೇತುವೆ'], correct: 'ಕ್ಲಾಸ್' },
            { prompt: '“ಓದಲು ಸ್ಥಳ”ಗೆ ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ.', answers: ['ಗ್ರಂಥಾಲಯ', 'ಮಾರುಕಟ್ಟೆ', 'ಗಾಳಿ', 'ಮಾಮೆ', 'ಗಡಿಯಾರ'], correct: 'ಗ್ರಂಥಾಲಯ' },
            { prompt: 'ದಿನದ ಆರಂಭಕ್ಕೆ ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ.', answers: ['ಬೆಳಗ್ಗೆ', 'ರಾತ್ರಿ', 'ಚೌಕ', 'ಕಿಟಕಿ', 'ಕಲ್ಲು'], correct: 'ಬೆಳಗ್ಗೆ' },
            { prompt: 'ಹವಳಿ ಪಾನೀಯದ ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ.', answers: ['ಚಾಯ್', 'ಮೋಡ', 'ರೊಟ್ಟಿ', 'ಕುರ್ಚಿ', 'ಮೇಕೆ'], correct: 'ಚಾಯ್' },
        ],
        ta: [
            { prompt: 'சரியான வரவேற்பு சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['வணக்கம்', 'ஜன்னல்', 'மேஜை', 'காலை', 'புத்தகம்'], correct: 'வணக்கம்' },
            { prompt: 'நாள்தோறும் செய்யும் செயலுக்கான சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['கற்க', 'விடைபெறுகிறேன்', 'மலை', 'ரொட்டி', 'தோட்டம்'], correct: 'கற்க' },
            { prompt: 'கற்றல் இடத்திற்கான சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['பள்ளி', 'ஆறு', 'முகில்', 'கோல்', 'சூரியன்'], correct: 'பள்ளி' },
            { prompt: 'பானத்திற்கான சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['நீர்', 'வீடு', 'ரயில்', 'நண்பர்', 'மரம்'], correct: 'நீர்' },
            { prompt: 'பழத்திற்கான சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['ஆப்பிள்', 'புத்தகம்', 'கதவு', 'பறவை', 'மழை'], correct: 'ஆப்பிள்' },
            { prompt: '“வாழும் இடம்” என்பதற்கு சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['வீடு', 'செம்பு', 'முகில்', 'சிரிப்பு', 'இசை'], correct: 'வீடு' },
            { prompt: '“மகிழ்ச்சி” தரும் சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['மகிழ்ச்சி', 'மௌனம்', 'ரோசெட்', 'உலோகம்', 'அரங்கம்'], correct: 'மகிழ்ச்சி' },
            { prompt: '“பயணம்” உடன் பொருந்தும் சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['பயணம்', 'சாண்ட்விச்', 'கோள்', 'சுரங்கம்', 'காற்று'], correct: 'பயணம்' },
            { prompt: 'ஒரே நேரத்தில் கற்கும் குழுவிற்கான சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['வகுப்பு', 'விளக்கு', 'நிழல்', 'ஆறு', 'பாலம்'], correct: 'வகுப்பு' },
            { prompt: '“படிக்கும் இடம்” சற்றே சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['நூலகம்', 'சந்தை', 'காற்று', 'மெழுகுவர்த்தி', 'கடிகாரம்'], correct: 'நூலகம்' },
            { prompt: 'நாளின் தொடக்கத்தைக் குறிக்கும் சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['காலை', 'இரவு', 'சதுரம்', 'ஜன்னல்', 'கல்'], correct: 'காலை' },
            { prompt: 'வெந்நீர் தொடர்பான சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['தேநீர்', 'முகில்', 'ரொட்டி', 'கதிர்', 'செம்மறி'], correct: 'தேநீர்' },
        ],
        te: [
            { prompt: 'సరైన స్వాగత పదాన్ని ఎంచుకోండి.', answers: ['హలో', 'కిటికీ', 'మెజ్జ', 'ఉదయం', 'పుస్తకం'], correct: 'హలో' },
            { prompt: 'దినచర్యకు సరైన పదాన్ని ఎంచుకోండి.', answers: ['నేర్చుకోండి', 'విధేయత', 'పర్వతం', 'రొట్టె', 'తోట'], correct: 'నేర్చుకోండి' },
            { prompt: 'చదువుకునే ప్రదేశానికి సరైన పదాన్ని ఎంచుకోండి.', answers: ['పాఠశాల', 'నది', 'మేఘం', 'కుర్చీ', 'సూర్యుడు'], correct: 'పాఠశాల' },
            { prompt: 'పానీయానికి సరైన పదాన్ని ఎంచుకోండి.', answers: ['నీరు', 'ఇల్లు', 'రైలు', 'స్నేహితుడు', 'చెట్టు'], correct: 'నీరు' },
            { prompt: 'పండుకు సరైన పదాన్ని ఎంచుకోండి.', answers: ['ఆపిల్', 'పుస్తకం', 'ద్వారం', 'పక్షి', 'వర్షం'], correct: 'ఆపిల్' },
            { prompt: '“నివాస స్థలం”కు సరైన పదాన్ని ఎంచుకోండి.', answers: ['ఇల్లు', 'చెర్రీ', 'మేఘం', 'నవ్వు', 'సంగీతం'], correct: 'ఇల్లు' },
            { prompt: '“సంతోషం” సూచించే సరైన పదాన్ని ఎంచుకోండి.', answers: ['సంతోషం', 'నిశ్శబ్దం', 'రాకెట్', 'లోహం', 'మిర్రర్'], correct: 'సంతోషం' },
            { prompt: '“ప్రయాణం”కి సరిపోయే పదాన్ని ఎంచుకోండి.', answers: ['ప్రయాణం', 'సాండ్‌విచ్', 'గ్రహం', 'సొరంగం', 'గాలి'], correct: 'ప్రయాణం' },
            { prompt: 'ఒకే సమయంలో నేర్చుకునే సమూహానికి సరైన పదాన్ని ఎంచుకోండి.', answers: ['క్లాస్', 'రహస్యం', 'నెమ్మదింపు', 'నది', 'వంతెన'], correct: 'క్లాస్' },
            { prompt: '“చదవడానికి స్థలం”కు సరైన పదాన్ని ఎంచుకోండి.', answers: ['లైబ్రరీ', 'మార్కెట్', 'గాలి', 'ముగ్గు', 'గడియారం'], correct: 'లైబ్రరీ' },
            { prompt: 'రోజు ప్రారంభానికి సరైన పదాన్ని ఎంచుకోండి.', answers: ['ఉదయం', 'రాత్రి', 'చదరపు', 'కిటికీ', 'రాయి'], correct: 'ఉదయం' },
            { prompt: 'వెచ్చని పానీయానికి సరైన పదాన్ని ఎంచుకోండి.', answers: ['టీ', 'మేఘం', 'రొట్టె', 'కుర్చీ', 'మేక'], correct: 'టీ' },
        ],
    }

    const bank = templates[languageCode] || templates.en
    return Array.from({ length: 50 }, (_, index) => ({
        ...bank[index % bank.length],
        id: `flip-card-${languageCode}-${index + 1}`,
    }))
}

const buildArcherTemplates = (languageCode) => {
    const templates = {
        en: [
            { prompt: 'Which word means "to examine carefully"?', answers: ['Analyze', 'Gather', 'Breathe', 'Ignore'], correct: 'Analyze' },
            { prompt: 'Select the word for "a sudden feeling of fear".', answers: ['Panic', 'Lantern', 'Pillow', 'Ribbon'], correct: 'Panic' },
            { prompt: 'What does "fragile" mean?', answers: ['Easily broken', 'Very loud', 'Extremely slow', 'Completely empty'], correct: 'Easily broken' },
            { prompt: 'Choose the word that means "a long journey".', answers: ['Expedition', 'Cabin', 'Shadow', 'Thread'], correct: 'Expedition' },
            { prompt: 'Which option best matches "to postpone"?', answers: ['Delay', 'Arrange', 'Accept', 'Measure'], correct: 'Delay' },
            { prompt: 'Find the word for "a place where books are kept".', answers: ['Library', 'Market', 'Harbor', 'Factory'], correct: 'Library' },
            { prompt: 'Choose the word that means "to improve".', answers: ['Enhance', 'Pause', 'Carry', 'Hide'], correct: 'Enhance' },
            { prompt: 'Select the word for "very bright".', answers: ['Brilliant', 'Silent', 'Heavy', 'Tender'], correct: 'Brilliant' },
            { prompt: 'Which word means "a small amount of light"?', answers: ['Glimmer', 'Storm', 'Tunnel', 'Signal'], correct: 'Glimmer' },
            { prompt: 'Pick the word for "a place to gather and talk".', answers: ['Forum', 'Bridge', 'Bakery', 'Fog'], correct: 'Forum' },
        ],
        hi: [
            { prompt: 'किस शब्द का अर्थ है “सावधानी से देखना”?', answers: ['जाँच', 'संग्रह', 'साँस लेना', 'अनदेखा करना'], correct: 'जाँच' },
            { prompt: '“अचानक डर” का सही शब्द चुनें।', answers: ['घबराहट', 'दीपक', 'तकिया', 'फीत'], correct: 'घबराहट' },
            { prompt: '“नाज़ुक” का अर्थ क्या है?', answers: ['आसानी से टूट जाने वाला', 'बहुत तेज़', 'बहुत धीमा', 'पूरा खाली'], correct: 'आसानी से टूट जाने वाला' },
            { prompt: '“लंबा सफर” के लिए सही शब्द चुनें।', answers: ['यात्रा', 'कुटिया', 'छाया', 'धागा'], correct: 'यात्रा' },
            { prompt: '“टालना” से मेल खाने वाला शब्द चुनें।', answers: ['देर करना', 'व्यवस्थित करना', 'स्वीकार करना', 'मापना'], correct: 'देर करना' },
            { prompt: 'किस शब्द का अर्थ है “पुस्तकों को रखने की जगह”?', answers: ['पुस्तकालय', 'बाज़ार', 'बंदरगाह', 'कारखाना'], correct: 'पुस्तकालय' },
            { prompt: '“बेहतर करना” सही शब्द चुनें।', answers: ['सुधार करना', 'रुकना', 'ले जाना', 'छिपाना'], correct: 'सुधार करना' },
            { prompt: '“बहुत चमकदार” के लिए सही शब्द चुनें।', answers: ['चमकीला', 'शांत', 'भारी', 'कोमल'], correct: 'चमकीला' },
            { prompt: '“थोड़ी सी रोशनी” का शब्द चुनें।', answers: ['झिलमिलाहट', 'तूफ़ान', 'सुरंग', 'सिग्नल'], correct: 'झिलमिलाहट' },
            { prompt: '“बैठकर बोलने की जगह” शब्द चुनें।', answers: ['मंच', 'पुल', 'बेकर', 'कोहरा'], correct: 'मंच' },
        ],
        kn: [
            { prompt: '“ಚೆನ್ನಾಗಿ ಪರಿಶೀಲಿಸುವ” ಪದವನ್ನು ಆರಿಸಿ.', answers: ['ವಿಶ್ಲೇಷಿಸಿ', 'ಸಂಗ್ರಹಿಸಿ', 'ಹೊಗೆಯಿರಿ', 'ಅಗesehen'], correct: 'ವಿಶ್ಲೇಷಿಸಿ' },
            { prompt: '“ಅ sudden ಅಂದರೂ ಭಯ” ಪದ ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಪ್ಯಾನಿಕ್', 'ಲ್ಯಾಂಟರ್ನ್', 'ಸ್ಲೀಪ್', 'ರಿಬ್ಬನ್'], correct: 'ಪ್ಯಾನಿಕ್' },
            { prompt: '“ದೌರ್ಬಲ್ಯ” ಅರ್ಥವೇನು?', answers: ['ಸುಲಭವಾಗಿ ಒಡೆಯುವ', 'ಅತಿ ಶಬ್ದ', 'ಅತಿ ನಿಶ್ಚಲ', 'ಸಂಪೂರ್ಣ ಖಾಲಿ'], correct: 'ಸುಲಭವಾಗಿ ಒಡೆಯುವ' },
            { prompt: '“ಉದ್ದ journey”ನಾರ್ಥದ ಪದ ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಪ್ರಯಾಣ', 'ಕ್ಯಾಬಿನ್', 'ನೆತ್ತೇ', 'ಥ್ರೆಡ್'], correct: 'ಪ್ರಯಾಣ' },
            { prompt: '“ಇತ್ತಿತ್ಥ defer”ಕ್ಕೆ ಸೂಕ್ತ ಪದ ಯಾವುದು?', answers: ['ವಿಲंबನೆ', 'ವ್ಯವಸ್ಥೆ', 'ಸ್ವೀಕಾರ', 'ಅಳತೆ'], correct: 'ವಿಲಂಬನೆ' },
            { prompt: '“ಪುಸ್ತಕಗಳಿರುವ ಸ್ಥಳ” ಪದ ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಗ್ರಂಥಾಲಯ', 'ಮಾರುಕಟ್ಟೆ', 'ಬ harbor', 'ಕಾರ್ಖಾನೆ'], correct: 'ಗ್ರಂಥಾಲಯ' },
        ],
        ta: [
            { prompt: '“கவனமாக ஆராய்வது” என்பதற்கு சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['பரிசோதனை', 'சேகரி', 'சுவாசி', 'புறக்கணி'], correct: 'பரிசோதனை' },
            { prompt: '“கண்மூடித்தனமான பயம்” என்பதற்கு சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['பீதியடைதல்', 'மணி', 'தலையணை', 'குழை'], correct: 'பீதியடைதல்' },
            { prompt: '“நல்லது” என்பதற்கு அர்த்தம் என்ன?', answers: ['எளிதாக உடையும்', 'மிகவும் சத்தமாக', 'மிக மெதுவாக', 'முழுக்க காலியாக'], correct: 'எளிதாக உடையும்' },
            { prompt: '“நீண்ட பயணம்” என்பதற்கு சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['பயணத்தை', 'குடிசை', 'நிழல்', 'துணி'], correct: 'பயணத்தை' },
            { prompt: '“தள்ளிப் போடுவது” அமைந்த சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['தாமதப்படுத்து', 'ஒழுங்குபடுத்து', 'ஏற்று', 'அளவிடு'], correct: 'தாமதப்படுத்து' },
            { prompt: '“புத்தகங்கள் வைக்கப்படும் இடம்” கருத்து?', answers: ['நூலகம்', 'சந்தை', 'துறைமுகம்', 'தொழிற்சாலை'], correct: 'நூலகம்' },
        ],
        te: [
            { prompt: '“జాగ్రత్తగా పరిశీలించటం” అర్థం గల పదాన్ని ఎంచుకోండి.', answers: ['విశ్లేషించండి', 'సేకరించండి', 'శ్వాసించండి', 'చూడకండి'], correct: 'విశ్లేషించండి' },
            { prompt: '“అత్యంత ఒక్కసారి భయం” గల పదాన్ని ఎంచుకోండి.', answers: ['పానిక్', 'లాంతర్', 'తోలు', 'రిబ్బన్'], correct: 'పానిక్' },
            { prompt: '“సున్నితమైన” అర్థం ఏమిటి?', answers: ['సులభంగా పడిపోవడం', 'చాలా శబ్దమైన', 'అత్యంత నెమ్మదైన', 'పూర్తిగా ఖాళీ'], correct: 'సులభంగా పడిపోవడం' },
            { prompt: '“పొడవైన ప్రయాణం”కు సరైన పదం ఎంచుకోండి.', answers: ['ప్రయాణం', 'క్యాబిన్', 'చెరువు', 'థ్రెడ్'], correct: 'ప్రయాణం' },
            { prompt: '“ఆలస్యం చేయడం”కు సరైన పదం ఏది?', answers: ['వాయిదా', 'ఏర్పాటు', 'అంగీకరించు', 'కొలవండి'], correct: 'వాయిదా' },
            { prompt: '“పుస్తకాలు ఉంచే స్థలం” పదాన్ని ఎంచుకోండి.', answers: ['లైబ్రరీ', 'మార్కెట్', 'హార్బర్', 'ఫ్యాక్టరీ'], correct: 'లైబ్రరీ' },
        ],
    }

    const bank = templates[languageCode] || templates.en
    return Array.from({ length: 50 }, (_, index) => ({
        ...bank[index % bank.length],
        id: `archer-${languageCode}-${index + 1}`,
    }))
}

export const buildLocalizedGameBank = (gameId, languageCode) => {
    if (gameId === 'word-hunt') return buildWordHuntTemplates(languageCode)
    if (gameId === 'flip-card') return buildFlipCardTemplates(languageCode)
    if (gameId === 'archer') return buildArcherTemplates(languageCode)
    return []
}

export const getFreshQuestionSet = (gameId, questions, size = 5) => {
    if (!Array.isArray(questions) || questions.length === 0) return []

    const storageKey = `neolit_game_history_${gameId}`
    const rawHistory = (() => {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || '[]')
        } catch {
            return []
        }
    })()

    const seen = new Set(Array.isArray(rawHistory) ? rawHistory : [])
    const remaining = questions.filter((question) => !seen.has(question.id))
    const sourcePool = remaining.length >= size ? remaining : questions
    const nextRound = shuffleGameOptions(sourcePool).slice(0, Math.min(size, sourcePool.length))

    if (remaining.length >= size) {
        const nextHistory = Array.from(new Set([...rawHistory, ...nextRound.map((question) => question.id)]))
        localStorage.setItem(storageKey, JSON.stringify(nextHistory))
        return nextRound
    }

    localStorage.setItem(storageKey, JSON.stringify(nextRound.map((question) => question.id)))
    return nextRound
}
