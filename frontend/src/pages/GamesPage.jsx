import { useEffect, useState } from 'react'

const GAME_LIBRARY_BY_LANGUAGE = {
    en: [
        {
            id: 'match',
            icon: '🔗',
            title: 'Word Match',
            description: 'Connect a word with its meaning.',
            questions: [
                { prompt: 'Which word means "casa"?', answers: ['House', 'Water', 'Book'], correct: 'House' },
                { prompt: 'Which word means "agua"?', answers: ['Food', 'Water', 'Morning'], correct: 'Water' },
                { prompt: 'Which word means "amigo"?', answers: ['Friend', 'Street', 'Window'], correct: 'Friend' },
                { prompt: 'Which word means "escuela"?', answers: ['School', 'Clock', 'Tree'], correct: 'School' },
                { prompt: 'Which word means "sol"?', answers: ['Sun', 'Cloud', 'River'], correct: 'Sun' },
                { prompt: 'Which word means "libro"?', answers: ['Book', 'Phone', 'Door'], correct: 'Book' },
            ],
        },
        {
            id: 'catch',
            icon: '🎯',
            title: 'Catch the Word',
            description: 'Catch the correct word card.',
            type: 'cards',
            questions: [
                { prompt: 'Catch the word for "sol"', answers: ['Sun', 'Moon', 'Rain'], correct: 'Sun' },
                { prompt: 'Catch the word for "livre"', answers: ['Chair', 'Book', 'Door'], correct: 'Book' },
                { prompt: 'Catch the word for "maison"', answers: ['House', 'Bag', 'Light'], correct: 'House' },
                { prompt: 'Catch the word for "agua"', answers: ['Water', 'Sand', 'Stone'], correct: 'Water' },
                { prompt: 'Catch the word for "bonjour"', answers: ['Hello', 'Goodbye', 'Later'], correct: 'Hello' },
                { prompt: 'Catch the word for "merci"', answers: ['Please', 'Thanks', 'Night'], correct: 'Thanks' },
            ],
        },
        {
            id: 'memory',
            icon: '🧠',
            title: 'Memory Pairs',
            description: 'Remember the matching translation.',
            type: 'memory',
            questions: [
                { prompt: 'Find the pair for "bonjour"', answers: ['Hello', 'Goodbye', 'Thanks'], correct: 'Hello' },
                { prompt: 'Find the pair for "gracias"', answers: ['Please', 'Thanks', 'Sorry'], correct: 'Thanks' },
                { prompt: 'Find the pair for "gato"', answers: ['Cat', 'Dog', 'Bird'], correct: 'Cat' },
                { prompt: 'Find the pair for "noche"', answers: ['Night', 'Day', 'Wind'], correct: 'Night' },
                { prompt: 'Find the pair for "mesa"', answers: ['Table', 'Chair', 'Glass'], correct: 'Table' },
                { prompt: 'Find the pair for "camino"', answers: ['Road', 'Cloud', 'Music'], correct: 'Road' },
            ],
        },
        {
            id: 'sentence',
            icon: '🧩',
            title: 'Sentence Builder',
            description: 'Choose the phrase that makes sense.',
            type: 'sentence',
            questions: [
                { prompt: 'Complete: I ___ English.', answers: ['learn', 'blue', 'table'], correct: 'learn' },
                { prompt: 'Complete: She ___ a book.', answers: ['reads', 'green', 'quickly'], correct: 'reads' },
                { prompt: 'Complete: We ___ to school.', answers: ['walk', 'happy', 'cup'], correct: 'walk' },
                { prompt: 'Complete: They ___ lunch together.', answers: ['eat', 'glass', 'soft'], correct: 'eat' },
                { prompt: 'Complete: My friend ___ music.', answers: ['listens', 'tiny', 'stone'], correct: 'listens' },
                { prompt: 'Complete: The sun is ___ today.', answers: ['bright', 'slow', 'under'], correct: 'bright' },
            ],
        },
        {
            id: 'speed',
            icon: '⚡',
            title: 'Speed Quiz',
            description: 'Answer a quick vocabulary challenge.',
            type: 'speed',
            questions: [
                { prompt: 'What is the opposite of "big"?', answers: ['Small', 'Fast', 'Bright'], correct: 'Small' },
                { prompt: 'What is the opposite of "cold"?', answers: ['Warm', 'Slow', 'Quiet'], correct: 'Warm' },
                { prompt: 'What is the opposite of "day"?', answers: ['Night', 'Tree', 'Soft'], correct: 'Night' },
                { prompt: 'What is the opposite of "cheap"?', answers: ['Expensive', 'Short', 'Easy'], correct: 'Expensive' },
                { prompt: 'What is the opposite of "old"?', answers: ['New', 'Strong', 'Wide'], correct: 'New' },
                { prompt: 'What is the opposite of "hard"?', answers: ['Easy', 'Large', 'Upper'], correct: 'Easy' },
            ],
        },
    ],
    hi: [
        {
            id: 'match',
            icon: '🔗',
            title: 'शब्द मिलान',
            description: 'शब्द और उसके अर्थ को जोड़ें।',
            questions: [
                { prompt: '"casa" का सही अर्थ चुनें?', answers: ['घर', 'पानी', 'किताब'], correct: 'घर' },
                { prompt: '"agua" का सही अर्थ चुनें?', answers: ['भोजन', 'पानी', 'सुबह'], correct: 'पानी' },
                { prompt: '"amigo" का सही अर्थ चुनें?', answers: ['दोस्त', 'सड़क', 'खिड़की'], correct: 'दोस्त' },
                { prompt: '"escuela" का सही अर्थ चुनें?', answers: ['स्कूल', 'घड़ी', 'पेड़'], correct: 'स्कूल' },
                { prompt: '"sol" का सही अर्थ चुनें?', answers: ['सूर्य', 'बादल', 'नदी'], correct: 'सूर्य' },
                { prompt: '"libro" का सही अर्थ चुनें?', answers: ['किताब', 'फोन', 'दरवाज़ा'], correct: 'किताब' },
            ],
        },
        {
            id: 'catch',
            icon: '🎯',
            title: 'शब्द पकड़ें',
            description: 'सही शब्द कार्ड चुनें।',
            type: 'cards',
            questions: [
                { prompt: '"sol" का सही शब्द चुनें', answers: ['सूर्य', 'चाँद', 'बारिश'], correct: 'सूर्य' },
                { prompt: '"livre" का सही शब्द चुनें', answers: ['कुर्सी', 'किताब', 'दरवाज़ा'], correct: 'किताब' },
                { prompt: '"maison" का सही शब्द चुनें', answers: ['घर', 'बैग', 'लाइट'], correct: 'घर' },
                { prompt: '"agua" का सही शब्द चुनें', answers: ['पानी', 'रेत', 'पत्थर'], correct: 'पानी' },
                { prompt: '"bonjour" का सही शब्द चुनें', answers: ['नमस्ते', 'अलविदा', 'बाद में'], correct: 'नमस्ते' },
                { prompt: '"merci" का सही शब्द चुनें', answers: ['कृपया', 'धन्यवाद', 'रात'], correct: 'धन्यवाद' },
            ],
        },
        {
            id: 'memory',
            icon: '🧠',
            title: 'मेमोरी जोड़ियाँ',
            description: 'सही अनुवाद याद रखें।',
            type: 'memory',
            questions: [
                { prompt: '"bonjour" का सही जोड़ चुनें', answers: ['नमस्ते', 'अलविदा', 'धन्यवाद'], correct: 'नमस्ते' },
                { prompt: '"gracias" का सही जोड़ चुनें', answers: ['कृपया', 'धन्यवाद', 'माफ़ कीजिए'], correct: 'धन्यवाद' },
                { prompt: '"gato" का सही जोड़ चुनें', answers: ['बिल्ली', 'कुत्ता', 'चिड़िया'], correct: 'बिल्ली' },
                { prompt: '"noche" का सही जोड़ चुनें', answers: ['रात', 'दिन', 'हवा'], correct: 'रात' },
                { prompt: '"mesa" का सही जोड़ चुनें', answers: ['मेज़', 'कुर्सी', 'गिलास'], correct: 'मेज़' },
                { prompt: '"camino" का सही जोड़ चुनें', answers: ['सड़क', 'बादल', 'संगीत'], correct: 'सड़क' },
            ],
        },
        {
            id: 'sentence',
            icon: '🧩',
            title: 'वाक्य बनाओ',
            description: 'सही वाक्य चुनें।',
            type: 'sentence',
            questions: [
                { prompt: 'पूरा करें: मैं ___ अंग्रेज़ी सीखता हूँ।', answers: ['सीखता', 'नीला', 'मेज़'], correct: 'सीखता' },
                { prompt: 'पूरा करें: वह एक किताब ___।', answers: ['पढ़ती है', 'हरा', 'तेज़'], correct: 'पढ़ती है' },
                { prompt: 'पूरा करें: हम स्कूल ___ जाते हैं।', answers: ['चलकर', 'खुश', 'कप'], correct: 'चलकर' },
                { prompt: 'पूरा करें: वे साथ में ___ खाते हैं।', answers: ['भोजन', 'गिलास', 'मुलायम'], correct: 'भोजन' },
                { prompt: 'पूरा करें: मेरा दोस्त संगीत ___।', answers: ['सुनता है', 'छोटा', 'पत्थर'], correct: 'सुनता है' },
                { prompt: 'पूरा करें: आज सूरज ___ है।', answers: ['उजला', 'धीमा', 'नीचे'], correct: 'उजला' },
            ],
        },
        {
            id: 'speed',
            icon: '⚡',
            title: 'स्पीड क्विज़',
            description: 'तेज़ शब्द चुनौती का उत्तर दें।',
            type: 'speed',
            questions: [
                { prompt: '"big" का विलोम क्या है?', answers: ['छोटा', 'तेज़', 'उजला'], correct: 'छोटा' },
                { prompt: '"cold" का विलोम क्या है?', answers: ['गर्म', 'धीमा', 'शांत'], correct: 'गर्म' },
                { prompt: '"day" का विलोम क्या है?', answers: ['रात', 'पेड़', 'मुलायम'], correct: 'रात' },
                { prompt: '"cheap" का विलोम क्या है?', answers: ['महँगा', 'कम', 'आसान'], correct: 'महँगा' },
                { prompt: '"old" का विलोम क्या है?', answers: ['नया', 'मज़बूत', 'चौड़ा'], correct: 'नया' },
                { prompt: '"hard" का विलोम क्या है?', answers: ['आसान', 'बड़ा', 'ऊपरी'], correct: 'आसान' },
            ],
        },
    ],
    kn: [
        {
            id: 'match',
            icon: '🔗',
            title: 'ಪದ ಜೋಡಣೆ',
            description: 'ಪದ ಮತ್ತು ಅರ್ಥವನ್ನು ಹೊಂದಿಸಿ.',
            questions: [
                { prompt: '"casa" ಎಂಬ ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥ ಯಾವುದು?', answers: ['ಮನೆ', 'ನೀರು', 'ಪುಸ್ತಕ'], correct: 'ಮನೆ' },
                { prompt: '"agua" ಎಂಬ ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥ ಯಾವುದು?', answers: ['ಆಹಾರ', 'ನೀರು', 'ಸಂಜೆ'], correct: 'ನೀರು' },
                { prompt: '"amigo" ಎಂಬ ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥ ಯಾವುದು?', answers: ['ಮಿತ್ರ', 'ರಸ್ತೆ', 'ಕಿಟಕಿ'], correct: 'ಮಿತ್ರ' },
                { prompt: '"escuela" ಎಂಬ ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥ ಯಾವುದು?', answers: ['ಪಾಠಶाला', 'ಗಡಿಯಾರ', 'ಮರ'], correct: 'ಪಾಠಶಾಲೆ' },
                { prompt: '"sol" ಎಂಬ ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥ ಯಾವುದು?', answers: ['ಸೂರ್ಯ', 'ಮೋಡ', 'ನದಿ'], correct: 'ಸೂರ್ಯ' },
                { prompt: '"libro" ಎಂಬ ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥ ಯಾವುದು?', answers: ['ಪುಸ್ತಕ', 'ಫೋನ್', 'ಬಾಗಿಲು'], correct: 'ಪುಸ್ತಕ' },
            ],
        },
        {
            id: 'catch',
            icon: '🎯',
            title: 'ಪದ ಹಿಡಿಯಿರಿ',
            description: 'ಸರಿಯಾದ ಪದ ಕಾರ್ಡನ್ನು பிடಿಯಿರಿ.',
            type: 'cards',
            questions: [
                { prompt: '"sol" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಯಾವುದು?', answers: ['ಸೂರ್ಯ', 'ಚಂದ್ರ', 'ಮಳೆ'], correct: 'ಸೂರ್ಯ' },
                { prompt: '"livre" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಯಾವುದು?', answers: ['ಕುರ್ಚಿ', 'ಪುಸ್ತಕ', 'ಬಾಗಿಲು'], correct: 'ಪುಸ್ತಕ' },
                { prompt: '"maison" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಯಾವುದು?', answers: ['ಮನೆ', 'ಬ್ಯಾಗ್', 'ಲೈಟ್'], correct: 'ಮನೆ' },
                { prompt: '"agua" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಯಾವುದು?', answers: ['ನೀರು', 'ಮಣ್ಣು', 'ಕಲ್ಲು'], correct: 'ನೀರು' },
                { prompt: '"bonjour" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಯಾವುದು?', answers: ['ಹಲೋ', 'ಅಲविदಾ', 'ನಂತರ'], correct: 'ಹಲೋ' },
                { prompt: '"merci" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಯಾವುದು?', answers: ['ದಯವಿಟ್ಟು', 'ಧನ್ಯವಾದಗಳು', 'ರಾತ್ರಿ'], correct: 'ಧನ್ಯವಾದಗಳು' },
            ],
        },
        {
            id: 'memory',
            icon: '🧠',
            title: 'ಮೆಮೊರಿ ಜೋಡಿಗಳು',
            description: 'ಸರಿಯಾದ ಅನುವಾದವನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ.',
            type: 'memory',
            questions: [
                { prompt: '"bonjour" ರ ಸರಿಯಾದ ಜೋಡಿಯನ್ನು ಹುಡುಕಿ', answers: ['ಹಲೋ', 'ಅಲविदಾ', 'ಧನ್ಯವಾದ'], correct: 'ಹಲೋ' },
                { prompt: '"gracias" ರ ಸರಿಯಾದ ಜೋಡಿಯನ್ನು ಹುಡುಕಿ', answers: ['ದಯವಿಟ್ಟು', 'ಧನ್ಯವಾದ', 'ಕ್ಷಮಿಸಿ'], correct: 'ಧನ್ಯವಾದ' },
                { prompt: '"gato" ರ ಸರಿಯಾದ ಜೋಡಿಯನ್ನು ಹುಡುಕಿ', answers: ['ಬೆಕ್ಕು', 'ನಾಯಿ', 'ಪಕ್ಷಿ'], correct: 'ಬೆಕ್ಕು' },
                { prompt: '"noche" ರ ಸರಿಯಾದ ಜೋಡಿಯನ್ನು ಹುಡುಕಿ', answers: ['ರಾತ್ರಿ', 'ದಿನ', 'ಗಾಳಿ'], correct: 'ರಾತ್ರಿ' },
                { prompt: '"mesa" ರ ಸರಿಯಾದ ಜೋಡಿಯನ್ನು ಹುಡುಕಿ', answers: ['ಮೇಜ್', 'ಕುರ್ಚಿ', 'ಗ್ಲಾಸ್'], correct: 'ಮೇಜ್' },
                { prompt: '"camino" ರ ಸರಿಯಾದ ಜೋಡಿಯನ್ನು ಹುಡುಕಿ', answers: ['ರಸ್ತೆ', 'ಮೋಡ', 'ಸಂಗೀತ'], correct: 'ರಸ್ತೆ' },
            ],
        },
        {
            id: 'sentence',
            icon: '🧩',
            title: 'ವಾಕ್ಯ ನಿರ್ಮಾಣ',
            description: 'ಅರ್ಥಪೂರ್ಣ ವಾಕ್ಯ ಆಯ್ಕೆ ಮಾಡಿ.',
            type: 'sentence',
            questions: [
                { prompt: 'ಪೂರ್ತಿಗೊಳಿಸಿ: ನಾನು ___ ಇಂಗ್ಲಿಷ್ ಕಲಿಯುತ್ತೇನೆ.', answers: ['ಕಲಿಯುತ್ತೇನೆ', 'ತಪ್ಪು', 'ಕೋಶ'], correct: 'ಕಲಿಯುತ್ತೇನೆ' },
                { prompt: 'ಪೂರ್ತಿಗೊಳಿಸಿ: ಅವಳು ಒಂದು ಪುಸ್ತಕ ___।', answers: ['ಓದುತ್ತಾಳೆ', 'ಹಸಿರು', 'ವೇಗವಾಗಿ'], correct: 'ಓದುತ್ತಾಳೆ' },
                { prompt: 'ಪೂರ್ತಿಗೊಳಿಸಿ: ನಾವು ಶಾಲೆಗೆ ___ ಹೋಗುತ್ತೇವೆ.', answers: ['ಹೋಗುತ್ತೇವೆ', 'ಸಮೃದ್ಧ', 'ಕೆಪ್ಪು'], correct: 'ಹೋಗುತ್ತೇವೆ' },
                { prompt: 'ಪೂರ್ತಿಗೊಳಿಸಿ: ಇವರು ಒಟ್ಟಿಗೆ ___ ಮಾಡುತ್ತಾರೆ.', answers: ['ಭೋಜನ', 'ಗ್ಲಾಸ್', 'ಮೃದು'], correct: 'ಭೋಜನ' },
                { prompt: 'ಪೂರ್ತಿಗೊಳಿಸಿ: ನನ್ನ ಸ್ನೇಹಿತ ___ ಸಂಗೀತ ಕೇಳುತ್ತಾನೆ.', answers: ['ಕೇಳುತ್ತಾನೆ', 'ಚಿಕ್ಕ', 'ಕಲ್ಲು'], correct: 'ಕೇಳುತ್ತಾನೆ' },
                { prompt: 'ಪೂರ್ತಿಗೊಳಿಸಿ: ಇಂದು ಸೂರ್ಯ ___ ಇದೆ.', answers: ['ಪ್ರಕಾಶಮಾನ', 'ನೀಳ', 'ಕೆಳಗೆ'], correct: 'ಪ್ರಕಾಶಮಾನ' },
            ],
        },
        {
            id: 'speed',
            icon: '⚡',
            title: 'ಸ್ಪೀಡ್ ಕ್ವಿಜ್',
            description: 'ತ್ವರಿತ ಶಬ್ದದ ಸವಾಲನ್ನು ಉತ್ತರಿಸಿ.',
            type: 'speed',
            questions: [
                { prompt: '"big" ಗೆ ವಿರುದ್ಧವಾದ ಪದ ಯಾವುದು?', answers: ['ಚಿಕ್ಕ', 'ವೇಗದ', 'ಪ್ರಕಾಶಮಾನ'], correct: 'ಚಿಕ್ಕ' },
                { prompt: '"cold" ಗೆ ವಿರುದ್ಧವಾದ ಪದ ಯಾವುದು?', answers: ['ಬಿಸಿಲು', 'ನೆಗೆಯ', 'ಶಾಂತ'], correct: 'ಬಿಸಿಲು' },
                { prompt: '"day" ಗೆ ವಿರುದ್ಧವಾದ ಪದ ಯಾವುದು?', answers: ['ರಾತ್ರಿ', 'ಮರ', 'ಮೃದು'], correct: 'ರಾತ್ರಿ' },
                { prompt: '"cheap" ಗೆ ವಿರುದ್ಧವಾದ ಪದ ಯಾವುದು?', answers: ['ಮೂಲ್ಯವಂತ', 'ಕಿರಿದಾದ', 'ಸುಲಭ'], correct: 'ಮೂಲ್ಯವಂತ' },
                { prompt: '"old" ಗೆ ವಿರುದ್ಧವಾದ ಪದ ಯಾವುದು?', answers: ['ಹೊಸ', 'ಬಲಿಷ್ಠ', 'ವ್ಯಾಪಕ'], correct: 'ಹೊಸ' },
                { prompt: '"hard" ಗೆ ವಿರುದ್ಧವಾದ ಪದ ಯಾವುದು?', answers: ['ಸುಲಭ', 'ದೊಡ್ಡ', 'ಮೇಲೆ'], correct: 'ಸುಲಭ' },
            ],
        },
    ],
    ta: [
        {
            id: 'match',
            icon: '🔗',
            title: 'சொல் பொருத்தம்',
            description: 'சொல்லை அதன் அர்த்தத்துடன் இணைக்கவும்.',
            questions: [
                { prompt: '"casa" என்ற சொல்லின் அர்த்தம் என்ன?', answers: ['வீடு', 'தண்ணீர்', 'புத்தகம்'], correct: 'வீடு' },
                { prompt: '"agua" என்ற சொல்லின் அர்த்தம் என்ன?', answers: ['சாப்பாடு', 'தண்ணீர்', 'மறுநாள்'], correct: 'தண்ணீர்' },
                { prompt: '"amigo" என்ற சொல்லின் அர்த்தம் என்ன?', answers: ['நண்பர்', 'தெரு', 'ஜன்னல்'], correct: 'நண்பர்' },
                { prompt: '"escuela" என்ற சொல்லின் அர்த்தம் என்ன?', answers: ['பள்ளி', 'கடிகாரம்', 'மரம்'], correct: 'பள்ளி' },
                { prompt: '"sol" என்ற சொல்லின் அர்த்தம் என்ன?', answers: ['சூரியன்', 'முகில்', 'ஆறு'], correct: 'சூரியன்' },
                { prompt: '"libro" என்ற சொல்லின் அர்த்தம் என்ன?', answers: ['புத்தகம்', 'தொலைபேசி', 'கதவு'], correct: 'புத்தகம்' },
            ],
        },
        {
            id: 'catch',
            icon: '🎯',
            title: 'சொல் பிடியுங்கள்',
            description: 'சரியான சொல் அட்டையை பிடியுங்கள்.',
            type: 'cards',
            questions: [
                { prompt: '"sol" க்கான சரியான சொல் எது?', answers: ['சூரியன்', 'சந்திரன்', 'மழை'], correct: 'சூரியன்' },
                { prompt: '"livre" க்கான சரியான சொல் எது?', answers: ['நாற்காலி', 'புத்தகம்', 'கதவு'], correct: 'புத்தகம்' },
                { prompt: '"maison" க்கான சரியான சொல் எது?', answers: ['வீடு', 'பை', 'விளக்கு'], correct: 'வீடு' },
                { prompt: '"agua" க்கான சரியான சொல் எது?', answers: ['தண்ணீர்', 'மணல்', 'கல்'], correct: 'தண்ணீர்' },
                { prompt: '"bonjour" க்கான சரியான சொல் எது?', answers: ['வணக்கம்', 'விடைபெறுகிறேன்', 'பின்னர்'], correct: 'வணக்கம்' },
                { prompt: '"merci" க்கான சரியான சொல் எது?', answers: ['தயவுசெய்து', 'நன்றி', 'இரவு'], correct: 'நன்றி' },
            ],
        },
        {
            id: 'memory',
            icon: '🧠',
            title: 'நினைவுப் ஜோடிகள்',
            description: 'சரியான மொழிபெயர்ப்பை நினைவில் கொள்ளுங்கள்.',
            type: 'memory',
            questions: [
                { prompt: '"bonjour" க்கான சரியான ஜோடியை தேர்ந்தெடுக்கவும்', answers: ['வணக்கம்', 'விடைபெறுகிறேன்', 'நன்றி'], correct: 'வணக்கம்' },
                { prompt: '"gracias" க்கான சரியான ஜோடியை தேர்ந்தெடுக்கவும்', answers: ['தயவுசெய்து', 'நன்றி', 'மன்னிக்கவும்'], correct: 'நன்றி' },
                { prompt: '"gato" க்கான சரியான ஜோடியை தேர்ந்தெடுக்கவும்', answers: ['பூனை', 'நாய்', 'பறவை'], correct: 'பூனை' },
                { prompt: '"noche" க்கான சரியான ஜோடியை தேர்ந்தெடுக்கவும்', answers: ['இரவு', 'முன்னணி', 'காற்று'], correct: 'இரவு' },
                { prompt: '"mesa" க்கான சரியான ஜோடியை தேர்ந்தெடுக்கவும்', answers: ['மேசை', 'நாற்காலி', 'கண்ணாடி'], correct: 'மேசை' },
                { prompt: '"camino" க்கான சரியான ஜோடியை தேர்ந்தெடுக்கவும்', answers: ['சாலை', 'முகில்', 'இசை'], correct: 'சாலை' },
            ],
        },
        {
            id: 'sentence',
            icon: '🧩',
            title: 'வாக்கியம் உருவாக்கம்',
            description: 'பொருத்தமான சொற்றொடரை தேர்ந்தெடுக்கவும்.',
            type: 'sentence',
            questions: [
                { prompt: 'முழுமைப்படுத்துக: நான் ___ ஆங்கிலம் கற்கிறேன்.', answers: ['கற்கிறேன்', 'நீலம்', 'மேசை'], correct: 'கற்கிறேன்' },
                { prompt: 'முழுமைப்படுத்துக: அவள் ஒரு புத்தகத்தை ___.', answers: ['படிக்கிறாள்', 'பச்சை', 'வேகமாக'], correct: 'படிக்கிறாள்' },
                { prompt: 'முழுமைப்படுத்துக: நாங்கள் பள்ளிக்கு ___ செல்கிறோம்.', answers: ['செல்கிறோம்', 'மகிழ்ச்சி', 'கோப்பை'], correct: 'செல்கிறோம்' },
                { prompt: 'முழுமைப்படுத்துக: அவர்கள் ஒன்றாக ___ சாப்பிடுகிறார்கள்.', answers: ['சாப்பாடு', 'கண்ணாடி', 'மென்மையான'], correct: 'சாப்பாடு' },
                { prompt: 'முழுமைப்படுத்துக: என் நண்பர் இசையை ___.', answers: ['கேட்கிறார்', 'சிறிய', 'கல்'], correct: 'கேட்கிறார்' },
                { prompt: 'முழுமைப்படுத்துக: இன்று சூரியன் ___.', answers: ['ஒளிர்கிறது', 'மெதுவாக', 'கீழே'], correct: 'ஒளிர்கிறது' },
            ],
        },
        {
            id: 'speed',
            icon: '⚡',
            title: 'ஸ்பீட் குவீசு',
            description: 'விரைவான சொல்லாடல் சவாலை தீர்க்கவும்.',
            type: 'speed',
            questions: [
                { prompt: '"big"-க்கு எதிர்ச்சொல் என்ன?', answers: ['சிறிய', 'வேகமான', 'பிரகாசமான'], correct: 'சிறிய' },
                { prompt: '"cold"-க்கு எதிர்ச்சொல் என்ன?', answers: ['சூடான', 'மெதுவான', 'அமைதியான'], correct: 'சூடான' },
                { prompt: '"day"-க்கு எதிர்ச்சொல் என்ன?', answers: ['இரவு', 'மரம்', 'மென்மையான'], correct: 'இரவு' },
                { prompt: '"cheap"-க்கு எதிர்ச்சொல் என்ன?', answers: ['மிகக் விலை உயர்ந்த', 'குறுகிய', 'எளிதான'], correct: 'மிகக் விலை உயர்ந்த' },
                { prompt: '"old"-க்கு எதிர்ச்சொல் என்ன?', answers: ['புதிய', 'வலிமையான', 'விரிந்த'], correct: 'புதிய' },
                { prompt: '"hard"-க்கு எதிர்ச்சொல் என்ன?', answers: ['எளிதான', 'பெரிய', 'மேல்'], correct: 'எளிதான' },
            ],
        },
    ],
    te: [
        {
            id: 'match',
            icon: '🔗',
            title: 'పద జతపరచండి',
            description: 'పదాన్ని దాని అర్థంతో జతపరచండి.',
            questions: [
                { prompt: '"casa" పదానికి సరైన అర్థం ఏది?', answers: ['ఇల్లు', 'నీరు', 'పుస్తకం'], correct: 'ఇల్లు' },
                { prompt: '"agua" పదానికి సరైన అర్థం ఏది?', answers: ['ఆహారం', 'నీరు', 'మరుసటి రోజు'], correct: 'నీరు' },
                { prompt: '"amigo" పదానికి సరైన అర్థం ఏది?', answers: ['స్నేహితుడు', 'వీధి', 'కిటికీ'], correct: 'స్నేహితుడు' },
                { prompt: '"escuela" పదానికి సరైన అర్థం ఏది?', answers: ['పాఠశాల', 'గడియారం', 'చెట్టు'], correct: 'పాఠశాల' },
                { prompt: '"sol" పదానికి సరైన అర్థం ఏది?', answers: ['సూర్యుడు', 'మేఘం', 'నది'], correct: 'సూర్యుడు' },
                { prompt: '"libro" పదానికి సరైన అర్థం ఏది?', answers: ['పుస్తకం', 'ఫోన్', 'కవరు'], correct: 'పుస్తకం' },
            ],
        },
        {
            id: 'catch',
            icon: '🎯',
            title: 'పదాన్ని పట్టండి',
            description: 'సరైన పద కార్డును పట్టండి.',
            type: 'cards',
            questions: [
                { prompt: '"sol" కోసం సరైన పదం ఏది?', answers: ['సూర్యుడు', 'చంద్రుడు', 'వర్షం'], correct: 'సూర్యుడు' },
                { prompt: '"livre" కోసం సరైన పదం ఏది?', answers: ['కుర్చీ', 'పుస్తకం', 'తలుపు'], correct: 'పుస్తకం' },
                { prompt: '"maison" కోసం సరైన పదం ఏది?', answers: ['ఇల్లు', 'బ్యాగ్', 'లైట్'], correct: 'ఇల్లు' },
                { prompt: '"agua" కోసం సరైన పదం ఏది?', answers: ['నీరు', 'ఇసుక', 'రాయి'], correct: 'నీరు' },
                { prompt: '"bonjour" కోసం సరైన పదం ఏది?', answers: ['హలో', 'వేడితో', 'తర్వాత'], correct: 'హలో' },
                { prompt: '"merci" కోసం సరైన పదం ఏది?', answers: ['దయచేసి', 'ధన్యవాదాలు', 'రాత్రి'], correct: 'ధన్యవాదాలు' },
            ],
        },
        {
            id: 'memory',
            icon: '🧠',
            title: 'మెమోరీ జతలు',
            description: 'సరైన అనువాదాన్ని గుర్తించండి.',
            type: 'memory',
            questions: [
                { prompt: '"bonjour"కు సరైన జతను ఎంచుకోండి', answers: ['హలో', 'విదాయ', 'ధన్యవాదాలు'], correct: 'హలో' },
                { prompt: '"gracias"కు సరైన జతను ఎంచుకోండి', answers: ['దయచేసి', 'ధన్యవాదాలు', 'మన్నించండి'], correct: 'ధన్యవాదాలు' },
                { prompt: '"gato"కు సరైన జతను ఎంచుకోండి', answers: ['పిల్లి', 'కుక్క', 'పక్షి'], correct: 'పిల్లి' },
                { prompt: '"noche"కు సరైన జతను ఎంచుకోండి', answers: ['రాత్రి', 'రోజు', 'గాలి'], correct: 'రాత్రి' },
                { prompt: '"mesa"కు సరైన జతను ఎంచుకోండి', answers: ['మేజా', 'కుర్చీ', 'గ్లాస్'], correct: 'మేజా' },
                { prompt: '"camino"కు సరైన జతను ఎంచుకోండి', answers: ['వీధి', 'మేఘం', 'సంగీతం'], correct: 'వీధి' },
            ],
        },
        {
            id: 'sentence',
            icon: '🧩',
            title: 'వాక్య నిర్మాణం',
            description: 'అర్థవంతమైన పదబంధాన్ని ఎంచుకోండి.',
            type: 'sentence',
            questions: [
                { prompt: 'పూర్తి చేయండి: నేను ___ ఇంగ్లీషు నేర్చుకుంటున్నాను.', answers: ['నేర్చుకుంటున్నాను', 'నీలం', 'మేజా'], correct: 'నేర్చుకుంటున్నాను' },
                { prompt: 'పూర్తి చేయండి: ఆమె ఒక పుస్తకం ___.', answers: ['చదువుతుంది', 'ఆకుపచ్చ', 'వేగంగా'], correct: 'చదువుతుంది' },
                { prompt: 'పూర్తి చేయండి: మేము స్కూల్కి ___ వెళ్తాము.', answers: ['వెళ్తాము', 'సంతోషం', 'కప్పు'], correct: 'వెళ్తాము' },
                { prompt: 'పూర్తి చేయండి: వాళ్లు ఒకచోట ___ తీసుకుంటారు.', answers: ['ఆహారం', 'గ్లాస్', 'మృదువైన'], correct: 'ఆహారం' },
                { prompt: 'పూర్తి చేయండి: నా స్నేహితుడు సంగీతం ___.', answers: ['వినుతాడు', 'చిన్న', 'రాయి'], correct: 'వినుతాడు' },
                { prompt: 'పూర్తి చేయండి: ఈరోజు సూర్యుడు ___ ఉంది.', answers: ['ప్రకాశవంతంగా', 'నెమ్మదిగా', 'కింద'], correct: 'ప్రకాశవంతంగా' },
            ],
        },
        {
            id: 'speed',
            icon: '⚡',
            title: 'స్పీడ్ క్విజ్',
            description: 'వేగవంతమైన పదజాల సవాలు.',
            type: 'speed',
            questions: [
                { prompt: '"big"కు విరుద్ధ పదం ఏది?', answers: ['చిన్న', 'వేగంగా', 'ప్రకాశవంతంగా'], correct: 'చిన్న' },
                { prompt: '"cold"కు విరుద్ధ పదం ఏది?', answers: ['ఎండగా', 'నెమ్మదిగా', 'నిశ్శబ్దంగా'], correct: 'ఎండగా' },
                { prompt: '"day"కు విరుద్ధ పదం ఏది?', answers: ['రాత్రి', 'చెట్టు', 'మృదువుగా'], correct: 'రాత్రి' },
                { prompt: '"cheap"కు విరుద్ధ పదం ఏది?', answers: ['ధనిక', 'చిన్న', 'సులభం'], correct: 'ధనిక' },
                { prompt: '"old"కు విరుద్ధ పదం ఏది?', answers: ['కొత్త', 'బలమైన', 'విస్తృతంగా'], correct: 'కొత్త' },
                { prompt: '"hard"కు విరుద్ధ పదం ఏది?', answers: ['సులభం', 'పెద్ద', 'పైకి'], correct: 'సులభం' },
            ],
        },
    ],
}

const getGameLibrary = (languageCode) => GAME_LIBRARY_BY_LANGUAGE[languageCode] || GAME_LIBRARY_BY_LANGUAGE.en
const shuffleQuestions = (items) => [...items].sort(() => Math.random() - 0.5)

export default function GamesPage() {
    const [languageCode, setLanguageCode] = useState(() => localStorage.getItem('neolit_selected_language') || 'en')
    const games = getGameLibrary(languageCode)
    const [selectedId, setSelectedId] = useState(games[0].id)
    const [answer, setAnswer] = useState('')
    const [score, setScore] = useState(0)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(12)
    const [questionOrder, setQuestionOrder] = useState(() => shuffleQuestions(games[0].questions))
    const [fallingWords, setFallingWords] = useState([])
    const [memorySelection, setMemorySelection] = useState([])
    const [sentenceWords, setSentenceWords] = useState([])

    useEffect(() => {
        const syncLanguage = () => {
            const nextLanguage = localStorage.getItem('neolit_selected_language') || 'en'
            setLanguageCode(nextLanguage)
        }

        syncLanguage()
        window.addEventListener('neolit-course-changed', syncLanguage)
        window.addEventListener('storage', syncLanguage)
        return () => {
            window.removeEventListener('neolit-course-changed', syncLanguage)
            window.removeEventListener('storage', syncLanguage)
        }
    }, [])

    useEffect(() => {
        const nextGames = getGameLibrary(languageCode)
        setSelectedId((current) => (nextGames.some((game) => game.id === current) ? current : nextGames[0].id))
        setAnswer('')
        setQuestionIndex(0)
        setTimeLeft(12)
    }, [languageCode])

    const selectedGame = games.find((game) => game.id === selectedId) || games[0]
    const question = questionOrder[questionIndex % questionOrder.length] || selectedGame.questions[0]

    useEffect(() => {
        const nextOrder = shuffleQuestions(selectedGame.questions)
        setQuestionOrder(nextOrder)
        setQuestionIndex(0)
        setAnswer('')
        setMemorySelection([])
        setSentenceWords([])
        setTimeLeft(12)
    }, [selectedGame])

    useEffect(() => {
        if (selectedGame.type !== 'cards') {
            setFallingWords([])
            return
        }

        const freshWords = question.answers.map((choice, index) => ({
            id: `${choice}-${index}-${question.prompt}`,
            text: choice,
            x: 12 + ((index * 26) % 72),
            y: -18 - (index * 14),
            speed: 1.1 + (index * 0.35) + Math.random() * 0.4,
        }))

        setFallingWords(freshWords)
    }, [selectedGame.type, question.answers, question.prompt])

    useEffect(() => {
        if (answer || selectedGame.type !== 'cards') {
            return undefined
        }

        const intervalId = window.setInterval(() => {
            setFallingWords((current) => {
                const updated = current
                    .map((word) => ({ ...word, y: word.y + word.speed }))
                    .filter((word) => word.y < 94)

                if (updated.some((word) => word.y >= 82)) {
                    setAnswer('timeout')
                }

                return updated
            })
        }, 50)

        return () => window.clearInterval(intervalId)
    }, [selectedGame.type, answer])

    useEffect(() => {
        if (answer) {
            return undefined
        }

        const timer = window.setInterval(() => {
            setTimeLeft((current) => {
                if (current <= 1) {
                    window.clearInterval(timer)
                    setAnswer('timeout')
                    return 0
                }

                return current - 1
            })
        }, 1000)

        return () => window.clearInterval(timer)
    }, [answer, questionIndex, selectedGame.id])

    const chooseGame = (gameId) => {
        const nextGame = games.find((game) => game.id === gameId) || games[0]
        setSelectedId(nextGame.id)
        setAnswer('')
        setQuestionIndex(0)
        setTimeLeft(12)
    }

    const chooseAnswer = (choice) => {
        if (answer) return

        const isCorrect = choice === question.correct
        setAnswer(choice)
        if (isCorrect) setScore((current) => current + 10)
    }

    const catchWord = (choice) => {
        if (answer) return

        const isCorrect = choice === question.correct
        setAnswer(choice)
        if (isCorrect) setScore((current) => current + 10)
    }

    const handleMemoryChoice = (choice) => {
        if (answer) return

        setMemorySelection((current) => [...current, choice].slice(-2))
        chooseAnswer(choice)
    }

    const handleSentenceChoice = (choice) => {
        if (answer) return
        setSentenceWords([choice])
        chooseAnswer(choice)
    }

    const nextQuestion = () => {
        setQuestionIndex((current) => (current + 1) % questionOrder.length)
        setAnswer('')
        setMemorySelection([])
        setSentenceWords([])
        setTimeLeft(12)
    }

    return (
        <main className="games-page">
            <section className="games-selector" aria-label="Choose a game">
                <div className="games-selector-heading">
                    <span className="games-kicker">Choose a mode</span>
                    <small>Switch game</small>
                </div>
                <div className="games-grid">
                    {games.map((game) => (
                        <button key={game.id} type="button" className={`game-card ${selectedId === game.id ? 'active' : ''}`} onClick={() => chooseGame(game.id)}>
                            <span className="game-card-icon">{game.icon}</span>
                            <strong>{game.title}</strong>
                            <small>{game.description}</small>
                        </button>
                    ))}
                </div>
            </section>

            <section className="game-board">
                <div className="game-board-heading">
                    <span className="games-kicker active-mode">{selectedGame.icon} {selectedGame.title}</span>
                    <span>+10 pts</span>
                </div>
                <p className="game-board-description">{selectedGame.description}</p>
                <div className="game-meta-row">
                    <span className="game-question-count">Question {Math.min(questionIndex + 1, selectedGame.questions.length)}/{selectedGame.questions.length}</span>
                    <span className={`game-timer ${timeLeft <= 4 ? 'warning' : ''}`}>{timeLeft}s</span>
                </div>
                <h2>{question.prompt}</h2>

                {selectedGame.type === 'cards' ? (
                    <div className="catch-word-stage" aria-label="Catch the correct word">
                        <div className="catch-word-zone">
                            {fallingWords.map((word) => (
                                <button
                                    key={word.id}
                                    type="button"
                                    className={`catch-word-card ${answer === word.text ? (word.text === question.correct ? 'correct' : 'wrong') : ''}`}
                                    style={{ left: `${word.x}%`, top: `${word.y}%` }}
                                    onClick={() => catchWord(word.text)}
                                >
                                    {word.text}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : selectedGame.type === 'memory' ? (
                    <div className="memory-grid">
                        {question.answers.map((choice) => {
                            const isVisible = memorySelection.includes(choice) || answer === choice
                            return (
                                <button
                                    key={choice}
                                    type="button"
                                    className={`memory-card ${isVisible ? 'visible' : ''} ${answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => handleMemoryChoice(choice)}
                                >
                                    {isVisible ? choice : '◈'}
                                </button>
                            )
                        })}
                    </div>
                ) : selectedGame.type === 'sentence' ? (
                    <div className="sentence-console">
                        <div className="sentence-slot">
                            {sentenceWords.length ? sentenceWords.join(' ') : 'Select the missing word'}
                        </div>
                        <div className="sentence-word-grid">
                            {question.answers.map((choice) => (
                                <button
                                    key={choice}
                                    type="button"
                                    className={`sentence-word ${answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => handleSentenceChoice(choice)}
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : selectedGame.type === 'speed' ? (
                    <div className="speed-grid">
                        {question.answers.map((choice) => (
                            <button
                                key={choice}
                                type="button"
                                className={`speed-orb ${answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''}`}
                                onClick={() => chooseAnswer(choice)}
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="game-orb-grid">
                        {question.answers.map((choice) => (
                            <button key={choice} type="button" className={`game-orb ${answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''}`} onClick={() => chooseAnswer(choice)}>
                                {choice}
                            </button>
                        ))}
                    </div>
                )}

                {answer && <p className={answer === question.correct ? 'game-feedback correct' : 'game-feedback wrong'}>{answer === 'timeout' ? 'Time is up! Move to the next challenge.' : answer === question.correct ? 'Correct! Great work.' : 'Try another answer.'}</p>}
                {answer && <button type="button" className="game-next-button" onClick={nextQuestion}>Next question</button>}
            </section>
        </main>
    )
}
