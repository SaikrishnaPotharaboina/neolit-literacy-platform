import { useEffect, useMemo, useRef, useState } from 'react'
import { learningApi } from '../services/learningApi'
import { wordBuilderQuestions } from '../data/wordBuilderSets'

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

const MEMORY_DECOYS_BY_LANGUAGE = {
    en: ['Garden', 'Star'],
    hi: ['बगीचा', 'तारा'],
    kn: ['ತೋಟ', 'ನಕ್ಷತ್ರ'],
    ta: ['தோட்டம்', 'நட்சத்திரம்'],
    te: ['తోట', 'నక్షత్రం'],
}

const CITY_GAME_BY_LANGUAGE = {
    en: {
        id: 'city',
        icon: '🏙️',
        title: 'Living Language City',
        description: 'Make real choices in a city that reacts to your language.',
        type: 'city',
        questions: [
            { location: 'Morning Market', prompt: 'The vendor asks: “How many apples do you need?”', clue: 'You need two.', answers: ['Two apples', 'The apples are red', 'Where is the station?'], correct: 'Two apples' },
            { location: 'Train Station', prompt: 'You need to find platform three.', clue: 'Ask for the platform politely.', answers: ['Excuse me, where is platform three?', 'I bought a blue shirt.', 'Give me yesterday.'], correct: 'Excuse me, where is platform three?' },
            { location: 'Café Street', prompt: 'The server asks what you would like to drink.', clue: 'Order water, please.', answers: ['Water, please.', 'I walked home yesterday.', 'The window is large.'], correct: 'Water, please.' },
            { location: 'City Archive', prompt: 'A clue says: “The key was hidden yesterday.”', clue: 'Choose the sentence about the past.', answers: ['The key was hidden yesterday.', 'The key is under the table now.', 'Hide the key tomorrow.'], correct: 'The key was hidden yesterday.' },
            { location: 'Riverside', prompt: 'A visitor asks how to reach the museum.', clue: 'Give a direction.', answers: ['Walk straight and turn left.', 'I like the museum painting.', 'The museum opened last year.'], correct: 'Walk straight and turn left.' },
        ],
    },
    hi: {
        id: 'city', icon: '🏙️', title: 'भाषा का जीवंत शहर', description: 'शहर में सही भाषा चुनें और कहानी आगे बढ़ाएँ।', type: 'city',
        questions: [
            { location: 'सुबह का बाज़ार', prompt: 'विक्रेता पूछता है: “आपको कितने सेब चाहिए?”', clue: 'आपको दो सेब चाहिए।', answers: ['दो सेब', 'सेब लाल हैं', 'स्टेशन कहाँ है?'], correct: 'दो सेब' },
            { location: 'रेलवे स्टेशन', prompt: 'आपको प्लेटफ़ॉर्म तीन ढूँढना है।', clue: 'विनम्रता से पूछें।', answers: ['माफ़ कीजिए, प्लेटफ़ॉर्म तीन कहाँ है?', 'मैंने नीली कमीज़ खरीदी।', 'मुझे कल दे दीजिए।'], correct: 'माफ़ कीजिए, प्लेटफ़ॉर्म तीन कहाँ है?' },
            { location: 'कैफ़े गली', prompt: 'वेटर पूछता है कि आप क्या पीना चाहेंगे।', clue: 'पानी माँगें।', answers: ['पानी, कृपया।', 'मैं कल घर गया था।', 'खिड़की बड़ी है।'], correct: 'पानी, कृपया।' },
            { location: 'शहर का संग्रहालय', prompt: 'एक सुराग कहता है: “चाबी कल छिपाई गई थी।”', clue: 'भूतकाल वाला वाक्य चुनें।', answers: ['चाबी कल छिपाई गई थी।', 'चाबी अभी मेज़ के नीचे है।', 'चाबी कल छिपाएँ।'], correct: 'चाबी कल छिपाई गई थी।' },
            { location: 'नदी किनारा', prompt: 'एक यात्री संग्रहालय का रास्ता पूछता है।', clue: 'दिशा बताइए।', answers: ['सीधे जाएँ और बाएँ मुड़ें।', 'मुझे संग्रहालय की पेंटिंग पसंद है।', 'संग्रहालय पिछले साल खुला।'], correct: 'सीधे जाएँ और बाएँ मुड़ें।' },
        ],
    },
    kn: {
        id: 'city', icon: '🏙️', title: 'ಜೀವಂತ ಭಾಷಾ ನಗರ', description: 'ನಗರದಲ್ಲಿ ಸರಿಯಾದ ಭಾಷೆಯನ್ನು ಬಳಸಿ ಕಥೆಯನ್ನು ಮುಂದುವರಿಸಿ.', type: 'city',
        questions: [
            { location: 'ಬೆಳಗಿನ ಮಾರುಕಟ್ಟೆ', prompt: 'ವ್ಯಾಪಾರಿ ಕೇಳುತ್ತಾನೆ: “ನಿಮಗೆ ಎಷ್ಟು ಸೇಬುಗಳು ಬೇಕು?”', clue: 'ನಿಮಗೆ ಎರಡು ಸೇಬುಗಳು ಬೇಕು.', answers: ['ಎರಡು ಸೇಬುಗಳು', 'ಸೇಬುಗಳು ಕೆಂಪಾಗಿವೆ', 'ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?'], correct: 'ಎರಡು ಸೇಬುಗಳು' },
            { location: 'ರೈಲು ನಿಲ್ದಾಣ', prompt: 'ನೀವು ಮೂರನೇ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಹುಡುಕುತ್ತಿದ್ದೀರಿ.', clue: 'ವಿನಯದಿಂದ ಕೇಳಿ.', answers: ['ಕ್ಷಮಿಸಿ, ಮೂರನೇ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಎಲ್ಲಿದೆ?', 'ನಾನು ನೀಲಿ ಅಂಗಿಯನ್ನು ಖರೀದಿಸಿದೆ.', 'ನನಗೆ ನಿನ್ನೆ ಕೊಡಿ.'], correct: 'ಕ್ಷಮಿಸಿ, ಮೂರನೇ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಎಲ್ಲಿದೆ?' },
            { location: 'ಕೆಫೆ ಬೀದಿ', prompt: 'ಸೇವಕನು ನಿಮಗೆ ಏನು ಕುಡಿಯಬೇಕು ಎಂದು ಕೇಳುತ್ತಾನೆ.', clue: 'ನೀರು ಕೇಳಿ.', answers: ['ನೀರು, ದಯವಿಟ್ಟು.', 'ನಾನು ನಿನ್ನೆ ಮನೆಗೆ ಹೋದೆ.', 'ಕಿಟಕಿ ದೊಡ್ಡದಾಗಿದೆ.'], correct: 'ನೀರು, ದಯವಿಟ್ಟು.' },
            { location: 'ನಗರದ ದಾಖಲೆಮನೆ', prompt: 'ಸುಳಿವು ಹೇಳುತ್ತದೆ: “ಕೀಲಿಯನ್ನು ನಿನ್ನೆ ಮರೆಮಾಡಲಾಗಿತ್ತು.”', clue: 'ಭೂತಕಾಲದ ವಾಕ್ಯ ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಕೀಲಿಯನ್ನು ನಿನ್ನೆ ಮರೆಮಾಡಲಾಗಿತ್ತು.', 'ಕೀಲಿ ಈಗ ಮೇಜಿನ ಕೆಳಗಿದೆ.', 'ಕೀಲಿಯನ್ನು ನಾಳೆ ಮರೆಮಾಡಿ.'], correct: 'ಕೀಲಿಯನ್ನು ನಿನ್ನೆ ಮರೆಮಾಡಲಾಗಿತ್ತು.' },
            { location: 'ನದಿ ದಂಡೆ', prompt: 'ಪ್ರವಾಸಿಗನು ಸಂಗ್ರಹಾಲಯಕ್ಕೆ ದಾರಿ ಕೇಳುತ್ತಾನೆ.', clue: 'ದಿಕ್ಕನ್ನು ತಿಳಿಸಿ.', answers: ['ನೇರವಾಗಿ ಹೋಗಿ ಎಡಕ್ಕೆ ತಿರುಗಿ.', 'ನನಗೆ ಸಂಗ್ರಹಾಲಯದ ಚಿತ್ರ ಇಷ್ಟ.', 'ಸಂಗ್ರಹಾಲಯ ಕಳೆದ ವರ್ಷ ತೆರೆದಿತು.'], correct: 'ನೇರವಾಗಿ ಹೋಗಿ ಎಡಕ್ಕೆ ತಿರುಗಿ.' },
        ],
    },
    ta: {
        id: 'city', icon: '🏙️', title: 'உயிருள்ள மொழி நகரம்', description: 'நகரத்தில் சரியான மொழியைப் பயன்படுத்தி கதையை முன்னேற்றுங்கள்.', type: 'city',
        questions: [
            { location: 'காலை சந்தை', prompt: 'விற்பனையாளர் கேட்கிறார்: “உங்களுக்கு எத்தனை ஆப்பிள்கள் வேண்டும்?”', clue: 'உங்களுக்கு இரண்டு வேண்டும்.', answers: ['இரண்டு ஆப்பிள்கள்', 'ஆப்பிள்கள் சிவப்பாக உள்ளன', 'நிலையம் எங்கே?'], correct: 'இரண்டு ஆப்பிள்கள்' },
            { location: 'ரயில் நிலையம்', prompt: 'நீங்கள் மூன்றாவது நடைமேடையைத் தேடுகிறீர்கள்.', clue: 'மரியாதையாகக் கேளுங்கள்.', answers: ['மன்னிக்கவும், மூன்றாவது நடைமேடை எங்கே?', 'நான் நீல சட்டை வாங்கினேன்.', 'நேற்றைக் கொடுங்கள்.'], correct: 'மன்னிக்கவும், மூன்றாவது நடைமேடை எங்கே?' },
            { location: 'கஃபே தெரு', prompt: 'பணியாளர் நீங்கள் என்ன குடிக்க விரும்புகிறீர்கள் என்று கேட்கிறார்.', clue: 'தண்ணீர் கேளுங்கள்.', answers: ['தண்ணீர், தயவுசெய்து.', 'நான் நேற்று வீட்டிற்குச் சென்றேன்.', 'ஜன்னல் பெரியது.'], correct: 'தண்ணீர், தயவுசெய்து.' },
            { location: 'நகரக் காப்பகம்', prompt: 'ஒரு குறிப்பு சொல்கிறது: “சாவி நேற்று மறைக்கப்பட்டது.”', clue: 'கடந்த கால வாக்கியத்தைத் தேர்ந்தெடுக்கவும்.', answers: ['சாவி நேற்று மறைக்கப்பட்டது.', 'சாவி இப்போது மேசையின் கீழ் உள்ளது.', 'சாவியை நாளை மறைக்கவும்.'], correct: 'சாவி நேற்று மறைக்கப்பட்டது.' },
            { location: 'ஆற்றங்கரை', prompt: 'ஒரு பயணி அருங்காட்சியகத்திற்குச் செல்லும் வழியைக் கேட்கிறார்.', clue: 'ஒரு திசையைச் சொல்லுங்கள்.', answers: ['நேராகச் சென்று இடதுபுறம் திரும்புங்கள்.', 'எனக்கு அருங்காட்சியக ஓவியம் பிடிக்கும்.', 'அருங்காட்சியகம் சென்ற ஆண்டு திறக்கப்பட்டது.'], correct: 'நேராகச் சென்று இடதுபுறம் திரும்புங்கள்.' },
        ],
    },
    te: {
        id: 'city', icon: '🏙️', title: 'జీవంత భాషా నగరం', description: 'నగరంలో సరైన భాషను ఉపయోగించి కథను ముందుకు తీసుకెళ్లండి.', type: 'city',
        questions: [
            { location: 'ఉదయం మార్కెట్', prompt: 'వ్యాపారి అడుగుతాడు: “మీకు ఎన్ని ఆపిల్స్ కావాలి?”', clue: 'మీకు రెండు కావాలి.', answers: ['రెండు ఆపిల్స్', 'ఆపిల్స్ ఎర్రగా ఉన్నాయి', 'స్టేషన్ ఎక్కడ ఉంది?'], correct: 'రెండు ఆపిల్స్' },
            { location: 'రైల్వే స్టేషన్', prompt: 'మీరు మూడవ ప్లాట్‌ఫారమ్‌ను వెతుకుతున్నారు.', clue: 'మర్యాదగా అడగండి.', answers: ['క్షమించండి, మూడవ ప్లాట్‌ఫారమ్ ఎక్కడ ఉంది?', 'నేను నీలి చొక్కా కొన్నాను.', 'నాకు నిన్న ఇవ్వండి.'], correct: 'క్షమించండి, మూడవ ప్లాట్‌ఫారమ్ ఎక్కడ ఉంది?' },
            { location: 'కేఫ్ వీధి', prompt: 'మీరు ఏమి తాగాలనుకుంటున్నారో సర్వర్ అడుగుతున్నాడు.', clue: 'నీరు ఆర్డర్ చేయండి.', answers: ['నీరు, దయచేసి.', 'నేను నిన్న ఇంటికి వెళ్లాను.', 'కిటికీ పెద్దగా ఉంది.'], correct: 'నీరు, దయచేసి.' },
            { location: 'నగర ఆర్కైవ్', prompt: 'ఒక ఆధారం చెబుతోంది: “తాళం చెవి నిన్న దాచబడింది.”', clue: 'గత కాల వాక్యాన్ని ఎంచుకోండి.', answers: ['తాళం చెవి నిన్న దాచబడింది.', 'తాళం చెవి ఇప్పుడు బల్ల కింద ఉంది.', 'తాళం చెవిని రేపు దాచండి.'], correct: 'తాళం చెవి నిన్న దాచబడింది.' },
            { location: 'నది ఒడ్డు', prompt: 'ఒక ప్రయాణికుడు మ్యూజియంకు దారి అడుగుతున్నాడు.', clue: 'దిశను చెప్పండి.', answers: ['నేరుగా వెళ్లి ఎడమవైపు తిరగండి.', 'నాకు మ్యూజియం పెయింటింగ్ ఇష్టం.', 'మ్యూజియం గత సంవత్సరం తెరుచుకుంది.'], correct: 'నేరుగా వెళ్లి ఎడమవైపు తిరగండి.' },
        ],
    },
}

const LISTENING_GAME_BY_LANGUAGE = {
    en: {
        id: 'listening', icon: '🎧', title: 'Listening Detective', description: 'Listen carefully and identify the meaning.', type: 'listening', listenLabel: 'Play the clue', questions: [
            { audioPhrase: 'The train leaves at eight.', prompt: 'What did you hear?', answers: ['The train leaves at eight.', 'The train arrives at nine.', 'The shop closes at eight.'], correct: 'The train leaves at eight.' },
            { audioPhrase: 'Please bring me a glass of water.', prompt: 'What does the speaker want?', answers: ['A glass of water', 'A cup of coffee', 'A bottle of milk'], correct: 'A glass of water' },
            { audioPhrase: 'Turn right after the library.', prompt: 'Which direction should you take?', answers: ['Turn right after the library.', 'Turn left before the school.', 'Walk back to the station.'], correct: 'Turn right after the library.' },
            { audioPhrase: 'I visited the museum yesterday.', prompt: 'When did the visit happen?', answers: ['Yesterday', 'Tomorrow', 'Every morning'], correct: 'Yesterday' },
        ]
    },
    hi: {
        id: 'listening', icon: '🎧', title: 'सुनो और खोजो', description: 'ध्यान से सुनें और अर्थ पहचानें।', type: 'listening', listenLabel: 'सुराग सुनें', questions: [
            { audioPhrase: 'The train leaves at eight.', prompt: 'आपने क्या सुना?', answers: ['ट्रेन आठ बजे जाती है।', 'ट्रेन नौ बजे आती है।', 'दुकान आठ बजे बंद होती है।'], correct: 'ट्रेन आठ बजे जाती है।' },
            { audioPhrase: 'Please bring me a glass of water.', prompt: 'वक्ता को क्या चाहिए?', answers: ['एक गिलास पानी', 'एक कप कॉफी', 'एक बोतल दूध'], correct: 'एक गिलास पानी' },
            { audioPhrase: 'Turn right after the library.', prompt: 'आपको किस दिशा में जाना चाहिए?', answers: ['पुस्तकालय के बाद दाएँ मुड़ें।', 'स्कूल से पहले बाएँ मुड़ें।', 'स्टेशन वापस जाएँ।'], correct: 'पुस्तकालय के बाद दाएँ मुड़ें।' },
            { audioPhrase: 'I visited the museum yesterday.', prompt: 'यात्रा कब हुई?', answers: ['कल', 'कल होगा', 'हर सुबह'], correct: 'कल' },
        ]
    },
    kn: {
        id: 'listening', icon: '🎧', title: 'ಕೇಳಿ ಪತ್ತೆಹಚ್ಚಿ', description: 'ಗಮನವಿಟ್ಟು ಕೇಳಿ ಮತ್ತು ಅರ್ಥವನ್ನು ಗುರುತಿಸಿ.', type: 'listening', listenLabel: 'ಸುಳಿವು ಕೇಳಿ', questions: [
            { audioPhrase: 'The train leaves at eight.', prompt: 'ನೀವು ಏನು ಕೇಳಿದಿರಿ?', answers: ['ರೈಲು ಎಂಟು ಗಂಟೆಗೆ ಹೊರಡುತ್ತದೆ.', 'ರೈಲು ಒಂಬತ್ತು ಗಂಟೆಗೆ ಬರುತ್ತದೆ.', 'ಅಂಗಡಿ ಎಂಟು ಗಂಟೆಗೆ ಮುಚ್ಚುತ್ತದೆ.'], correct: 'ರೈಲು ಎಂಟು ಗಂಟೆಗೆ ಹೊರಡುತ್ತದೆ.' },
            { audioPhrase: 'Please bring me a glass of water.', prompt: 'ಮಾತನಾಡುವವರಿಗೆ ಏನು ಬೇಕು?', answers: ['ಒಂದು ಲೋಟ ನೀರು', 'ಒಂದು ಕಪ್ ಕಾಫಿ', 'ಒಂದು ಬಾಟಲಿ ಹಾಲು'], correct: 'ಒಂದು ಲೋಟ ನೀರು' },
            { audioPhrase: 'Turn right after the library.', prompt: 'ನೀವು ಯಾವ ದಿಕ್ಕಿಗೆ ಹೋಗಬೇಕು?', answers: ['ಗ್ರಂಥಾಲಯದ ನಂತರ ಬಲಕ್ಕೆ ತಿರುಗಿ.', 'ಶಾಲೆಯ ಮೊದಲು ಎಡಕ್ಕೆ ತಿರುಗಿ.', 'ನಿಲ್ದಾಣಕ್ಕೆ ಹಿಂದಿರುಗಿ.'], correct: 'ಗ್ರಂಥಾಲಯದ ನಂತರ ಬಲಕ್ಕೆ ತಿರುಗಿ.' },
            { audioPhrase: 'I visited the museum yesterday.', prompt: 'ಭೇಟಿ ಯಾವಾಗ ನಡೆಯಿತು?', answers: ['ನಿನ್ನೆ', 'ನಾಳೆ', 'ಪ್ರತಿ ಬೆಳಿಗ್ಗೆ'], correct: 'ನಿನ್ನೆ' },
        ]
    },
    ta: {
        id: 'listening', icon: '🎧', title: 'கேட்டு கண்டுபிடி', description: 'கவனமாகக் கேட்டு அர்த்தத்தைத் தேர்ந்தெடுக்கவும்.', type: 'listening', listenLabel: 'குறிப்பைக் கேளுங்கள்', questions: [
            { audioPhrase: 'The train leaves at eight.', prompt: 'நீங்கள் என்ன கேட்டீர்கள்?', answers: ['ரயில் எட்டு மணிக்கு புறப்படுகிறது.', 'ரயில் ஒன்பது மணிக்கு வருகிறது.', 'கடை எட்டு மணிக்கு மூடுகிறது.'], correct: 'ரயில் எட்டு மணிக்கு புறப்படுகிறது.' },
            { audioPhrase: 'Please bring me a glass of water.', prompt: 'பேசுபவருக்கு என்ன வேண்டும்?', answers: ['ஒரு கிளாஸ் தண்ணீர்', 'ஒரு கப் காபி', 'ஒரு பாட்டில் பால்'], correct: 'ஒரு கிளாஸ் தண்ணீர்' },
            { audioPhrase: 'Turn right after the library.', prompt: 'நீங்கள் எந்த திசையில் செல்ல வேண்டும்?', answers: ['நூலகத்திற்குப் பிறகு வலதுபுறம் திரும்புங்கள்.', 'பள்ளிக்கு முன் இடதுபுறம் திரும்புங்கள்.', 'நிலையத்திற்குத் திரும்பிச் செல்லுங்கள்.'], correct: 'நூலகத்திற்குப் பிறகு வலதுபுறம் திரும்புங்கள்.' },
            { audioPhrase: 'I visited the museum yesterday.', prompt: 'வருகை எப்போது நடந்தது?', answers: ['நேற்று', 'நாளை', 'ஒவ்வொரு காலையும்'], correct: 'நேற்று' },
        ]
    },
    te: {
        id: 'listening', icon: '🎧', title: 'విని గుర్తించండి', description: 'జాగ్రత్తగా విని అర్థాన్ని గుర్తించండి.', type: 'listening', listenLabel: 'ఆధారాన్ని వినండి', questions: [
            { audioPhrase: 'The train leaves at eight.', prompt: 'మీరు ఏమి విన్నారు?', answers: ['రైలు ఎనిమిది గంటలకు బయలుదేరుతుంది.', 'రైలు తొమ్మిది గంటలకు వస్తుంది.', 'దుకాణం ఎనిమిది గంటలకు మూసుకుంటుంది.'], correct: 'రైలు ఎనిమిది గంటలకు బయలుదేరుతుంది.' },
            { audioPhrase: 'Please bring me a glass of water.', prompt: 'మాట్లాడుతున్న వ్యక్తికి ఏమి కావాలి?', answers: ['ఒక గ్లాసు నీరు', 'ఒక కప్పు కాఫీ', 'ఒక బాటిల్ పాలు'], correct: 'ఒక గ్లాసు నీరు' },
            { audioPhrase: 'Turn right after the library.', prompt: 'మీరు ఏ దిశగా వెళ్లాలి?', answers: ['లైబ్రరీ తర్వాత కుడివైపు తిరగండి.', 'స్కూల్ ముందు ఎడమవైపు తిరగండి.', 'స్టేషన్‌కు తిరిగి వెళ్లండి.'], correct: 'లైబ్రరీ తర్వాత కుడివైపు తిరగండి.' },
            { audioPhrase: 'I visited the museum yesterday.', prompt: 'సందర్శన ఎప్పుడు జరిగింది?', answers: ['నిన్న', 'రేపు', 'ప్రతి ఉదయం'], correct: 'నిన్న' },
        ]
    },
}

const DRAGON_GAME_BY_LANGUAGE = {
    en: {
        id: 'dragon', icon: '🐉', title: 'Dragon Dash', description: 'Jump over mistakes and collect the right words.', type: 'dragon', questions: [
            { prompt: 'Jump over the word that means “brave”.', answers: ['bold', 'cold', 'slow'], correct: 'bold' },
            { prompt: 'Choose the word that completes: “The dragon ___.”', answers: ['flies', 'green', 'under'], correct: 'flies' },
            { prompt: 'Collect the opposite of “dark”.', answers: ['bright', 'late', 'weak'], correct: 'bright' },
            { prompt: 'Choose a safe place for the dragon.', answers: ['cave', 'cloud', 'minute'], correct: 'cave' },
        ]
    },
    hi: {
        id: 'dragon', icon: '🐉', title: 'ड्रैगन दौड़', description: 'गलतियों से कूदें और सही शब्द इकट्ठा करें।', type: 'dragon', questions: [
            { prompt: '“बहादुर” का सही शब्द चुनकर कूदें।', answers: ['साहसी', 'ठंडा', 'धीमा'], correct: 'साहसी' },
            { prompt: 'वाक्य पूरा करें: “ड्रैगन ___।”', answers: ['उड़ता है', 'हरा', 'नीचे'], correct: 'उड़ता है' },
            { prompt: '“अँधेरा” का उल्टा इकट्ठा करें।', answers: ['उजला', 'देर', 'कमज़ोर'], correct: 'उजला' },
            { prompt: 'ड्रैगन के लिए सुरक्षित जगह चुनें।', answers: ['गुफा', 'बादल', 'मिनट'], correct: 'गुफा' },
        ]
    },
    kn: {
        id: 'dragon', icon: '🐉', title: 'ಡ್ರ್ಯಾಗನ್ ಓಟ', description: 'ತಪ್ಪುಗಳನ್ನು ದಾಟಿ ಸರಿಯಾದ ಪದಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ.', type: 'dragon', questions: [
            { prompt: '“ಧೈರ್ಯಶಾಲಿ” ಪದವನ್ನು ಆರಿಸಿ ಜಿಗಿಯಿರಿ.', answers: ['ಧೈರ್ಯಶಾಲಿ', 'ತಂಪಾದ', 'ನಿಧಾನ'], correct: 'ಧೈರ್ಯಶಾಲಿ' },
            { prompt: 'ವಾಕ್ಯ ಪೂರ್ಣಗೊಳಿಸಿ: “ಡ್ರ್ಯಾಗನ್ ___.”', answers: ['ಹಾರುತ್ತದೆ', 'ಹಸಿರು', 'ಕೆಳಗೆ'], correct: 'ಹಾರುತ್ತದೆ' },
            { prompt: '“ಕತ್ತಲೆ”ಯ ವಿರುದ್ಧವಾದ ಪದವನ್ನು ಸಂಗ್ರಹಿಸಿ.', answers: ['ಬೆಳಕು', 'ತಡ', 'ದುರ್ಬಲ'], correct: 'ಬೆಳಕು' },
            { prompt: 'ಡ್ರ್ಯಾಗನ್‌ಗೆ ಸುರಕ್ಷಿತ ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಗುಹೆ', 'ಮೋಡ', 'ನಿಮಿಷ'], correct: 'ಗುಹೆ' },
        ]
    },
    ta: {
        id: 'dragon', icon: '🐉', title: 'டிராகன் ஓட்டம்', description: 'தவறுகளைத் தாண்டி சரியான சொற்களைச் சேகரிக்கவும்.', type: 'dragon', questions: [
            { prompt: '“தைரியமான” சொல்லைத் தேர்ந்தெடுத்து குதிக்கவும்.', answers: ['தைரியமான', 'குளிர்', 'மெதுவான'], correct: 'தைரியமான' },
            { prompt: 'வாக்கியத்தை முடிக்கவும்: “டிராகன் ___.”', answers: ['பறக்கிறது', 'பச்சை', 'கீழே'], correct: 'பறக்கிறது' },
            { prompt: '“இருள்” என்பதன் எதிர்ச்சொல்லைச் சேகரிக்கவும்.', answers: ['பிரகாசம்', 'தாமதம்', 'பலவீனம்'], correct: 'பிரகாசம்' },
            { prompt: 'டிராகனுக்குப் பாதுகாப்பான இடத்தைத் தேர்ந்தெடுக்கவும்.', answers: ['குகை', 'முகில்', 'நிமிடம்'], correct: 'குகை' },
        ]
    },
    te: {
        id: 'dragon', icon: '🐉', title: 'డ్రాగన్ పరుగు', description: 'తప్పులను దాటి సరైన పదాలను సేకరించండి.', type: 'dragon', questions: [
            { prompt: '“ధైర్యమైన” పదాన్ని ఎంచుకుని దూకండి.', answers: ['ధైర్యమైన', 'చల్లని', 'నెమ్మదైన'], correct: 'ధైర్యమైన' },
            { prompt: 'వాక్యాన్ని పూర్తి చేయండి: “డ్రాగన్ ___.”', answers: ['ఎగురుతుంది', 'ఆకుపచ్చ', 'కింద'], correct: 'ఎగురుతుంది' },
            { prompt: '“చీకటి”కి వ్యతిరేక పదాన్ని సేకరించండి.', answers: ['ప్రకాశం', 'ఆలస్యం', 'బలహీనం'], correct: 'ప్రకాశం' },
            { prompt: 'డ్రాగన్‌కు సురక్షితమైన ప్రదేశాన్ని ఎంచుకోండి.', answers: ['గుహ', 'మేఘం', 'నిమిషం'], correct: 'గుహ' },
        ]
    },
}

const VISUAL_GAMES_BY_LANGUAGE = {
    en: [
        {
            id: 'runner', icon: '🔫', title: 'Word Shooter', description: 'Shoot the correct word before it escapes.', type: 'runner', questions: [
                { prompt: 'Run through the word that means “fast”.', answers: ['quick', 'quiet', 'heavy'], correct: 'quick' },
                { prompt: 'Jump over the wrong word: “I ___ water.”', answers: ['drink', 'blue', 'street'], correct: 'drink' },
                { prompt: 'Collect the word that means “happy”.', answers: ['glad', 'late', 'small'], correct: 'glad' },
                { prompt: 'Choose the word for a place to learn.', answers: ['school', 'river', 'window'], correct: 'school' },
            ]
        },
    ],
    hi: [
        {
            id: 'runner', icon: '🔫', title: 'शब्द शूटर', description: 'सही शब्द को गोली मारने से पहले चुनें।', type: 'runner', questions: [
                { prompt: '“तेज़” का सही शब्द चुनकर दौड़ें।', answers: ['जल्दी', 'शांत', 'भारी'], correct: 'जल्दी' },
                { prompt: 'सही शब्द चुनें: “मैं पानी ___।”', answers: ['पीता हूँ', 'नीला', 'सड़क'], correct: 'पीता हूँ' },
                { prompt: '“खुश” शब्द चुनकर सिक्का पाएँ।', answers: ['प्रसन्न', 'देर', 'छोटा'], correct: 'प्रसन्न' },
                { prompt: 'सीखने की जगह चुनें।', answers: ['स्कूल', 'नदी', 'खिड़की'], correct: 'स्कूल' },
            ]
        },
    ],
    kn: [
        {
            id: 'runner', icon: '🔫', title: 'ಪದ ಶೂಟರ್', description: 'ಸರಿಯಾದ ಪದವನ್ನು ತಪ್ಪಿಸಿಕೊಳ್ಳುವ ಮೊದಲು ಹೊಡೆಯಿರಿ.', type: 'runner', questions: [
                { prompt: '“ವೇಗವಾದ” ಪದವನ್ನು ಆರಿಸಿ ಓಡಿ.', answers: ['ತ್ವರಿತ', 'ಶಾಂತ', 'ಭಾರವಾದ'], correct: 'ತ್ವರಿತ' },
                { prompt: 'ಸರಿಯಾದ ಪದ ಆಯ್ಕೆಮಾಡಿ: “ನಾನು ನೀರನ್ನು ___.”', answers: ['ಕುಡಿಯುತ್ತೇನೆ', 'ನೀಲಿ', 'ರಸ್ತೆ'], correct: 'ಕುಡಿಯುತ್ತೇನೆ' },
                { prompt: '“ಸಂತೋಷ” ಪದವನ್ನು ಸಂಗ್ರಹಿಸಿ.', answers: ['ಖುಷಿ', 'ತಡ', 'ಚಿಕ್ಕ'], correct: 'ಖುಷಿ' },
                { prompt: 'ಕಲಿಯುವ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಶಾಲೆ', 'ನದಿ', 'ಕಿಟಕಿ'], correct: 'ಶಾಲೆ' },
            ]
        },
    ],
    ta: [
        {
            id: 'runner', icon: '🔫', title: 'சொல் ஷூட்டர்', description: 'சரியான சொல் தப்பிப்பதற்கு முன் சுடுங்கள்.', type: 'runner', questions: [
                { prompt: '“வேகமான” சொல்லைத் தேர்ந்தெடுத்து ஓடுங்கள்.', answers: ['விரைவு', 'அமைதி', 'கனமான'], correct: 'விரைவு' },
                { prompt: 'சரியான சொல்லைத் தேர்வு செய்யவும்: “நான் தண்ணீர் ___.”', answers: ['குடிக்கிறேன்', 'நீலம்', 'தெரு'], correct: 'குடிக்கிறேன்' },
                { prompt: '“மகிழ்ச்சி” சொல்லை சேகரிக்கவும்.', answers: ['சந்தோஷம்', 'தாமதம்', 'சிறிய'], correct: 'சந்தோஷம்' },
                { prompt: 'கற்றல் இடத்தைத் தேர்ந்தெடுக்கவும்.', answers: ['பள்ளி', 'ஆறு', 'ஜன்னல்'], correct: 'பள்ளி' },
            ]
        },
    ],
    te: [
        {
            id: 'runner', icon: '🔫', title: 'పద షూటర్', description: 'సరైన పదం తప్పించుకునే ముందు షూట్ చేయండి.', type: 'runner', questions: [
                { prompt: '“వేగమైన” పదాన్ని ఎంచుకుని పరుగెత్తండి.', answers: ['త్వరగా', 'నిశ్శబ్దం', 'భారీ'], correct: 'త్వరగా' },
                { prompt: 'సరైన పదాన్ని ఎంచుకోండి: “నేను నీరు ___.”', answers: ['తాగుతాను', 'నీలం', 'వీధి'], correct: 'తాగుతాను' },
                { prompt: '“సంతోషం” పదాన్ని సేకరించండి.', answers: ['ఆనందం', 'ఆలస్యం', 'చిన్న'], correct: 'ఆనందం' },
                { prompt: 'చదువుకునే ప్రదేశాన్ని ఎంచుకోండి.', answers: ['పాఠశాల', 'నది', 'కిటికీ'], correct: 'పాఠశాల' },
            ]
        },
    ],
}

const WORD_ARCHER_GAME_BY_LANGUAGE = {
    en: {
        id: 'archer', icon: '🏹', title: 'Word Archer', description: 'Aim at the correct vocabulary target.', type: 'archer',
        questions: [
            { prompt: 'Which word means "to examine carefully"?', answers: ['Analyze', 'Gather', 'Breathe', 'Ignore'], correct: 'Analyze' },
            { prompt: 'Select the word for "a sudden feeling of fear".', answers: ['Panic', 'Lantern', 'Pillow', 'Ribbon'], correct: 'Panic' },
            { prompt: 'What does "fragile" mean?', answers: ['Easily broken', 'Very loud', 'Extremely slow', 'Completely empty'], correct: 'Easily broken' },
            { prompt: 'Choose the word that means "a long journey".', answers: ['Expedition', 'Cabin', 'Shadow', 'Thread'], correct: 'Expedition' },
            { prompt: 'Which option best matches "to postpone"?', answers: ['Delay', 'Arrange', 'Accept', 'Measure'], correct: 'Delay' },
            { prompt: 'Find the word for "a place where books are kept".', answers: ['Library', 'Market', 'Harbor', 'Factory'], correct: 'Library' },
        ],
    },
    hi: {
        id: 'archer', icon: '🏹', title: 'वर्ड आर्चर', description: 'सही शब्द पर निशाना लगाएँ।', type: 'archer',
        questions: [
            { prompt: '"casa" का अर्थ क्या है?', answers: ['घर', 'पानी', 'किताब', 'भोजन'], correct: 'घर' },
            { prompt: '"agua" का अर्थ क्या है?', answers: ['पानी', 'घर', 'नदी', 'पेड़'], correct: 'पानी' },
            { prompt: '"school" का सही शब्द चुनें।', answers: ['स्कूल', 'सड़क', 'बादल', 'कुर्सी'], correct: 'स्कूल' },
            { prompt: '"friend" का सही शब्द चुनें।', answers: ['दोस्त', 'दरवाज़ा', 'चाँद', 'रोटी'], correct: 'दोस्त' },
            { prompt: '"apple" का सही शब्द चुनें।', answers: ['सेब', 'पत्थर', 'खिड़की', 'सूर्य'], correct: 'सेब' },
        ],
    },
    kn: {
        id: 'archer', icon: '🏹', title: 'ವರ್ಡ್ ಆರ್ಚರ್', description: 'ಸರಿಯಾದ ಪದದ ಮೇಲೆ ಬಾಣ ಹೂಡಿ.', type: 'archer',
        questions: [
            { prompt: '"casa" ಎಂಬುದು ಎಂದರೇನು?', answers: ['ಮನೆ', 'ನೀರು', 'ಪುಸ್ತಕ', 'ಆಹಾರ'], correct: 'ಮನೆ' },
            { prompt: '"agua" ಎಂಬುದು ಎಂದರೇನು?', answers: ['ನೀರು', 'ಮನೆ', 'ನದಿ', 'ಮರ'], correct: 'ನೀರು' },
            { prompt: '"school" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಪಾಠಶಾಲೆ', 'ರಸ್ತೆ', 'ಮೋಡ', 'ಕುರ್ಚಿ'], correct: 'ಪಾಠಶಾಲೆ' },
            { prompt: '"friend" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಮಿತ್ರ', 'ಕದ', 'ಚಂದ್ರ', 'ರೊಟ್ಟಿ'], correct: 'ಮित्र' },
            { prompt: '"apple" ಗಾಗಿ ಸರಿಯಾದ ಪದ ಆಯ್ಕೆಮಾಡಿ.', answers: ['ಆಪಲ್', 'ಕಲ್ಲು', 'ಕಿಟಕಿ', 'ಸೂರ್ಯ'], correct: 'ಆಪಲ್' },
        ],
    },
    ta: {
        id: 'archer', icon: '🏹', title: 'வேர்ட் ஆர்ச்சர்', description: 'சரியான சொற்களுக்கு அம்பு எய்யுங்கள்.', type: 'archer',
        questions: [
            { prompt: '"casa" என்பதன் அர்த்தம் என்ன?', answers: ['வீடு', 'தண்ணீர்', 'புத்தகம்', 'சாப்பாடு'], correct: 'வீடு' },
            { prompt: '"agua" என்பதன் அர்த்தம் என்ன?', answers: ['தண்ணீர்', 'வீடு', 'ஆறு', 'மரம்'], correct: 'தண்ணீர்' },
            { prompt: '"school"-க்கு சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['பள்ளி', 'தெரு', 'முகில்', 'கார்'], correct: 'பள்ளி' },
            { prompt: '"friend"-க்கு சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['நண்பர்', 'கதவு', 'சந்திரன்', 'ரொட்டி'], correct: 'நண்பர்' },
            { prompt: '"apple"-க்கு சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', answers: ['ஆப்பிள்', 'கல்', 'ஜன்னல்', 'சூரியன்'], correct: 'ஆப்பிள்' },
        ],
    },
    te: {
        id: 'archer', icon: '🏹', title: 'వర్డ్ ఆర్చర్', description: 'సరైన పదంపై బాణం ఎక్కించండి.', type: 'archer',
        questions: [
            { prompt: '"casa" అర్థం ఏమిటి?', answers: ['ఇల్లు', 'నీరు', 'పుస్తకం', 'ఆహారం'], correct: 'ఇల్లు' },
            { prompt: '"agua" అర్థం ఏమిటి?', answers: ['నీరు', 'ఇల్లు', 'నది', 'చెట్టు'], correct: 'నీరు' },
            { prompt: '"school" కోసం సరైన పదాన్ని ఎంచుకోండి.', answers: ['పాఠశాల', 'వీధి', 'మేఘం', 'కుర్చీ'], correct: 'పాఠశాల' },
            { prompt: '"friend" కోసం సరైన పదాన్ని ఎంచుకోండి.', answers: ['స్నేహితుడు', 'తలుపు', 'చంద్రుడు', 'రొట్టె'], correct: 'స్నేహితుడు' },
            { prompt: '"apple" కోసం సరైన పదాన్ని ఎంచుకోండి.', answers: ['ఆపిల్', 'రాయి', 'కిటికీ', 'సూర్యుడు'], correct: 'ఆపిల్' },
        ],
    },
}

const FLIP_MATCH_QUESTION_BANK = {
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
    ],
    te: [
        { prompt: 'సరైన స్వాగత పదాన్ని ఎంచుకోండి.', answers: ['హలో', 'కిటికీ', 'మెజ్జ', 'ఉదయం', 'పుస్తకం'], correct: 'హలో' },
        { prompt: 'దినచర్యకు సరైన పదాన్ని ఎంచుకోండి.', answers: ['నేర్చుకోండి', 'విధేయత', 'పర్వతం', 'రొట్టె', 'తోట'], correct: 'నేర్చుకోండి' },
        { prompt: 'చదువుకునే ప్రదేశానికి సరైన పదాన్ని ఎంచుకోండి.', answers: ['పాఠశాల', 'నది', 'మేఘం', 'కుర్చీ', 'సూర్యుడు'], correct: 'పాఠశాల' },
        { prompt: 'పానీయానికి సరైన పదాన్ని ఎంచుకోండి.', answers: ['నీరు', 'ఇల్లు', 'రైలు', 'స్నేహితుడు', 'చెట్టు'], correct: 'నీరు' },
        { prompt: 'పండుకు సరైన పదాన్ని ఎంచుకోండి.', answers: ['ఆపిల్', 'పుస్తకం', 'ద్వారం', 'పక్షి', 'వర్షం'], correct: 'ఆపిల్' },
        { prompt: '“చేరే స్థలం”కు సరైన పదాన్ని ఎంచుకోండి.', answers: ['ఇల్లు', 'చెర్రీ', 'మేఘం', 'నవ్వు', 'సంగీతం'], correct: 'ఇల్లు' },
        { prompt: '“సంతోషం” సూచించే సరైన పదాన్ని ఎంచుకోండి.', answers: ['సంతోషం', 'నిశ్శబ్దం', 'రాకెట్', 'లోహం', 'మిర్రర్'], correct: 'సంతోషం' },
        { prompt: '“ప్రయాణం”కి సరిపోయే పదాన్ని ఎంచుకోండి.', answers: ['ప్రయాణం', 'సాండ్‌విచ్', 'గ్రహం', 'సొరంగం', 'గాలి'], correct: 'ప్రయాణం' },
        { prompt: 'ఒకే సమయంలో నేర్చుకునే సమూహానికి సరైన పదాన్ని ఎంచుకోండి.', answers: ['క్లాస్', 'రహస్యం', 'నెమ్మదింపు', 'నది', 'వంతెన'], correct: 'క్లాస్' },
    ],
}

function shuffleGameOptions(items) {
    return [...items].sort(() => Math.random() - 0.5)
}

const getFlipMatchTrainingSet = (languageCode) => {
    const languageQuestions = FLIP_MATCH_QUESTION_BANK[languageCode] || FLIP_MATCH_QUESTION_BANK.en
    return languageQuestions.map((question) => {
        const safeAnswers = [...new Set((question.answers || []).map((answer) => String(answer).trim()).filter(Boolean))]
        const harderPool = safeAnswers.filter((answer) => answer.length >= 4)
        return {
            ...question,
            answers: shuffleGameOptions((harderPool.length ? harderPool : safeAnswers).slice(0, 5)),
        }
    })
}

const UNIVERSAL_GAMES_BY_LANGUAGE = {
    en: [
        {
            id: 'word-builder', icon: '🔤', title: 'Word Builder', description: 'Arrange scrambled letters into the target word.', type: 'word-builder',
            questions: wordBuilderQuestions,
        },
        {
            id: 'mystery-word', icon: '🕵️', title: 'Mystery Word', description: 'Reveal clues and solve the word.', type: 'mystery-word',
            questions: [
                { prompt: 'What am I?', clues: ['You can eat me.', 'I can be red or green.', 'I grow on a tree.'], answers: ['APPLE', 'BANANA', 'ORANGE'], correct: 'APPLE' },
                { prompt: 'What am I?', clues: ['I can fly.', 'I have feathers.', 'I can sing.'], answers: ['BIRD', 'FISH', 'HORSE'], correct: 'BIRD' },
                { prompt: 'What am I?', clues: ['I give light.', 'You see me in the sky.', 'I shine during the day.'], answers: ['SUN', 'MOON', 'CLOUD'], correct: 'SUN' },
                { prompt: 'What am I?', clues: ['I have four legs.', 'People can ride me.', 'I can run fast.'], answers: ['HORSE', 'TIGER', 'SNAKE'], correct: 'HORSE' },
                { prompt: 'What am I?', clues: ['I am cold.', 'I can melt.', 'People use me in drinks.'], answers: ['ICE', 'SAND', 'PAPER'], correct: 'ICE' },
            ],
        },
        {
            id: 'word-hunt', icon: '🎯', title: 'Word Hunt', description: 'Find all words that match the mission.', type: 'word-hunt',
            questions: [
                { prompt: 'Find 3 words related to food.', answers: ['BOOK', 'APPLE', 'HOUSE', 'WATER', 'BREAD', 'DOG'], correct: ['APPLE', 'WATER', 'BREAD'] },
                { prompt: 'Find 3 words related to places.', answers: ['SCHOOL', 'CAT', 'MARKET', 'RIVER', 'HOUSE', 'GREEN'], correct: ['SCHOOL', 'MARKET', 'HOUSE'] },
                { prompt: 'Find 3 words related to nature.', answers: ['TREE', 'BOOK', 'RIVER', 'SUN', 'CHAIR', 'DOG'], correct: ['TREE', 'RIVER', 'SUN'] },
                { prompt: 'Find 3 words related to animals.', answers: ['DOG', 'TABLE', 'CAT', 'BIRD', 'HOUSE', 'BLUE'], correct: ['DOG', 'CAT', 'BIRD'] },
                { prompt: 'Find 3 words related to school.', answers: ['PENCIL', 'RIVER', 'TEACHER', 'BOOK', 'APPLE', 'MOON'], correct: ['PENCIL', 'TEACHER', 'BOOK'] },
            ],
        },
        {
            id: 'flip-card', icon: '🃏', title: 'Flip Card Challenge', description: 'Flip the cards and match the right word.', type: 'flip-card',
            questions: getFlipMatchTrainingSet('en'),
        },
    ],
    hi: [
        {
            id: 'word-builder', icon: '🔤', title: 'शब्द बनाओ', description: 'अस्थिर अक्षरों को सही शब्द में लगाएँ।', type: 'word-builder',
            questions: wordBuilderQuestions,
        },
        {
            id: 'mystery-word', icon: '🕵️', title: 'गुप्त शब्द', description: 'सुराग देखें और शब्द पहचानें।', type: 'mystery-word',
            questions: [
                { prompt: 'मैं कौन हूँ?', clues: ['आप मुझे खा सकते हैं।', 'मैं लाल या हरा हो सकता हूँ।', 'मैं पेड़ पर grows होता हूँ।'], answers: ['APPLE', 'BANANA', 'ORANGE'], correct: 'APPLE' },
                { prompt: 'मैं कौन हूँ?', clues: ['मैं उड़ सकता हूँ।', 'मेरे पास पंख होते हैं।', 'मैं गा सकता हूँ।'], answers: ['BIRD', 'FISH', 'HORSE'], correct: 'BIRD' },
                { prompt: 'मैं कौन हूँ?', clues: ['मैं प्रकाश देता हूँ।', 'आप मुझे आसमान में देखते हैं।', 'मैं दिन में चमकता हूँ।'], answers: ['SUN', 'MOON', 'CLOUD'], correct: 'SUN' },
                { prompt: 'मैं कौन हूँ?', clues: ['मेरे चार पैर हैं।', 'लोग मुझे सवारी करते हैं।', 'मैं तेज़ दौड़ सकता हूँ।'], answers: ['HORSE', 'TIGER', 'SNAKE'], correct: 'HORSE' },
                { prompt: 'मैं कौन हूँ?', clues: ['मैं ठंडा हूँ।', 'मैं पिघल सकता हूँ।', 'लोग मुझे पीने में उपयोग करते हैं।'], answers: ['ICE', 'SAND', 'PAPER'], correct: 'ICE' },
            ],
        },
        {
            id: 'word-hunt', icon: '🎯', title: 'शब्द खोज', description: 'मिशन से मेल खाने वाले सारे शब्द ढूँढें।', type: 'word-hunt',
            questions: [
                { prompt: 'खाने से जुड़े 3 शब्द ढूँढें।', answers: ['BOOK', 'APPLE', 'HOUSE', 'WATER', 'BREAD', 'DOG'], correct: ['APPLE', 'WATER', 'BREAD'] },
                { prompt: 'जगहों से जुड़े 3 शब्द ढूँढें।', answers: ['SCHOOL', 'CAT', 'MARKET', 'RIVER', 'HOUSE', 'GREEN'], correct: ['SCHOOL', 'MARKET', 'HOUSE'] },
                { prompt: 'प्रकृति से जुड़े 3 शब्द ढूँढें।', answers: ['TREE', 'BOOK', 'RIVER', 'SUN', 'CHAIR', 'DOG'], correct: ['TREE', 'RIVER', 'SUN'] },
                { prompt: 'पशुओं से जुड़े 3 शब्द ढूँढें।', answers: ['DOG', 'TABLE', 'CAT', 'BIRD', 'HOUSE', 'BLUE'], correct: ['DOG', 'CAT', 'BIRD'] },
                { prompt: 'स्कूल से जुड़े 3 शब्द ढूँढें।', answers: ['PENCIL', 'RIVER', 'TEACHER', 'BOOK', 'APPLE', 'MOON'], correct: ['PENCIL', 'TEACHER', 'BOOK'] },
            ],
        },
        {
            id: 'flip-card', icon: '🃏', title: 'फ्लिप कार्ड चैलेंज', description: 'कार्ड पलटें और सही शब्द चुनें।', type: 'flip-card',
            questions: getFlipMatchTrainingSet('hi'),
        },
    ],
    kn: [
        {
            id: 'word-builder', icon: '🔤', title: 'ಪದ ನಿರ್ಮಾಣ', description: 'ಚದರಾಕ್ಷರಗಳನ್ನು ಸರಿಯಾಗಿ ಜೋಡಿಸಿ.', type: 'word-builder',
            questions: wordBuilderQuestions,
        },
        {
            id: 'mystery-word', icon: '🕵️', title: 'ರಹಸ್ಯ ಪದ', description: 'ಸುಳಿವುಗಳನ್ನು ನೋಡಿ ಮತ್ತು ಪದವನ್ನು ಪತ್ತೆಹಚ್ಚಿ.', type: 'mystery-word',
            questions: [
                { prompt: 'ನಾನು ಯಾರು?', clues: ['ನೀವು ನನ್ನನ್ನು ತಿನ್ನಬಹುದು.', 'ನಾನು ಕೆಂಪಾಗಿರಬಹುದು ಅಥವಾ ಹಸಿರು ಆಗಿರಬಹುದು.', 'ನಾನು ಮರದ ಮೇಲೆ ಬೆಳೆಯುತ್ತೇನೆ.'], answers: ['APPLE', 'BANANA', 'ORANGE'], correct: 'APPLE' },
                { prompt: 'ನಾನು ಯಾರು?', clues: ['ನಾನು ಹಾರಬಲ್ಲೆ.', 'ನನ್ನಲ್ಲಿ ರೆಕ್ಕೆಗಳಿವೆ.', 'ನಾನು ಹಾಡಬಲ್ಲೆ.'], answers: ['BIRD', 'FISH', 'HORSE'], correct: 'BIRD' },
                { prompt: 'ನಾನು ಯಾರು?', clues: ['ನಾನು ಬೆಳಕನ್ನು ಕೊಡುತ್ತೇನೆ.', 'ನಿಮ್ಮ ಕಣ್ಣುಗಳಲ್ಲಿ ನನ್ನನ್ನು ನೋಡುತ್ತೀರಿ.', 'ನಾನು ದಿನದಲ್ಲಿ ಹೊಳೆಯುತ್ತೇನೆ.'], answers: ['SUN', 'MOON', 'CLOUD'], correct: 'SUN' },
                { prompt: 'ನಾನು ಯಾರು?', clues: ['ನನಗೆ ನಾಲ್ಕು ಕಾಲುಗಳಿವೆ.', 'ಜನರು ನನ್ನ ಮೇಲೆ ಕುಳಿತುಕೊಳ್ಳುತ್ತಾರೆ.', 'ನಾನು ವೇಗವಾಗಿ ಓಡುತ್ತೇನೆ.'], answers: ['HORSE', 'TIGER', 'SNAKE'], correct: 'HORSE' },
                { prompt: 'ನಾನು ಯಾರು?', clues: ['ನಾನು ತಂಪಾಗಿದ್ದೇನೆ.', 'ನಾನು ಕರಗಬಹುದು.', 'ಜನರು ನನ್ನನ್ನು ಪಾನೀಯದಲ್ಲಿ ಬಳಸುತ್ತಾರೆ.'], answers: ['ICE', 'SAND', 'PAPER'], correct: 'ICE' },
            ],
        },
        {
            id: 'word-hunt', icon: '🎯', title: 'ಪದ ಹುಡುಕಿ', description: 'ಮಿಷನ್‌ಗೆ ಹೊಂದುವ ಎಲ್ಲಾ ಪದಗಳನ್ನು ಹುಡುಕಿ.', type: 'word-hunt',
            questions: [
                { prompt: 'ಆಹಾರಕ್ಕೆ ಸಂಬಂಧಪಟ್ಟ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['BOOK', 'APPLE', 'HOUSE', 'WATER', 'BREAD', 'DOG'], correct: ['APPLE', 'WATER', 'BREAD'] },
                { prompt: 'ಸ್ಥಳಗಳಿಗೆ ಸಂಬಂಧಪಟ್ಟ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['SCHOOL', 'CAT', 'MARKET', 'RIVER', 'HOUSE', 'GREEN'], correct: ['SCHOOL', 'MARKET', 'HOUSE'] },
                { prompt: 'ಪ್ರಕೃತಿಗೆ ಸಂಬಂಧಪಟ್ಟ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['TREE', 'BOOK', 'RIVER', 'SUN', 'CHAIR', 'DOG'], correct: ['TREE', 'RIVER', 'SUN'] },
                { prompt: 'ಜೀವಜಂತುಗಳಿಗೆ ಸಂಬಂಧಪಟ್ಟ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['DOG', 'TABLE', 'CAT', 'BIRD', 'HOUSE', 'BLUE'], correct: ['DOG', 'CAT', 'BIRD'] },
                { prompt: 'ಶಾಲೆಗೆ ಸಂಬಂಧಪಟ್ಟ 3 ಪದಗಳನ್ನು ಹುಡುಕಿ.', answers: ['PENCIL', 'RIVER', 'TEACHER', 'BOOK', 'APPLE', 'MOON'], correct: ['PENCIL', 'TEACHER', 'BOOK'] },
            ],
        },
        {
            id: 'flip-card', icon: '🃏', title: 'ಫ್ಲಿಪ್ ಕಾರ್ಡ್ ಚಾಲೆಂಜ್', description: 'ಕಾರ್ಡ್ಗಳನ್ನು ತಿರುಗಿಸಿ ಮತ್ತು ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ.', type: 'flip-card',
            questions: getFlipMatchTrainingSet('kn'),
        },
    ],
    ta: [
        {
            id: 'word-builder', icon: '🔤', title: 'சொல் உருவாக்கம்', description: 'குழப்பமான எழுத்துக்களை சரியான சொல்லாக மாற்றவும்.', type: 'word-builder',
            questions: wordBuilderQuestions,
        },
        {
            id: 'mystery-word', icon: '🕵️', title: 'ரகசிய சொல்', description: 'சுருக்கங்களைப் பார்த்து சொல்லைக் கண்டுபிடி.', type: 'mystery-word',
            questions: [
                { prompt: 'நான் யார்?', clues: ['நீங்கள் என்னை சாப்பிடலாம்.', 'நான் சிவப்பு அல்லது பச்சையாக இருக்கலாம்.', 'நான் மரத்தில் வளரும்.'], answers: ['APPLE', 'BANANA', 'ORANGE'], correct: 'APPLE' },
                { prompt: 'நான் யார்?', clues: ['நான் பறக்க முடியும்.', 'எனக்கு இறகுகள் இருக்கின்றன.', 'நான் பாட முடியும்.'], answers: ['BIRD', 'FISH', 'HORSE'], correct: 'BIRD' },
                { prompt: 'நான் யார்?', clues: ['நான் ஒளியை தருகிறேன்.', 'வானத்தில் என்னை பார்க்கிறீர்கள்.', 'நான் பகலில் பிரகாசிக்கிறேன்.'], answers: ['SUN', 'MOON', 'CLOUD'], correct: 'SUN' },
                { prompt: 'நான் யார்?', clues: ['எனக்கு நான்கு கால்கள் உள்ளன.', 'மக்கள் என்னை ஓட்டுகிறார்கள்.', 'நான் வேகமாக ஓடுகிறேன்.'], answers: ['HORSE', 'TIGER', 'SNAKE'], correct: 'HORSE' },
                { prompt: 'நான் யார்?', clues: ['நான் குளிராக இருக்கிறேன்.', 'நான் உருக முடியும்.', 'மக்கள் என்னைப் பானங்களில் பயன்படுத்துகிறார்கள்.'], answers: ['ICE', 'SAND', 'PAPER'], correct: 'ICE' },
            ],
        },
        {
            id: 'word-hunt', icon: '🎯', title: 'சொல் வேட்டை', description: 'பணிக்கு பொருந்தும் அனைத்து சொற்களையும் கண்டுபிடி.', type: 'word-hunt',
            questions: [
                { prompt: 'உணவுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['BOOK', 'APPLE', 'HOUSE', 'WATER', 'BREAD', 'DOG'], correct: ['APPLE', 'WATER', 'BREAD'] },
                { prompt: 'இடங்களுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['SCHOOL', 'CAT', 'MARKET', 'RIVER', 'HOUSE', 'GREEN'], correct: ['SCHOOL', 'MARKET', 'HOUSE'] },
                { prompt: 'இயற்கையுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['TREE', 'BOOK', 'RIVER', 'SUN', 'CHAIR', 'DOG'], correct: ['TREE', 'RIVER', 'SUN'] },
                { prompt: 'விலங்குகளுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['DOG', 'TABLE', 'CAT', 'BIRD', 'HOUSE', 'BLUE'], correct: ['DOG', 'CAT', 'BIRD'] },
                { prompt: 'பள்ளியுடன் தொடர்புடைய 3 சொற்களைக் கண்டுபிடி.', answers: ['PENCIL', 'RIVER', 'TEACHER', 'BOOK', 'APPLE', 'MOON'], correct: ['PENCIL', 'TEACHER', 'BOOK'] },
            ],
        },
        {
            id: 'flip-card', icon: '🃏', title: 'ஃபிளிப் கார்டு சவால்', description: 'கார்டுகளை புரட்டி சரியான சொல்லைத் தேர்ந்தெடுக்கவும்.', type: 'flip-card',
            questions: getFlipMatchTrainingSet('ta'),
        },
    ],
    te: [
        {
            id: 'word-builder', icon: '🔤', title: 'పద నిర్మాణం', description: 'కంక్రమించిన అక్షరాలను సరైన పదంలో ఏర్పరచండి.', type: 'word-builder',
            questions: wordBuilderQuestions,
        },
        {
            id: 'mystery-word', icon: '🕵️', title: 'రహస్య పదం', description: 'సూచనలను చూడండి మరియు పదాన్ని కనుగొనండి.', type: 'mystery-word',
            questions: [
                { prompt: 'నేను ఎవరు?', clues: ['మీరు నా కొరకు తినవచ్చు.', 'నేను ఎరుపు లేదా ఆకుపచ్చగా ఉండవచ్చు.', 'నేను చెట్టు మీద పెరుగుతాను.'], answers: ['APPLE', 'BANANA', 'ORANGE'], correct: 'APPLE' },
                { prompt: 'నేను ఎవరు?', clues: ['నేను ఎగరగలను.', 'నాకి రెక్కలు ఉన్నాయి.', 'నేను పాట పాడగలను.'], answers: ['BIRD', 'FISH', 'HORSE'], correct: 'BIRD' },
                { prompt: 'నేను ఎవరు?', clues: ['నేను కాంతిని ఇస్తాను.', 'మీరు ఆకాశంలో నన్ను చూస్తారు.', 'నేను రోజులో ప్రకాశిస్తాను.'], answers: ['SUN', 'MOON', 'CLOUD'], correct: 'SUN' },
                { prompt: 'నేను ఎవరు?', clues: ['నాకు నాలుగు కాళ్ళు ఉన్నాయి.', 'ప్రజలు నన్ను సవారీ చేస్తారు.', 'నేను వేగంగా పరుగెత్తగలను.'], answers: ['HORSE', 'TIGER', 'SNAKE'], correct: 'HORSE' },
                { prompt: 'నేను ఎవరు?', clues: ['నేను చల్లగా ఉన్నాను.', 'నేను కరిగిపోగలను.', 'ప్రజలు నన్ను పానీయాలలో వాడతారు.'], answers: ['ICE', 'SAND', 'PAPER'], correct: 'ICE' },
            ],
        },
        {
            id: 'word-hunt', icon: '🎯', title: 'పదాల వేట', description: 'మిషన్‌కు సరిపోయే అన్ని పదాలను కనుగొనండి.', type: 'word-hunt',
            questions: [
                { prompt: 'ఆహారం సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['BOOK', 'APPLE', 'HOUSE', 'WATER', 'BREAD', 'DOG'], correct: ['APPLE', 'WATER', 'BREAD'] },
                { prompt: 'స్థలాలకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['SCHOOL', 'CAT', 'MARKET', 'RIVER', 'HOUSE', 'GREEN'], correct: ['SCHOOL', 'MARKET', 'HOUSE'] },
                { prompt: 'బయోపదం సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['TREE', 'BOOK', 'RIVER', 'SUN', 'CHAIR', 'DOG'], correct: ['TREE', 'RIVER', 'SUN'] },
                { prompt: 'జంతువులకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['DOG', 'TABLE', 'CAT', 'BIRD', 'HOUSE', 'BLUE'], correct: ['DOG', 'CAT', 'BIRD'] },
                { prompt: 'పాఠశాలకు సంబంధిత 3 పదాలను కనుగొనండి.', answers: ['PENCIL', 'RIVER', 'TEACHER', 'BOOK', 'APPLE', 'MOON'], correct: ['PENCIL', 'TEACHER', 'BOOK'] },
            ],
        },
        {
            id: 'flip-card', icon: '🃏', title: 'ఫ్లిప్ కార్డ్ ఛాలెంజ్', description: 'కార్డులను తిప్పి సరైన పదాన్ని ఎంచుకోండి.', type: 'flip-card',
            questions: getFlipMatchTrainingSet('te'),
        },
    ],
}

const UNIVERSAL_GAMES = [
    {
        id: 'word-builder', icon: '🔤', title: 'Word Builder', description: 'Arrange scrambled letters into the target word.', type: 'word-builder',
        questions: wordBuilderQuestions,
    },
    {
        id: 'mystery-word', icon: '🕵️', title: 'Mystery Word', description: 'Reveal clues and solve the word.', type: 'mystery-word',
        questions: [
            { prompt: 'What am I?', clues: ['You can eat me.', 'I can be red or green.', 'I grow on a tree.'], answers: ['APPLE', 'BANANA', 'ORANGE'], correct: 'APPLE' },
            { prompt: 'What am I?', clues: ['I can fly.', 'I have feathers.', 'I can sing.'], answers: ['BIRD', 'FISH', 'HORSE'], correct: 'BIRD' },
            { prompt: 'What am I?', clues: ['I give light.', 'You see me in the sky.', 'I shine during the day.'], answers: ['SUN', 'MOON', 'CLOUD'], correct: 'SUN' },
            { prompt: 'What am I?', clues: ['I have four legs.', 'People can ride me.', 'I can run fast.'], answers: ['HORSE', 'TIGER', 'SNAKE'], correct: 'HORSE' },
            { prompt: 'What am I?', clues: ['I am cold.', 'I can melt.', 'People use me in drinks.'], answers: ['ICE', 'SAND', 'PAPER'], correct: 'ICE' },
        ],
    },
    {
        id: 'word-hunt', icon: '🎯', title: 'Word Hunt', description: 'Find all words that match the mission.', type: 'word-hunt',
        questions: [
            { prompt: 'Find 3 words related to food.', answers: ['BOOK', 'APPLE', 'HOUSE', 'WATER', 'BREAD', 'DOG'], correct: ['APPLE', 'WATER', 'BREAD'] },
            { prompt: 'Find 3 words related to places.', answers: ['SCHOOL', 'CAT', 'MARKET', 'RIVER', 'HOUSE', 'GREEN'], correct: ['SCHOOL', 'MARKET', 'HOUSE'] },
            { prompt: 'Find 3 words related to nature.', answers: ['TREE', 'BOOK', 'RIVER', 'SUN', 'CHAIR', 'DOG'], correct: ['TREE', 'RIVER', 'SUN'] },
            { prompt: 'Find 3 words related to animals.', answers: ['DOG', 'TABLE', 'CAT', 'BIRD', 'HOUSE', 'BLUE'], correct: ['DOG', 'CAT', 'BIRD'] },
            { prompt: 'Find 3 words related to school.', answers: ['PENCIL', 'RIVER', 'TEACHER', 'BOOK', 'APPLE', 'MOON'], correct: ['PENCIL', 'TEACHER', 'BOOK'] },
        ],
    },
    {
        id: 'flip-card', icon: '🃏', title: 'Flip Card Challenge', description: 'Flip the cards and match the right word.', type: 'flip-card',
        questions: getFlipMatchTrainingSet('en'),
    },
]

const shuffleBuilderLetters = (letters, answer) => {
    let shuffled = shuffleGameOptions(letters)
    let attempts = 0
    while (shuffled.join('') === answer && attempts < 5) {
        shuffled = shuffleGameOptions(letters)
        attempts += 1
    }
    return shuffled
}

const LOCALIZED_WORD_BUILDER_HINTS = {
    hi: {
        'a fruit': 'फल',
        'a drink': 'पानी',
        'a greeting': 'नमस्ते',
        'a place to learn': 'सीखने की जगह',
        'a reading object': 'पढ़ने की चीज़',
        'a close person': 'करीबी व्यक्ति',
        'a bright object in the sky': 'आसमान में चमकने वाली चीज़',
        'a large animal': 'बड़ा जानवर',
        'a place with many books': 'कई किताबों वाली जगह',
        'a morning meal': 'सुबह का भोजन',
        'a color like grass': 'घास जैसा रंग',
        'a place to live': 'रहने की जगह',
        'a means of travel': 'यात्रा का साधन',
        'a person who teaches': 'शिक्षक',
        'a place to buy food': 'खाना खरीदने की जगह',
        'the opposite of night': 'रात का विपरीत',
        'a season after winter': 'सर्दियों के बाद का मौसम',
        'a piece of furniture': 'फर्नीचर का टुकड़ा',
        'a vehicle with two wheels': 'दो पहियों वाला वाहन',
        'a place to see animals': 'जानवर देखने की जगह',
        'a hot drink': 'गर्म पेय',
        'a yellow fruit': 'पीला फल',
        'a room for cooking': 'खाना पकाने का कमरा',
        'a place for sports': 'खेल का मैदान',
        'a person who drives': 'चालक',
        'the opposite of fast': 'तेज़ का विपरीत',
        'a body of flowing water': 'बहते पानी का हिस्सा',
        'a tool for writing': 'लिखने का औज़ार',
        'a place for airplanes': 'हवाई जहाज़ों का स्थान',
        'a meal in the evening': 'शाम का भोजन',
        'a color like the sky': 'आसमान जैसा रंग',
        'a small animal that says meow': 'म्याऊँ कहने वाला छोटा जानवर',
        'a place to catch a train': 'ट्रेन पकड़ने की जगह',
        'a person who helps sick people': 'बीमार लोगों की मदद करने वाला',
        'the opposite of empty': 'खाली का विपरीत',
        'a bright light in the night sky': 'रात में चमकने वाला प्रकाश',
        'a place with trees': 'पेड़ों वाली जगह',
        'something worn on the feet': 'पैरों में पहना जाने वाला',
        'a building where films are shown': 'सिनेमा घर',
        'a vehicle that flies': 'उड़ने वाला वाहन',
        'a red fruit': 'लाल फल',
        'a place for swimming': 'तैराकी की जगह',
        'a person who cooks food': 'खाना पकाने वाला व्यक्ति',
        'the opposite of old': 'पुराने का विपरीत',
        'a place to borrow books': 'किताबें उधार लेने की जगह',
        'a natural high landform': 'प्राकृतिक ऊँची स्थल आकृति',
        'a container for carrying things': 'चीज़ें रखने का कंटेनर',
        'a room where people sleep': 'जहाँ लोग सोते हैं',
        'a day after Friday': 'शुक्रवार के बाद का दिन',
        'a person who paints': 'चित्रकार',
    },
}

const localizeGameQuestion = (question, game, languageCode) => {
    if (languageCode !== 'hi' || game.id !== 'word-builder' || !question.prompt || !question.prompt.startsWith('Build the word for')) {
        return question
    }

    const hint = question.prompt.replace(/^Build the word for (.*)\.$/, '$1')
    const translatedHint = LOCALIZED_WORD_BUILDER_HINTS.hi[hint] || hint
    return {
        ...question,
        prompt: `शब्द बनाएं: ${translatedHint}।`,
    }
}

const REMOVED_GAME_IDS = new Set(['listening', 'mystery-word', 'runner'])

const getGameLibraryWithListening = (languageCode) => [
    ...(UNIVERSAL_GAMES_BY_LANGUAGE[languageCode] || UNIVERSAL_GAMES_BY_LANGUAGE.en),
    ...(VISUAL_GAMES_BY_LANGUAGE[languageCode] || VISUAL_GAMES_BY_LANGUAGE.en),
    ...(WORD_ARCHER_GAME_BY_LANGUAGE[languageCode] ? [WORD_ARCHER_GAME_BY_LANGUAGE[languageCode]] : []),
    LISTENING_GAME_BY_LANGUAGE[languageCode] || LISTENING_GAME_BY_LANGUAGE.en,
].filter(Boolean)
    .filter((game) => !REMOVED_GAME_IDS.has(game.id))
    .map((game) => ({
        ...game,
        questions: game.questions.map((question) => {
            const localizedQuestion = localizeGameQuestion(question, game, languageCode)
            return {
                ...localizedQuestion,
                answers: localizedQuestion.answers ? shuffleGameOptions(localizedQuestion.answers) : localizedQuestion.answers,
                letters: localizedQuestion.letters ? shuffleBuilderLetters(localizedQuestion.letters, localizedQuestion.correct) : localizedQuestion.letters,
            }
        }),
    }))
const shuffleQuestions = (items) => [...items].sort(() => Math.random() - 0.5)
const createQuestionRound = (items) => shuffleQuestions(items).slice(0, Math.min(5, items.length))
const PERSISTED_ROUND_GAME_IDS = new Set(['word-builder', 'word-hunt', 'flip-card'])

const getRoundStorageKey = (gameId) => `neolit_${gameId}_current_round`

const getSavedGameRound = (gameId, questions) => {
    try {
        const savedIds = JSON.parse(localStorage.getItem(getRoundStorageKey(gameId)) || 'null')
        if (!Array.isArray(savedIds) || savedIds.length !== 5) return null
        const savedQuestions = savedIds.map((id) => questions.find((question) => question.id === id)).filter(Boolean)
        return savedQuestions.length === 5 ? savedQuestions : null
    } catch {
        return null
    }
}

const saveGameRound = (gameId, questions) => {
    localStorage.setItem(getRoundStorageKey(gameId), JSON.stringify(questions.map((question) => question.id)))
}
const DEFAULT_GAME_SETTINGS = { seconds: 12, points: 10 }
const RUNNER_EXTRA_WORDS = {
    en: ['river', 'green', 'book', 'quiet', 'school', 'bright', 'small', 'friend', 'morning', 'street'],
    hi: ['नदी', 'हरा', 'किताब', 'शांत', 'स्कूल', 'उजला', 'छोटा', 'दोस्त', 'सुबह', 'सड़क'],
    kn: ['ನದಿ', 'ಹಸಿರು', 'ಪುಸ್ತಕ', 'ಶಾಂತ', 'ಶಾಲೆ', 'ಬೆಳಕು', 'ಚಿಕ್ಕ', 'ಮಿತ್ರ', 'ಬೆಳಗ್ಗೆ', 'ರಸ್ತೆ'],
    ta: ['ஆறு', 'பச்சை', 'புத்தகம்', 'அமைதி', 'பள்ளி', 'பிரகாசம்', 'சிறிய', 'நண்பர்', 'காலை', 'தெரு'],
    te: ['నది', 'ఆకుపచ్చ', 'పుస్తకం', 'నిశ్శబ్దం', 'పాఠశాల', 'ప్రకాశం', 'చిన్న', 'స్నేహితుడు', 'ఉదయం', 'వీధి'],
}
const LANGUAGE_GAME_LABELS = {
    en: 'English Games',
    hi: 'Hindi Games',
    kn: 'Kannada Games',
    ta: 'Tamil Games',
    te: 'Telugu Games',
}

export default function GamesPage() {
    const nativeLanguageName = localStorage.getItem('neolit_native_language') || 'Hindi'
    const nativeLanguageCode = { English: 'en', Hindi: 'hi', Kannada: 'kn', Tamil: 'ta', Telugu: 'te' }[nativeLanguageName] || 'en'
    const gamesNativeCopy = {
        en: {
            title: 'Play. Learn. Level up.',
            subtitle: 'Every move teaches you something. Pick a world and keep your streak alive.',
            score: 'Session score',
            chooseMode: 'Choose a mode',
            switchGame: 'Switch game',
            endless: 'Endless run · new obstacle',
            question: 'Question',
            seconds: 's',
        },
        hi: {
            title: 'खेलें. सीखें. स्तर बढ़ाएँ.',
            subtitle: 'हर चाल आपको कुछ सिखाती है। कोई दुनिया चुनें और अपनी स्ट्रीक बनाएं।',
            score: 'सत्र स्कोर',
            chooseMode: 'मोड चुनें',
            switchGame: 'गेम बदलें',
            endless: 'अनंत दौड़ · नई बाधा',
            question: 'प्रश्न',
            seconds: 'से',
        },
        kn: {
            title: 'ಆಟವಾಡಿ. ಕಲಿಯಿರಿ. ಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸಿ.',
            subtitle: 'ಪ್ರತಿ ಚಲನೆಯೂ ನಿಮಗೆ ಏನನ್ನಾದರೂ ಕಲಿಸುತ್ತದೆ. ಜಗತ್ತನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಸ್ಟ್ರೀಕ್‍ ಅನ್ನು ಮುಂದುವರಿಸಿ.',
            score: 'ಸೆಷನ್ ಸ್ಕೋರ್',
            chooseMode: 'ಮೋಡ್ ಆಯ್ಕೆಮಾಡಿ',
            switchGame: 'गेम್ ಬದಲಿಸಿ',
            endless: 'ಅನಂತ ಓಟ · ಹೊಸ ಅಡೆತಡೆ',
            question: 'ಪ್ರಶ್ನೆ',
            seconds: 'ಸೆ',
        },
        ta: {
            title: 'விளையாடு. கற்றுக் கொள்ளுங்கள். நிலையை உயர்த்துங்கள்.',
            subtitle: 'ஒவ்வொரு நகர்வும் உங்களுக்கு ஏதாவது கற்பிக்கிறது. ஒரு உலகத்தைத் தேர்ந்தெடுத்து உங்கள் தொடர்ச்சியைத் தொடருங்கள்.',
            score: 'அமர்வு மதிப்பெண்',
            chooseMode: 'மோடையைத் தேர்ந்தெடுக்கவும்',
            switchGame: 'गेम மாற்றவும்',
            endless: 'எல்லையற்ற ஓட்டம் · புதிய தடைகள்',
            question: 'கேள்வி',
            seconds: 'வி',
        },
        te: {
            title: 'ఆట play. నేర్చుకోండి. స్థాయిని పెంచండి.',
            subtitle: 'ప్రతి చొరవ మీకు ఏదో నేర్పిస్తుంది. ఒక ప్రపంచాన్ని ఎంచుకుని మీ స్ట్రీక్‌ను కొనసాగించండి.',
            score: 'సెషన్ స్కోర్',
            chooseMode: 'మోడ్‌ను ఎంచుకోండి',
            switchGame: 'గేమ్ మార్చండి',
            endless: 'అనంత రన్ · కొత్త అడ్డంకి',
            question: 'ప్రశ్న',
            seconds: 'సె',
        },
    }
    const gamesUiCopy = gamesNativeCopy[nativeLanguageCode] || gamesNativeCopy.en
    const [languageCode, setLanguageCode] = useState(() => localStorage.getItem('neolit_selected_language') || 'en')
    const gameContentCopy = {
        en: {
            tapLetters: 'Tap the letters in order',
            clue: 'Clue',
            revealNext: 'Reveal next clue',
            found: 'found',
            spinWheel: 'Spin the wheel',
            currentDistrict: 'Current district',
            missionClue: 'Mission clue',
            cityResponds: 'City responds to your choice',
            missionUpdated: 'Mission updated',
            missionActive: 'Mission active',
            listenHint: 'Listen twice if you need another clue, then choose the meaning you heard.',
            nextQuestion: 'Next question',
            correct: 'Correct! Great work.',
            wrong: 'Try another answer.',
            timeout: 'Time is up! Move to the next challenge.',
            dragonTimeout: 'Time is up! One heart lost.',
            dragonWrong: 'Wrong word. One heart lost.',
            runComplete: 'Run complete',
            runAgain: 'Run again',
        },
        hi: {
            tapLetters: 'अक्षरों को क्रम में चुनें',
            clue: 'सुराग',
            revealNext: 'अगला सुराग दिखाएँ',
            found: 'मिले',
            spinWheel: 'पहिया घुमाएँ',
            currentDistrict: 'वर्तमान क्षेत्र',
            missionClue: 'मिशन सुराग',
            cityResponds: 'शहर आपकी पसंद से प्रतिक्रिया देता है',
            missionUpdated: 'मिशन अपडेट हुआ',
            missionActive: 'मिशन सक्रिय',
            listenHint: 'अगर आपको दूसरा सुराग चाहिए तो दो बार सुनें, फिर सही अर्थ चुनें।',
            nextQuestion: 'अगला सवाल',
            correct: 'सही! बहुत अच्छा।',
            wrong: 'दूसरा उत्तर चुनें।',
            timeout: 'समय समाप्त! अगले चुनौती पर जाएँ।',
            dragonTimeout: 'समय समाप्त! एक दिल खो गया।',
            dragonWrong: 'गलत शब्द। एक दिल खो गया।',
            runComplete: 'रन समाप्त',
            runAgain: 'फिर से चलाएँ',
        },
        kn: {
            tapLetters: 'ಅಕ್ಷರಗಳನ್ನು ಕ್ರಮವಾಗಿ ಆಯ್ಕೆಮಾಡಿ',
            clue: 'ಸುಳಿವು',
            revealNext: 'ಮುಂದಿನ ಸುಳಿವು ತೋರಿಸಿ',
            found: 'ಕಂಡುಬಂದವು',
            spinWheel: 'ಚಕ್ರವನ್ನು ತಿರುಗಿಸಿ',
            currentDistrict: 'ಪ್ರಸ್ತುತ ವಲಯ',
            missionClue: 'ಮಿಷನ್ ಸುಳಿವು',
            cityResponds: 'ನಗರವು ನಿಮ್ಮ ಆಯ್ಕೆಗೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತದೆ',
            missionUpdated: 'ಮಿಷನ್ ನವೀಕರಿಸಲಾಗಿದೆ',
            missionActive: 'ಮಿಷನ್ ಸಕ್ರಿಯವಾಗಿದೆ',
            listenHint: 'ಮತ್ತೊಂದು ಸುಳಿವು ಬೇಕಿದ್ದರೆ ಎರಡನೇ ಬಾರಿ ಕೇಳಿ, ನಂತರ ನೀವು ಕೇಳಿದ ಅರ್ಥವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.',
            nextQuestion: 'ಮುಂದಿನ ಪ್ರಶ್ನೆ',
            correct: 'ಸರಿಯಾಗಿದೆ! ಕ್ಷಮಿಸಬೇಡಿ.',
            wrong: 'ಮತ್ತೊಂದು ಉತ್ತರ ಪ್ರಯತ್ನಿಸಿ.',
            timeout: 'ಸಮಯ ಮುಗಿತು! ಮುಂದಿನ ಸವಾಲಿಗೆ ಹೋಗಿ.',
            dragonTimeout: 'ಸಮಯ ಮುಗಿತು! ಒಂದು ಹೃದಯ ತಪ್ಪಿದೆ.',
            dragonWrong: 'ತಪ್ಪಾದ ಪದ. ಒಂದು ಹೃದಯ ತಪ್ಪಿದೆ.',
            runComplete: 'ರನ್ ಪೂರ್ಣಗೊಂಡಿದೆ',
            runAgain: 'ಮತ್ತೆ ಚಲಿಸಿ',
        },
        ta: {
            tapLetters: 'எழுத்துக்களை வரிசையில் தேர்ந்தெடுக்கவும்',
            clue: 'குறிப்பு',
            revealNext: 'அடுத்த குறிப்பை காட்டவும்',
            found: 'கண்டுபிடிக்கப்பட்டது',
            spinWheel: 'சக்கரத்தை சுழற்றவும்',
            currentDistrict: 'தற்போதைய மாவட்டம்',
            missionClue: 'பணிக் குறிப்பு',
            cityResponds: 'நகரம் உங்கள் தேர்வுக்கு பதிலளிக்கிறது',
            missionUpdated: 'பணி புதுப்பிக்கப்பட்டது',
            missionActive: 'பணி செயல்பாட்டில் உள்ளது',
            listenHint: 'மற்றொரு குறிப்புத் தேவைப்பட்டால் இரண்டு முறை கேளுங்கள், பின்னர் நீங்கள் கேட்ட அர்த்தத்தை தேர்ந்தெடுக்கவும்.',
            nextQuestion: 'அடுத்த கேள்வி',
            correct: 'சரி! சிறப்பாக செய்தீர்கள்.',
            wrong: 'மற்றொரு பதிலை முயற்சிக்கவும்.',
            timeout: 'நேரம் முடிந்துவிட்டது! அடுத்த சவாலுக்கு செல்லுங்கள்.',
            dragonTimeout: 'நேரம் முடிந்துவிட்டது! ஒரு இதயம் இழந்தது.',
            dragonWrong: 'தவறான சொல். ஒரு இதயம் இழந்தது.',
            runComplete: 'ஓட்டம் முடிந்தது',
            runAgain: 'மீண்டும் ஓடவும்',
        },
        te: {
            tapLetters: 'అక్షరాలను క్రమంలో ఎంచుకోండి',
            clue: 'సూచన',
            revealNext: 'తదుపరి సూచనను చూపించండి',
            found: 'కనబడింది',
            spinWheel: 'చక్రాన్ని తిప్పండి',
            currentDistrict: 'ప్రస్తుత జిల్లా',
            missionClue: 'మిషన్ సూచన',
            cityResponds: 'నగరం మీ ఎంపికకు స్పందిస్తుంది',
            missionUpdated: 'మిషన్ నవీకరించబడింది',
            missionActive: 'మిషన్ సక్రియంగా ఉంది',
            listenHint: 'మరొక సూచన అవసరమైతే రెండుసార్లు వినండి, తర్వాత మీరు విన్న అర్థాన్ని ఎంచుకోండి.',
            nextQuestion: 'తదుపరి ప్రశ్న',
            correct: 'సరైనది! బాగా చేసారు.',
            wrong: 'మరొక సమాధానాన్ని ప్రయత్నించండి.',
            timeout: 'సమయం ముగిసింది! తదుపరి సవాలుకు వెళ్లండి.',
            dragonTimeout: 'సమయం ముగిసింది! ఒక హృదయం కోల్పోయింది.',
            dragonWrong: 'తప్పు పదం. ఒక హృదయం కోల్పోయింది.',
            runComplete: 'రన్ పూర్తయింది',
            runAgain: 'మళ్లీ చక్రం',
        },
    }
    const localizedGameCopy = gameContentCopy[languageCode] || gameContentCopy.en
    const games = useMemo(() => {
        return getGameLibraryWithListening(languageCode).map((game) => ({
            ...game,
            languageLabel: LANGUAGE_GAME_LABELS[languageCode] || LANGUAGE_GAME_LABELS.en,
        }))
    }, [languageCode])

    const gameGroups = useMemo(() => {
        const activeLabel = LANGUAGE_GAME_LABELS[languageCode] || LANGUAGE_GAME_LABELS.en
        return [{
            label: activeLabel,
            games: games.filter((game) => game.languageLabel === activeLabel),
        }].filter((group) => group.games.length > 0)
    }, [games, languageCode])

    const [selectedId, setSelectedId] = useState(games[0].id)
    const [answer, setAnswer] = useState('')
    const [score, setScore] = useState(0)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(12)
    const [questionOrder, setQuestionOrder] = useState(() => createQuestionRound(games[0].questions))
    const [fallingWords, setFallingWords] = useState([])
    const [runnerWords, setRunnerWords] = useState([])
    const [memorySelection, setMemorySelection] = useState([])
    const [sentenceWords, setSentenceWords] = useState([])
    const [builderLetters, setBuilderLetters] = useState([])
    const [mysteryClueIndex, setMysteryClueIndex] = useState(0)
    const [huntFound, setHuntFound] = useState([])
    const [flipCardDeck, setFlipCardDeck] = useState([])
    const [selectedFlipCards, setSelectedFlipCards] = useState([])
    const [matchedFlipCards, setMatchedFlipCards] = useState([])
    const [flipCardLocked, setFlipCardLocked] = useState(false)
    const [flipCardStatus, setFlipCardStatus] = useState(null)
    const [dragonHealth, setDragonHealth] = useState(3)
    const [dragonCoins, setDragonCoins] = useState(0)
    const [dragonDistance, setDragonDistance] = useState(0)
    const [dragonTargets, setDragonTargets] = useState([])
    const [villageBuildings, setVillageBuildings] = useState(0)
    const [villageWood, setVillageWood] = useState(0)
    const [runnerFallen, setRunnerFallen] = useState(false)
    const [shooterAim, setShooterAim] = useState(50)
    const [shooterAimY, setShooterAimY] = useState(55)
    const [shotFlash, setShotFlash] = useState(false)
    const [shotTarget, setShotTarget] = useState(null)
    const [archerShot, setArcherShot] = useState(null)
    const [shooterAmmo, setShooterAmmo] = useState(6)
    const [shooterStreak, setShooterStreak] = useState(0)
    const [shooterMisses, setShooterMisses] = useState(0)
    const gameStartedAt = useRef(Date.now())
    const difficultySettings = DEFAULT_GAME_SETTINGS

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
        const nextGames = getGameLibraryWithListening(languageCode)
        setSelectedId((current) => (nextGames.some((game) => game.id === current) ? current : nextGames[0].id))
        setAnswer('')
        setQuestionIndex(0)
        setTimeLeft(difficultySettings.seconds)
    }, [languageCode, difficultySettings.seconds])

    const selectedGame = games.find((game) => game.id === selectedId) || games[0]
    const gameTimeLimit = selectedGame.type === 'listening' ? 30 : difficultySettings.seconds
    const questionOrderMatchesGame = questionOrder.some((item) => selectedGame.questions.includes(item))
    const activeQuestionOrder = questionOrderMatchesGame ? questionOrder : selectedGame.questions
    const question = activeQuestionOrder[questionIndex % activeQuestionOrder.length] || selectedGame.questions[0]

    useEffect(() => {
        const savesRound = PERSISTED_ROUND_GAME_IDS.has(selectedGame.id)
        const savedRound = savesRound ? getSavedGameRound(selectedGame.id, selectedGame.questions) : null
        const nextOrder = savedRound || createQuestionRound(selectedGame.questions)
        if (savesRound && !savedRound) saveGameRound(selectedGame.id, nextOrder)
        setQuestionOrder(nextOrder)
        setQuestionIndex(0)
        setAnswer('')
        setMemorySelection([])
        setSentenceWords([])
        setBuilderLetters([])
        setMysteryClueIndex(0)
        setHuntFound([])
        setSelectedFlipCards([])
        setMatchedFlipCards([])
        setFlipCardLocked(false)
        setFlipCardDeck([])
        setFlipCardStatus(null)
        setTimeLeft(gameTimeLimit)
        setDragonHealth(3)
        setDragonCoins(0)
        setDragonDistance(0)
        setDragonTargets([])
        setVillageBuildings(0)
        setVillageWood(0)
        setRunnerFallen(false)
        setShooterAim(50)
        setShooterAimY(55)
        setShotFlash(false)
        setShotTarget(null)
        setArcherShot(null)
    }, [selectedGame, gameTimeLimit])

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
        if (selectedGame.type !== 'runner') {
            setRunnerWords([])
            return
        }

        const extraWords = RUNNER_EXTRA_WORDS[languageCode] || RUNNER_EXTRA_WORDS.en
        const fallingWordPool = shuffleQuestions([...question.answers, ...extraWords])
        setRunnerWords(fallingWordPool.map((text, index) => ({
            text,
            correct: text === question.correct,
            x: [18, 50, 82][index % 3],
            y: -64 - (index * 58),
            speed: 1.45 + Math.random() * 0.35,
        })))
    }, [selectedGame.type, question.answers, question.correct, languageCode])

    useEffect(() => {
        if (selectedGame.type !== 'dragon') {
            setDragonTargets([])
            return
        }

        const dragonChoices = shuffleQuestions([
            question.correct,
            ...question.answers.filter((text) => text !== question.correct),
        ]).slice(0, 2)
        setDragonTargets(dragonChoices.map((text, index) => ({
            text,
            correct: text === question.correct,
            x: index === 0 ? 32 : 68,
        })))
    }, [selectedGame.type, question.answers, question.correct, languageCode])

    useEffect(() => {
        if (answer || selectedGame.type !== 'runner') return undefined

        const intervalId = window.setInterval(() => {
            setRunnerWords((current) => {
                const updated = current.map((word) => ({ ...word, y: word.y + word.speed }))
                const missedCorrectWord = updated.some((word) => word.correct && word.y >= 88)

                if (missedCorrectWord) {
                    setRunnerFallen(true)
                    setAnswer('timeout')
                }

                return updated.filter((word) => word.y < 110)
            })
        }, 45)

        return () => window.clearInterval(intervalId)
    }, [selectedGame.type, answer, questionIndex, languageCode])

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
                    if (selectedGame.type === 'dragon') {
                        setDragonHealth((health) => Math.max(0, health - 1))
                    }
                    if (selectedGame.type === 'runner') {
                        setRunnerFallen(true)
                    }
                    setAnswer('timeout')
                    return 0
                }

                return current - 1
            })
        }, 1000)

        return () => window.clearInterval(timer)
    }, [answer, questionIndex, selectedGame.id, gameTimeLimit])

    useEffect(() => {
        if (answer !== 'timeout') return undefined
        if (selectedGame.type === 'dragon' && dragonHealth === 0) return undefined

        const timeoutId = window.setTimeout(() => {
            nextQuestion()
        }, 1100)

        return () => window.clearTimeout(timeoutId)
    }, [answer, selectedGame.type, dragonHealth, questionIndex])

    const chooseGame = (gameId) => {
        const nextGame = games.find((game) => game.id === gameId) || games[0]
        setSelectedId(nextGame.id)
        setAnswer('')
        setQuestionIndex(0)
        setTimeLeft(gameTimeLimit)
        setRunnerFallen(false)
        setShooterAim(50)
        setShooterAimY(55)
        setShotTarget(null)
        setShooterAmmo(6)
        setShooterStreak(0)
        setShooterMisses(0)
        setBuilderLetters([])
        setMysteryClueIndex(0)
        setHuntFound([])
        setSelectedFlipCards([])
        setMatchedFlipCards([])
        setFlipCardLocked(false)
        setFlipCardDeck([])
        setFlipCardStatus(null)
        setShooterAmmo(6)
        setShooterStreak(0)
        setShooterMisses(0)
    }

    const restartDragonRun = () => {
        setQuestionIndex(0)
        setAnswer('')
        setDragonHealth(3)
        setDragonCoins(0)
        setDragonDistance(0)
        setTimeLeft(gameTimeLimit)
        setQuestionOrder(createQuestionRound(selectedGame.questions))
    }

    const chooseAnswer = (choice) => {
        if (answer || (selectedGame.type === 'dragon' && dragonHealth === 0)) return

        const isCorrect = choice === question.correct
        setAnswer(choice)
        if (selectedGame.type === 'archer') {
            const targetX = isCorrect ? 50 : 18 + Math.random() * 64
            const targetY = isCorrect ? 52 : 18 + Math.random() * 56
            setArcherShot({ x: targetX, y: targetY, correct: isCorrect })
            window.setTimeout(() => setArcherShot(null), 900)
        }
        learningApi.recordGameActivity({
            game_id: selectedGame.id,
            score: isCorrect ? difficultySettings.points : 0,
            duration_seconds: Math.round((Date.now() - gameStartedAt.current) / 1000),
        }).catch(() => { })
        if (selectedGame.type === 'runner') {
            setShotFlash(true)
            window.setTimeout(() => setShotFlash(false), 180)
        }
        if (isCorrect) setScore((current) => current + difficultySettings.points)
        if (selectedGame.type === 'dragon') {
            if (isCorrect) {
                setDragonCoins((current) => current + 1)
                setDragonDistance((current) => current + 25)
                setVillageBuildings((current) => current + 1)
                setVillageWood((current) => current + 5)
                setVillageBuildings(0)
                setVillageWood(0)
            } else {
                setDragonHealth((current) => Math.max(0, current - 1))
            }
        }
        if (selectedGame.type === 'runner' && !isCorrect) {
            setRunnerFallen(true)
            setShooterMisses((current) => current + 1)
            setShooterStreak(0)
        } else if (selectedGame.type === 'runner' && isCorrect) {
            setShooterStreak((current) => current + 1)
        }
        if (window.speechSynthesis) {
            const cue = new SpeechSynthesisUtterance(isCorrect ? 'Correct' : 'Try again')
            cue.volume = 0.25
            cue.rate = 1.2
            window.speechSynthesis.speak(cue)
        }
    }

    const chooseDragonTarget = (choice) => {
        if (answer || selectedGame.type !== 'dragon') return
        chooseAnswer(choice)
        window.setTimeout(nextQuestion, 520)
    }

    const playListeningClue = () => {
        if (!window.speechSynthesis || selectedGame.type !== 'listening') return

        window.speechSynthesis.cancel()
        const speech = new SpeechSynthesisUtterance(question.audioPhrase)
        speech.lang = 'en-US'
        speech.rate = 0.82
        window.speechSynthesis.speak(speech)
    }

    const catchWord = (choice) => {
        if (answer) return

        const isCorrect = choice === question.correct
        setAnswer(choice)
        learningApi.recordGameActivity({
            game_id: selectedGame.id,
            score: isCorrect ? difficultySettings.points : 0,
            duration_seconds: Math.round((Date.now() - gameStartedAt.current) / 1000),
        }).catch(() => { })
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

    const chooseBuilderLetter = (letter, index) => {
        if (answer) return
        const nextLetters = [...builderLetters, { letter, index }]
        setBuilderLetters(nextLetters)
        if (nextLetters.length === question.correct.length) {
            chooseAnswer(nextLetters.map((item) => item.letter).join(''))
        }
    }

    const removeBuilderLetter = (index) => {
        if (!answer) setBuilderLetters((current) => current.filter((item) => item.index !== index))
    }

    const revealMysteryClue = () => {
        if (!answer) setMysteryClueIndex((current) => Math.min(current + 1, question.clues.length - 1))
    }

    const chooseHuntWord = (word) => {
        if (answer || huntFound.includes(word)) return
        const nextFound = [...huntFound, word]
        setHuntFound(nextFound)
        if (nextFound.length === question.correct.length) {
            const isCorrect = nextFound.every((item) => question.correct.includes(item))
            setAnswer(isCorrect ? 'correct' : 'wrong')
            if (isCorrect) setScore((current) => current + difficultySettings.points)
        }
    }

    useEffect(() => {
        if (selectedGame.type !== 'flip-card') {
            setFlipCardDeck([])
            setSelectedFlipCards([])
            setMatchedFlipCards([])
            setFlipCardLocked(false)
            return
        }

        const currentQuestion = selectedGame.questions?.[questionIndex % selectedGame.questions.length]
        const questionChoices = [...new Set((currentQuestion?.answers || []).map((answer) => String(answer).trim()).filter(Boolean))]
        const hardPool = questionChoices.filter((choice) => choice.length >= 4)
        const deckChoices = shuffleQuestions((hardPool.length ? hardPool : questionChoices).slice(0, 4))
        const flipPairs = deckChoices.flatMap((choice, answerIndex) => {
            const choiceKey = String(choice).toUpperCase()
            return [
                { id: `${selectedGame.id}-${choiceKey}-a-${answerIndex}`, pairId: choiceKey, display: choice, face: 'word' },
                { id: `${selectedGame.id}-${choiceKey}-b-${answerIndex}`, pairId: choiceKey, display: choice, face: 'word-alt' },
            ]
        })

        setFlipCardDeck(shuffleQuestions(flipPairs))
        setSelectedFlipCards([])
        setMatchedFlipCards([])
        setFlipCardLocked(false)
        setAnswer('')
    }, [selectedGame, questionIndex])

    const flipCardChoice = (cardId) => {
        if (answer || flipCardLocked) return
        const card = flipCardDeck.find((item) => item.id === cardId)
        if (!card || matchedFlipCards.includes(cardId) || selectedFlipCards.includes(cardId)) return

        const nextSelection = [...selectedFlipCards, cardId]
        setSelectedFlipCards(nextSelection)

        if (nextSelection.length !== 2) return

        setFlipCardLocked(true)
        const [firstId, secondId] = nextSelection
        const firstCard = flipCardDeck.find((item) => item.id === firstId)
        const secondCard = flipCardDeck.find((item) => item.id === secondId)
        const isMatch = firstCard && secondCard && firstCard.pairId === secondCard.pairId

        if (isMatch) {
            setMatchedFlipCards((current) => [...current, firstId, secondId])
            setFlipCardStatus('correct')
            setAnswer('')
            setScore((current) => current + difficultySettings.points)
            learningApi.recordGameActivity({
                game_id: selectedGame.id,
                score: difficultySettings.points,
                duration_seconds: Math.round((Date.now() - gameStartedAt.current) / 1000),
            }).catch(() => { })
            window.setTimeout(() => {
                setSelectedFlipCards([])
                setFlipCardLocked(false)
            }, 500)
            return
        }

        setFlipCardStatus('wrong')
        setAnswer('')
        window.setTimeout(() => {
            setSelectedFlipCards([])
            setFlipCardLocked(false)
            setFlipCardStatus(null)
        }, 900)
    }

    const nextQuestion = () => {
        if (selectedGame.type === 'runner' && questionIndex + 1 >= questionOrder.length) {
            setQuestionOrder(createQuestionRound(selectedGame.questions))
        }
        if (PERSISTED_ROUND_GAME_IDS.has(selectedGame.id) && questionIndex + 1 >= questionOrder.length) {
            const nextRound = createQuestionRound(selectedGame.questions)
            saveGameRound(selectedGame.id, nextRound)
            setQuestionOrder(nextRound)
        }
        setQuestionIndex((current) => (current + 1) % questionOrder.length)
        setAnswer('')
        setMemorySelection([])
        setSentenceWords([])
        setBuilderLetters([])
        setMysteryClueIndex(0)
        setHuntFound([])
        setSelectedFlipCards([])
        setMatchedFlipCards([])
        setFlipCardLocked(false)
        setFlipCardDeck([])
        setFlipCardStatus(null)
        setTimeLeft(gameTimeLimit)
        setRunnerFallen(false)
        setShooterAmmo(6)
    }

    const moveShooter = (horizontal, vertical) => {
        if (selectedGame.type !== 'runner') return
        setShooterAim((current) => Math.max(12, Math.min(88, current + horizontal)))
        setShooterAimY((current) => Math.max(25, Math.min(78, current + vertical)))
    }

    const shootCurrentWord = () => {
        if (selectedGame.type !== 'runner' || answer || !runnerWords.length || shooterAmmo === 0) return

        const target = [...runnerWords]
            .filter((word) => word.y > -5 && word.y < 96)
            .sort((first, second) => Math.abs(first.x - shooterAim) - Math.abs(second.x - shooterAim))[0]

        shootWord(target)
    }

    const shootWord = (target) => {
        if (selectedGame.type !== 'runner' || answer || shooterAmmo === 0) return

        const selectedTarget = target || { text: '', x: shooterAim, y: 70 }
        setShooterAmmo((current) => current - 1)
        setShotTarget({ x: selectedTarget.x, y: selectedTarget.y })
        setShotFlash(true)
        window.setTimeout(() => {
            setShotFlash(false)
            setShotTarget(null)
        }, 220)
        chooseAnswer(selectedTarget.text)
    }

    const reloadShooter = () => {
        if (selectedGame.type === 'runner' && !answer) setShooterAmmo(6)
    }

    return (
        <main className="games-page">
            <section className="games-hero" aria-labelledby="games-title">
                <div>
                    <span className="games-kicker">NeoLit Arcade</span>
                    <h1 id="games-title">{gamesUiCopy.title}</h1>
                    <p>{gamesUiCopy.subtitle}</p>
                </div>
                <div className="games-score" aria-label={`${gamesUiCopy.score} ${score} points`}>
                    <span>{gamesUiCopy.score}</span>
                    <strong>{score}<small> pts</small></strong>
                </div>
            </section>
            <section className="games-selector" aria-label="Choose a game">
                <div className="games-selector-heading">
                    <span className="games-kicker">{gamesUiCopy.chooseMode}</span>
                    <small>{gamesUiCopy.switchGame}</small>
                </div>

                {gameGroups.map((group) => (
                    <div key={group.label} className="games-language-group">
                        <h3>{group.label}</h3>
                        <div className="games-grid">
                            {group.games.map((game) => (
                                <button key={game.id} type="button" className={`game-card ${selectedId === game.id ? 'active' : ''}`} onClick={() => chooseGame(game.id)}>
                                    <span className="game-card-icon">{game.icon}</span>
                                    <strong>{game.title}</strong>
                                    <small>{game.description}</small>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            <section className="game-board">
                <div className="game-board-heading">
                    <span className="games-kicker active-mode">{selectedGame.icon} {selectedGame.title}</span>
                    <span>+{difficultySettings.points} pts</span>
                </div>
                <p className="game-board-description">{selectedGame.description}</p>
                <div className="game-meta-row">
                    <span className="game-question-count">{selectedGame.type === 'dragon' || selectedGame.type === 'runner' ? gamesUiCopy.endless : `${gamesUiCopy.question} ${Math.min(questionIndex + 1, activeQuestionOrder.length)}/${activeQuestionOrder.length}`}</span>
                    <span className={`game-timer ${timeLeft <= 4 ? 'warning' : ''}`}>{timeLeft}{gamesUiCopy.seconds}</span>
                </div>
                {selectedGame.type !== 'memory' && <h2>{question.prompt}</h2>}

                {selectedGame.type === 'archer' ? (
                    <div className="special-game-panel archer-stage">
                        <div className="archer-target-board" aria-label="Archer target board">
                            <span className="archer-ring archer-ring-outer" />
                            <span className="archer-ring archer-ring-mid" />
                            <span className="archer-ring archer-ring-inner" />
                            <span className="archer-bullseye">★</span>
                            {archerShot && (
                                <span
                                    className={`archer-hit ${archerShot.correct ? 'correct' : 'wrong'}`}
                                    style={{ left: `${archerShot.x}%`, top: `${archerShot.y}%` }}
                                    aria-label={archerShot.correct ? 'Correct shot hit the target' : 'Wrong shot missed the target'}
                                >
                                    ➤
                                </span>
                            )}
                        </div>
                        <p className="special-game-label">Aim at the correct target</p>
                        <div className="game-answer-grid archer-grid">
                            {question.answers.map((choice) => (
                                <button
                                    key={choice}
                                    type="button"
                                    className={`archer-target ${answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => chooseAnswer(choice)}
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : selectedGame.type === 'dragon' ? (
                    <div className="dragon-game-stage">
                        <div className="dragon-game-scene village-scene">
                            <span className="dragon-cloud dragon-cloud-one" />
                            <span className="dragon-cloud dragon-cloud-two" />
                            <span className="dragon-mountain dragon-mountain-one" />
                            <span className="dragon-mountain dragon-mountain-two" />
                            <span className="dragon-fire dragon-fire-one">🔥</span>
                            <span className="dragon-fire dragon-fire-two">🔥</span>
                            <span className="dragon-ground" />
                            <div className="village-buildings" aria-label="Dragon village progress">
                                {villageBuildings >= 1 && <span>🏠</span>}
                                {villageBuildings >= 2 && <span>🌾</span>}
                                {villageBuildings >= 3 && <span>🛖</span>}
                                {villageBuildings >= 4 && <span>🏯</span>}
                            </div>
                            <span className="dragon-character">🐉</span>
                            <span className="dragon-obstacle dragon-obstacle-one">▲</span>
                            <span className="dragon-obstacle dragon-obstacle-two">▲</span>
                            <div className="dragon-target-lanes">
                                {dragonTargets.map((target, index) => (
                                    <button
                                        key={`${target.text}-${index}`}
                                        type="button"
                                        className={`dragon-target ${answer === target.text ? (target.correct ? 'correct' : 'wrong') : ''}`}
                                        style={{ left: `${target.x}%` }}
                                        onClick={() => chooseDragonTarget(target.text)}
                                    >
                                        <span className="dragon-target-image" aria-hidden="true">{index === 0 ? '🧱' : '🪵'}</span>
                                        <strong>{target.text}</strong>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="dragon-run-hud" aria-label="Dragon run status">
                            <span>❤️ {dragonHealth}/3</span>
                            <span>🪵 {villageWood}</span>
                            <span>🏘️ {villageBuildings}</span>
                            <strong>Village level {Math.floor(villageBuildings / 3) + 1}</strong>
                        </div>
                        <p className="visual-game-instruction">Choose the right word to build the next village structure.</p>
                    </div>
                ) : selectedGame.type === 'runner' || selectedGame.type === 'drive' ? (
                    <div className={`visual-game-stage ${selectedGame.type} ${runnerFallen ? 'runner-fallen' : ''}`}>
                        <div className="visual-game-scene">
                            <span className="visual-sun" />
                            <span className="visual-cloud visual-cloud-one" />
                            <span className="visual-cloud visual-cloud-two" />
                            {selectedGame.type === 'drive' && (
                                <>
                                    <span className="visual-road-line visual-road-line-one" />
                                    <span className="visual-road-line visual-road-line-two" />
                                </>
                            )}
                            {selectedGame.type === 'runner' ? (
                                <span className={`visual-player shooter-character ${shotFlash ? 'shooting' : ''}`} style={{ left: `${shooterAim}%`, '--gun-angle': `${-25 - ((shooterAimY - 50) * 0.8)}deg` }}>
                                    <span className="shooter-cowboy">🤠</span>
                                    <span className="shooter-gun" aria-label="Western revolver">
                                        <i className="gun-barrel" />
                                        <i className="gun-cylinder" />
                                        <i className="gun-grip" />
                                    </span>
                                    {shotFlash && <span className="shooter-muzzle">✦</span>}
                                </span>
                            ) : <span className="visual-player">🚗</span>}
                            <div className="visual-word-lanes">
                                {(selectedGame.type === 'runner' ? runnerWords : question.answers.map((text) => ({ text, x: 0, y: 0 }))).map((word, index) => (
                                    <button
                                        key={`${word.text}-${index}`}
                                        type="button"
                                        className={`visual-word ${answer === word.text ? (word.text === question.correct ? 'correct' : 'wrong') : ''}`}
                                        style={selectedGame.type === 'runner' ? { left: `${word.x}%`, top: `${word.y}%` } : undefined}
                                        onClick={() => selectedGame.type === 'runner' ? shootWord(word) : chooseAnswer(word.text)}
                                    >
                                        {word.text}
                                    </button>
                                ))}
                            </div>
                            {selectedGame.type === 'runner' && shotTarget && (
                                <span
                                    className="shooter-bullet-tracer"
                                    style={{
                                        left: `${shooterAim}%`,
                                        top: '78%',
                                        width: `${Math.max(8, Math.hypot(shotTarget.x - shooterAim, shotTarget.y - 78))}%`,
                                        transform: `rotate(${Math.atan2(shotTarget.y - 78, shotTarget.x - shooterAim) * (180 / Math.PI)}deg)`,
                                    }}
                                />
                            )}
                            {selectedGame.type === 'runner' && (
                                <div className="shooter-hud" aria-label="Word Shooter status">
                                    <span>🔸 Ammo {shooterAmmo}/6</span>
                                    <span>🔥 Streak {shooterStreak}</span>
                                    <span>✕ Misses {shooterMisses}</span>
                                </div>
                            )}
                            {selectedGame.type === 'runner' && (
                                <div className="shooter-controls" aria-label="Shooter controls">
                                    <button type="button" aria-label="Aim up" onClick={() => moveShooter(0, -12)}>↑</button>
                                    <button type="button" aria-label="Aim left" onClick={() => moveShooter(-12, 0)}>←</button>
                                    <button type="button" className="shooter-fire" onClick={shootCurrentWord}>Shoot</button>
                                    <button type="button" aria-label="Aim right" onClick={() => moveShooter(12, 0)}>→</button>
                                    <button type="button" aria-label="Aim down" onClick={() => moveShooter(0, 12)}>↓</button>
                                    <button type="button" className="shooter-reload" onClick={reloadShooter}>Reload</button>
                                </div>
                            )}
                        </div>
                        <p className="visual-game-instruction">{selectedGame.type === 'runner' ? 'Shoot the correct word before it reaches the bottom.' : 'Choose the correct road to keep driving.'}</p>
                    </div>
                ) : selectedGame.type === 'listening' ? (
                    <div className="listening-board">
                        <div className="listening-studio" aria-hidden="true">
                            <span className="studio-mic">🎙️</span>
                            <span className="studio-desk" />
                            <span className="studio-light" />
                        </div>
                        <button type="button" className="listening-play-button" onClick={playListeningClue}>
                            <span aria-hidden="true">▶</span>
                            {selectedGame.listenLabel}
                        </button>
                        <div className="listening-wave" aria-hidden="true">
                            <i /><i /><i /><i /><i /><i /><i /><i /><i />
                        </div>
                        <p className="listening-hint">{localizedGameCopy.listenHint}</p>
                        <div className="listening-answer-grid">
                            {question.answers.map((choice) => (
                                <button
                                    key={choice}
                                    type="button"
                                    className={`listening-answer ${answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => chooseAnswer(choice)}
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : selectedGame.type === 'city' ? (
                    <div className="city-mission-board">
                        <div className="city-world-scene" aria-hidden="true">
                            <span className="city-building city-building-one" />
                            <span className="city-building city-building-two" />
                            <span className="city-building city-building-three" />
                            <span className="city-road" />
                        </div>
                        <div className="city-mission-location">
                            <span>{localizedGameCopy.currentDistrict}</span>
                            <strong>{question.location}</strong>
                        </div>
                        <div className="city-status-strip">
                            <span><i className="city-status-dot" /> {localizedGameCopy.cityResponds}</span>
                            <strong>{answer ? localizedGameCopy.missionUpdated : localizedGameCopy.missionActive}</strong>
                        </div>
                        <p className="city-mission-clue"><span>{localizedGameCopy.missionClue}</span>{question.clue}</p>
                        <div className="city-choice-grid">
                            {question.answers.map((choice) => (
                                <button
                                    key={choice}
                                    type="button"
                                    className={`city-choice ${answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => chooseAnswer(choice)}
                                >
                                    <span className="city-choice-marker">{String.fromCharCode(65 + question.answers.indexOf(choice))}</span>
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : selectedGame.type === 'word-builder' ? (
                    <div className="special-game-panel word-builder-panel">
                        <p className="special-game-label">{localizedGameCopy.tapLetters}</p>
                        <div className="builder-answer">{builderLetters.map((item) => <button key={item.index} type="button" onClick={() => removeBuilderLetter(item.index)}>{item.letter}</button>)}</div>
                        <div className="builder-letters">{question.letters.map((letter, index) => <button key={`${letter}-${index}`} type="button" disabled={builderLetters.some((item) => item.index === index)} onClick={() => chooseBuilderLetter(letter, index)}>{letter}</button>)}</div>
                    </div>
                ) : selectedGame.type === 'mystery-word' ? (
                    <div className="special-game-panel mystery-panel">
                        <p className="special-game-label">{localizedGameCopy.clue} {mysteryClueIndex + 1} / {question.clues.length}</p>
                        <strong>{question.clues[mysteryClueIndex]}</strong>
                        <div className="game-answer-grid">{question.answers.map((choice) => <button key={choice} type="button" onClick={() => chooseAnswer(choice)}>{choice}</button>)}</div>
                        <button type="button" className="game-secondary-button" onClick={revealMysteryClue} disabled={mysteryClueIndex === question.clues.length - 1}>{localizedGameCopy.revealNext}</button>
                    </div>
                ) : selectedGame.type === 'word-hunt' ? (
                    <div className="special-game-panel word-hunt-panel">
                        <p className="special-game-label">{huntFound.length}/{question.correct.length} {localizedGameCopy.found}</p>
                        <div className="game-answer-grid">{question.answers.map((choice) => <button key={choice} type="button" className={huntFound.includes(choice) ? 'selected' : ''} onClick={() => chooseHuntWord(choice)}>{choice}</button>)}</div>
                    </div>
                ) : selectedGame.type === 'flip-card' ? (
                    <div className="special-game-panel flip-card-panel">
                        <div className="flip-card-header">
                            <p className="special-game-label">Flip Card Challenge</p>
                            <h3>{question.prompt}</h3>
                        </div>
                        <div className="flip-match-grid">
                            {flipCardDeck.map((card) => {
                                const isVisible = selectedFlipCards.includes(card.id) || matchedFlipCards.includes(card.id)
                                return (
                                    <button
                                        key={card.id}
                                        type="button"
                                        className={`flip-match-card ${isVisible ? 'flipped' : ''} ${matchedFlipCards.includes(card.id) ? 'matched' : ''}`}
                                        onClick={() => flipCardChoice(card.id)}
                                        aria-label={`Flip card ${card.display}`}
                                    >
                                        <span className="flip-match-inner">
                                            <span className="flip-match-face flip-match-front">?</span>
                                            <span className="flip-match-face flip-match-back">{card.display}</span>
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        {flipCardStatus && (
                            <>
                                <p className={`game-feedback ${flipCardStatus === 'correct' ? 'correct' : 'wrong'}`}>
                                    {flipCardStatus === 'correct' ? localizedGameCopy.correct : localizedGameCopy.wrong}
                                </p>
                                <button type="button" className="game-next-button" onClick={nextQuestion}>{localizedGameCopy.nextQuestion}</button>
                            </>
                        )}
                    </div>
                ) : selectedGame.type === 'cards' ? (
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
                        {[...question.answers, ...(MEMORY_DECOYS_BY_LANGUAGE[languageCode] || MEMORY_DECOYS_BY_LANGUAGE.en)].map((choice) => {
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

                {selectedGame.type === 'dragon' && dragonHealth === 0 ? (
                    <div className="dragon-game-over">
                        <strong>{localizedGameCopy.runComplete}</strong>
                        <span>{dragonDistance}m reached · {dragonCoins} coins collected</span>
                        <button type="button" className="game-next-button" onClick={restartDragonRun}>{localizedGameCopy.runAgain}</button>
                    </div>
                ) : (
                    <>
                        {selectedGame.type !== 'flip-card' && answer && <p className={`game-feedback ${answer === question.correct || (selectedGame.type === 'word-hunt' && answer === 'correct') ? 'correct' : 'wrong'}`}>{answer === 'timeout' ? (selectedGame.type === 'dragon' ? localizedGameCopy.dragonTimeout : localizedGameCopy.timeout) : answer === question.correct || (selectedGame.type === 'word-hunt' && answer === 'correct') ? localizedGameCopy.correct : selectedGame.type === 'dragon' ? localizedGameCopy.dragonWrong : localizedGameCopy.wrong}</p>}
                        {selectedGame.type !== 'flip-card' && answer && <button type="button" className="game-next-button" onClick={nextQuestion}>{localizedGameCopy.nextQuestion}</button>}
                    </>
                )}
            </section>
        </main>
    )
}
