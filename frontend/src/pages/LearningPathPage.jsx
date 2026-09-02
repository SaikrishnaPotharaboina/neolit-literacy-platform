import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { languages } from '../data/languages'

const knowledgeLevelsByLanguage = {
    en: [
        { id: 1, label: "I'm new to English" },
        { id: 2, label: 'I know some common words' },
        { id: 3, label: 'I can have basic conversations' },
        { id: 4, label: 'I can talk about various topics' },
        { id: 5, label: 'I can discuss most topics in detail' },
    ],
    hi: [
        { id: 1, label: "I'm new to Hindi" },
        { id: 2, label: 'I know some common words' },
        { id: 3, label: 'I can have basic conversations' },
        { id: 4, label: 'I can talk about various topics' },
        { id: 5, label: 'I can discuss most topics in detail' },
    ],
    kn: [
        { id: 1, label: "I'm new to Kannada" },
        { id: 2, label: 'I know some common words' },
        { id: 3, label: 'I can have basic conversations' },
        { id: 4, label: 'I can talk about various topics' },
        { id: 5, label: 'I can discuss most topics in detail' },
    ],
    ta: [
        { id: 1, label: "I'm new to Tamil" },
        { id: 2, label: 'I know some common words' },
        { id: 3, label: 'I can have basic conversations' },
        { id: 4, label: 'I can talk about various topics' },
        { id: 5, label: 'I can discuss most topics in detail' },
    ],
    te: [
        { id: 1, label: "I'm new to Telugu" },
        { id: 2, label: 'I know some common words' },
        { id: 3, label: 'I can have basic conversations' },
        { id: 4, label: 'I can talk about various topics' },
        { id: 5, label: 'I can discuss most topics in detail' },
    ],
}

const getRouteOptions = (languageName) => [
    {
        id: 'scratch',
        title: 'Start from scratch',
        description: `Take the easiest lesson of the ${languageName} course`,
        badge: '1',
        badgeColor: 'gold',
    },
    {
        id: 'level',
        title: 'Find my level',
        description: `Let ${languageName} lessons recommend where you should start learning`,
        badge: '2',
        badgeColor: 'blue',
    },
]

const lessonBankByLanguage = {
    hi: [
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Apple”?',
            options: [
                { id: 1, label: 'सेब', emoji: '🍎', accent: 'red' },
                { id: 2, label: 'केला', emoji: '🍌', accent: 'yellow' },
                { id: 3, label: 'किताब', emoji: '📘', accent: 'blue' },
                { id: 4, label: 'आँर', emoji: '🧑‍🌾', accent: 'amber' },
                { id: 5, label: 'साड़ी', emoji: '👗', accent: 'pink' },
            ],
            correctOption: 1,
            solution: 'सेब',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'एक सेब',
            correctText: 'an apple',
            options: ['apple', 'is', 'This', 'an'],
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'वह किताब',
            correctText: 'That book',
            options: ['book', 'boy', 'This', 'That'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Book”?',
            options: [
                { id: 1, label: 'बच्चा', emoji: '👶', accent: 'orange' },
                { id: 2, label: 'किताब', emoji: '📘', accent: 'blue' },
                { id: 3, label: 'पेड़', emoji: '🌳', accent: 'green' },
                { id: 4, label: 'कप', emoji: '☕', accent: 'brown' },
                { id: 5, label: 'मोबाइल', emoji: '📱', accent: 'purple' },
            ],
            correctOption: 2,
            solution: 'किताब',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'यह लड़का',
            correctText: 'This boy',
            options: ['boy', 'This', 'That', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Water”?',
            options: [
                { id: 1, label: 'पानी', emoji: '💧', accent: 'blue' },
                { id: 2, label: 'चाय', emoji: '🍵', accent: 'amber' },
                { id: 3, label: 'मछली', emoji: '🐟', accent: 'teal' },
                { id: 4, label: 'लाइट', emoji: '💡', accent: 'yellow' },
                { id: 5, label: 'रोशनी', emoji: '🌞', accent: 'orange' },
            ],
            correctOption: 1,
            solution: 'पानी',
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “House”?',
            options: [
                { id: 1, label: 'बगीचा', emoji: '🌿', accent: 'green' },
                { id: 2, label: 'घर', emoji: '🏡', accent: 'orange' },
                { id: 3, label: 'पेड़', emoji: '🌳', accent: 'teal' },
                { id: 4, label: 'गाड़ी', emoji: '🚗', accent: 'blue' },
                { id: 5, label: 'किला', emoji: '🏰', accent: 'red' },
            ],
            correctOption: 2,
            solution: 'घर',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'यह पानी है',
            correctText: 'This is water',
            options: ['This', 'water', 'is', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Tree”?',
            options: [
                { id: 1, label: 'पेड़', emoji: '🌳', accent: 'green' },
                { id: 2, label: 'सामान', emoji: '🎒', accent: 'purple' },
                { id: 3, label: 'सूरज', emoji: '☀️', accent: 'orange' },
                { id: 4, label: 'रोटी', emoji: '🍞', accent: 'amber' },
                { id: 5, label: 'दर्पण', emoji: '🪞', accent: 'blue' },
            ],
            correctOption: 1,
            solution: 'पेड़',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'यह घर है',
            correctText: 'This is a house',
            options: ['This', 'is', 'a', 'house'],
        },
    ],
    en: [
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Apple”?',
            options: [
                { id: 1, label: 'pear', emoji: '🍐', accent: 'amber' },
                { id: 2, label: 'apple', emoji: '🍎', accent: 'red' },
                { id: 3, label: 'book', emoji: '📘', accent: 'blue' },
                { id: 4, label: 'banana', emoji: '🍌', accent: 'yellow' },
                { id: 5, label: 'train', emoji: '🚆', accent: 'purple' },
            ],
            correctOption: 2,
            solution: 'apple',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'an apple',
            correctText: 'an apple',
            options: ['apple', 'is', 'This', 'an'],
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'that book',
            correctText: 'That book',
            options: ['book', 'boy', 'This', 'That'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Book”?',
            options: [
                { id: 1, label: 'child', emoji: '🧒', accent: 'orange' },
                { id: 2, label: 'book', emoji: '📘', accent: 'blue' },
                { id: 3, label: 'tree', emoji: '🌳', accent: 'green' },
                { id: 4, label: 'shoe', emoji: '👟', accent: 'pink' },
                { id: 5, label: 'door', emoji: '🚪', accent: 'brown' },
            ],
            correctOption: 2,
            solution: 'book',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'this boy',
            correctText: 'This boy',
            options: ['boy', 'This', 'That', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Water”?',
            options: [
                { id: 1, label: 'tea', emoji: '🍵', accent: 'amber' },
                { id: 2, label: 'water', emoji: '💧', accent: 'blue' },
                { id: 3, label: 'fish', emoji: '🐟', accent: 'teal' },
                { id: 4, label: 'light', emoji: '💡', accent: 'yellow' },
                { id: 5, label: 'sun', emoji: '☀️', accent: 'orange' },
            ],
            correctOption: 2,
            solution: 'water',
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “House”?',
            options: [
                { id: 1, label: 'garden', emoji: '🌿', accent: 'green' },
                { id: 2, label: 'house', emoji: '🏡', accent: 'orange' },
                { id: 3, label: 'tree', emoji: '🌳', accent: 'teal' },
                { id: 4, label: 'car', emoji: '🚗', accent: 'blue' },
                { id: 5, label: 'cloud', emoji: '☁️', accent: 'gray' },
            ],
            correctOption: 2,
            solution: 'house',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'this is water',
            correctText: 'This is water',
            options: ['This', 'water', 'is', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Tree”?',
            options: [
                { id: 1, label: 'tree', emoji: '🌳', accent: 'green' },
                { id: 2, label: 'bag', emoji: '🎒', accent: 'purple' },
                { id: 3, label: 'sun', emoji: '☀️', accent: 'orange' },
                { id: 4, label: 'bread', emoji: '🍞', accent: 'amber' },
                { id: 5, label: 'mirror', emoji: '🪞', accent: 'blue' },
            ],
            correctOption: 1,
            solution: 'tree',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'this is a house',
            correctText: 'This is a house',
            options: ['This', 'is', 'a', 'house'],
        },
    ],
    kn: [
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Apple”?',
            options: [
                { id: 1, label: 'ಸೇಬು', emoji: '🍎', accent: 'red' },
                { id: 2, label: 'ಬanana', emoji: '🍌', accent: 'yellow' },
                { id: 3, label: 'ಪುಸ್ತಕ', emoji: '📘', accent: 'blue' },
                { id: 4, label: 'ಮರ', emoji: '🌳', accent: 'green' },
                { id: 5, label: 'ಇಲ್ಕಾ', emoji: '📱', accent: 'purple' },
            ],
            correctOption: 1,
            solution: 'ಸೇಬು',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ಒಂದು ಸೇಬು',
            correctText: 'an apple',
            options: ['apple', 'this', 'that', 'is'],
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ಅದು ಪುಸ್ತಕ',
            correctText: 'That book',
            options: ['book', 'boy', 'This', 'That'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Book”?',
            options: [
                { id: 1, label: 'ಮಕ್ಕಳು', emoji: '🧒', accent: 'orange' },
                { id: 2, label: 'ಪುಸ್ತಕ', emoji: '📘', accent: 'blue' },
                { id: 3, label: 'ಮರ', emoji: '🌳', accent: 'green' },
                { id: 4, label: 'ಕಪ್', emoji: '☕', accent: 'brown' },
                { id: 5, label: 'ದೀಪ', emoji: '💡', accent: 'yellow' },
            ],
            correctOption: 2,
            solution: 'ಪುಸ್ತಕ',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ಈ ಹುಡುಗ',
            correctText: 'This boy',
            options: ['boy', 'This', 'That', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Water”?',
            options: [
                { id: 1, label: 'ನೀರು', emoji: '💧', accent: 'blue' },
                { id: 2, label: 'ಚಹಾ', emoji: '🍵', accent: 'amber' },
                { id: 3, label: 'ಮೀನು', emoji: '🐟', accent: 'teal' },
                { id: 4, label: 'ಬೆಳಕು', emoji: '💡', accent: 'yellow' },
                { id: 5, label: 'ಮಳೆ', emoji: '🌧️', accent: 'gray' },
            ],
            correctOption: 1,
            solution: 'ನೀರು',
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “House”?',
            options: [
                { id: 1, label: 'ತೋಟ', emoji: '🌿', accent: 'green' },
                { id: 2, label: 'ಮನೆ', emoji: '🏡', accent: 'orange' },
                { id: 3, label: 'ಮರ', emoji: '🌳', accent: 'teal' },
                { id: 4, label: 'ಕಾರು', emoji: '🚗', accent: 'blue' },
                { id: 5, label: 'ಗಡಿ', emoji: '🏰', accent: 'red' },
            ],
            correctOption: 2,
            solution: 'ಮನೆ',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ಇದು ನೀರು',
            correctText: 'This is water',
            options: ['This', 'water', 'is', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Tree”?',
            options: [
                { id: 1, label: 'ಮರ', emoji: '🌳', accent: 'green' },
                { id: 2, label: 'ಬ್ಯಾಗ್', emoji: '🎒', accent: 'purple' },
                { id: 3, label: 'ಸೂರ್ಯ', emoji: '☀️', accent: 'orange' },
                { id: 4, label: 'ಬ್ರೆಡ್', emoji: '🍞', accent: 'amber' },
                { id: 5, label: 'ಕನ್ನಡಕ', emoji: '🪞', accent: 'blue' },
            ],
            correctOption: 1,
            solution: 'ಮರ',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ಇದು ಒಂದು ಮನೆ',
            correctText: 'This is a house',
            options: ['This', 'is', 'a', 'house'],
        },
    ],
    ta: [
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Apple”?',
            options: [
                { id: 1, label: 'ஆப்பிள்', emoji: '🍏', accent: 'amber' },
                { id: 2, label: 'பழம்', emoji: '🍌', accent: 'yellow' },
                { id: 3, label: 'புத்தகம்', emoji: '📘', accent: 'blue' },
                { id: 4, label: 'மரம்', emoji: '🌳', accent: 'green' },
                { id: 5, label: 'கார்', emoji: '🚗', accent: 'purple' },
            ],
            correctOption: 1,
            solution: 'ஆப்பிள்',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ஒரு ஆப்பிள்',
            correctText: 'an apple',
            options: ['apple', 'is', 'that', 'this'],
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'அந்த புத்தகம்',
            correctText: 'That book',
            options: ['book', 'boy', 'This', 'That'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Book”?',
            options: [
                { id: 1, label: 'குழந்தை', emoji: '🧒', accent: 'orange' },
                { id: 2, label: 'புத்தகம்', emoji: '📘', accent: 'blue' },
                { id: 3, label: 'மரம்', emoji: '🌳', accent: 'green' },
                { id: 4, label: 'கோப்பை', emoji: '☕', accent: 'brown' },
                { id: 5, label: 'மீன்', emoji: '🐟', accent: 'teal' },
            ],
            correctOption: 2,
            solution: 'புத்தகம்',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'இந்த பையன்',
            correctText: 'This boy',
            options: ['boy', 'This', 'That', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Water”?',
            options: [
                { id: 1, label: 'நீர்', emoji: '💧', accent: 'blue' },
                { id: 2, label: 'தேநீர்', emoji: '🍵', accent: 'amber' },
                { id: 3, label: 'மீன்', emoji: '🐟', accent: 'teal' },
                { id: 4, label: 'விளக்கு', emoji: '💡', accent: 'yellow' },
                { id: 5, label: 'மழை', emoji: '🌧️', accent: 'gray' },
            ],
            correctOption: 1,
            solution: 'நீர்',
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “House”?',
            options: [
                { id: 1, label: 'தோட்டம்', emoji: '🌿', accent: 'green' },
                { id: 2, label: 'வீடு', emoji: '🏡', accent: 'orange' },
                { id: 3, label: 'மரம்', emoji: '🌳', accent: 'teal' },
                { id: 4, label: 'கார்', emoji: '🚗', accent: 'blue' },
                { id: 5, label: 'கோட்டை', emoji: '🏰', accent: 'red' },
            ],
            correctOption: 2,
            solution: 'வீடு',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'இது நீர்',
            correctText: 'This is water',
            options: ['This', 'water', 'is', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Tree”?',
            options: [
                { id: 1, label: 'மரம்', emoji: '🌳', accent: 'green' },
                { id: 2, label: 'பை', emoji: '🎒', accent: 'purple' },
                { id: 3, label: 'சூரியன்', emoji: '☀️', accent: 'orange' },
                { id: 4, label: 'ரொட்டி', emoji: '🍞', accent: 'amber' },
                { id: 5, label: 'கண்ணாடி', emoji: '🪞', accent: 'blue' },
            ],
            correctOption: 1,
            solution: 'மரம்',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'இது ஒரு வீடு',
            correctText: 'This is a house',
            options: ['This', 'is', 'a', 'house'],
        },
    ],
    te: [
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Apple”?',
            options: [
                { id: 1, label: 'సేబు', emoji: '🍎', accent: 'red' },
                { id: 2, label: 'పండు', emoji: '🍐', accent: 'amber' },
                { id: 3, label: 'పుస్తకం', emoji: '📘', accent: 'blue' },
                { id: 4, label: 'చెట్టు', emoji: '🌳', accent: 'green' },
                { id: 5, label: 'కారు', emoji: '🚗', accent: 'purple' },
            ],
            correctOption: 1,
            solution: 'సేబు',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ఒక సేబు',
            correctText: 'an apple',
            options: ['apple', 'this', 'that', 'is'],
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ఆ పుస్తకం',
            correctText: 'That book',
            options: ['book', 'boy', 'This', 'That'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Book”?',
            options: [
                { id: 1, label: 'పిల్లాడు', emoji: '🧒', accent: 'orange' },
                { id: 2, label: 'పుస్తకం', emoji: '📘', accent: 'blue' },
                { id: 3, label: 'చెట్టు', emoji: '🌳', accent: 'green' },
                { id: 4, label: 'కప్పు', emoji: '☕', accent: 'brown' },
                { id: 5, label: 'మీనుగు', emoji: '🐟', accent: 'teal' },
            ],
            correctOption: 2,
            solution: 'పుస్తకం',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ఈ అమ్మాయి',
            correctText: 'This girl',
            options: ['girl', 'This', 'That', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Water”?',
            options: [
                { id: 1, label: 'నీరు', emoji: '💧', accent: 'blue' },
                { id: 2, label: 'చా', emoji: '🍵', accent: 'amber' },
                { id: 3, label: 'చేప', emoji: '🐟', accent: 'teal' },
                { id: 4, label: 'కాంతి', emoji: '💡', accent: 'yellow' },
                { id: 5, label: 'వర్షం', emoji: '🌧️', accent: 'gray' },
            ],
            correctOption: 1,
            solution: 'నీరు',
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “House”?',
            options: [
                { id: 1, label: 'తోట', emoji: '🌿', accent: 'green' },
                { id: 2, label: 'ఇల్లు', emoji: '🏡', accent: 'orange' },
                { id: 3, label: 'చెట్టు', emoji: '🌳', accent: 'teal' },
                { id: 4, label: 'కారు', emoji: '🚗', accent: 'blue' },
                { id: 5, label: 'కోట', emoji: '🏰', accent: 'red' },
            ],
            correctOption: 2,
            solution: 'ఇల్లు',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ఇది నీరు',
            correctText: 'This is water',
            options: ['This', 'water', 'is', 'book'],
        },
        {
            type: 'choice',
            label: 'NEW WORD',
            prompt: 'Which one of these is “Tree”?',
            options: [
                { id: 1, label: 'చెట్టు', emoji: '🌳', accent: 'green' },
                { id: 2, label: 'బ్యాగ్', emoji: '🎒', accent: 'purple' },
                { id: 3, label: 'సూర్యుడు', emoji: '☀️', accent: 'orange' },
                { id: 4, label: 'బ్రెడ్', emoji: '🍞', accent: 'amber' },
                { id: 5, label: 'అద్దం', emoji: '🪞', accent: 'blue' },
            ],
            correctOption: 1,
            solution: 'చెట్టు',
        },
        {
            type: 'write',
            label: 'WRITE THIS IN ENGLISH',
            prompt: 'Write this in English',
            instructions: 'ఇది ఒక ఇల్లు',
            correctText: 'This is a house',
            options: ['This', 'is', 'a', 'house'],
        },
    ],
}

const flags = {
    en: '🇺🇸',
    hi: '🇮🇳',
    kn: '🇮🇳',
    ta: '🇮🇳',
    te: '🇮🇳',
}

const languageTheme = {
    en: { flagBackground: '#69d6ff', cardBorder: 'rgba(96, 165, 250, 0.8)', cardGlow: 'rgba(96, 165, 250, 0.2)' },
    hi: { flagBackground: '#62d39c', cardBorder: 'rgba(34, 197, 94, 0.8)', cardGlow: 'rgba(34, 197, 94, 0.2)' },
    kn: { flagBackground: '#f5c56d', cardBorder: 'rgba(234, 179, 8, 0.8)', cardGlow: 'rgba(234, 179, 8, 0.22)' },
    ta: { flagBackground: '#f6a0a0', cardBorder: 'rgba(244, 114, 182, 0.8)', cardGlow: 'rgba(244, 114, 182, 0.2)' },
    te: { flagBackground: '#8ac7ff', cardBorder: 'rgba(59, 130, 246, 0.8)', cardGlow: 'rgba(59, 130, 246, 0.2)' },
}

export default function LearningPathPage() {
    const [selectedLanguage, setSelectedLanguage] = useState(null)
    const [selectedKnowledge, setSelectedKnowledge] = useState(1)
    const [selectedPath, setSelectedPath] = useState('scratch')
    const [step, setStep] = useState('language')
    const [lessonIndex, setLessonIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [selectedSequence, setSelectedSequence] = useState([])
    const [reviewState, setReviewState] = useState(null)
    const [showReview, setShowReview] = useState(false)
    const [showQuitModal, setShowQuitModal] = useState(false)
    const [scoresByLanguage, setScoresByLanguage] = useState({ en: 5, hi: 5, kn: 5, ta: 5, te: 5 })

    const currentLanguage = selectedLanguage || languages[1]
    const lessonBank = (lessonBankByLanguage[currentLanguage.code] || lessonBankByLanguage.hi).filter((item) => item.type === 'choice')
    const knowledgeLevels = knowledgeLevelsByLanguage[currentLanguage.code] || knowledgeLevelsByLanguage.en
    const currentScore = scoresByLanguage[currentLanguage.code] ?? 5
    const currentLesson = lessonBank[lessonIndex % lessonBank.length]
    const progress = ((lessonIndex + 1) / lessonBank.length) * 100
    const routeOptions = getRouteOptions(currentLanguage.name)

    const canContinue = reviewState !== null
    const activeTheme = languageTheme[currentLanguage.code] || languageTheme.en

    const nextStep = () => {
        if (step === 'language') {
            setStep('knowledge')
            return
        }

        if (step === 'knowledge') {
            setStep('path')
            return
        }

        if (step === 'path') {
            setStep('lesson')
            setReviewState(null)
            setSelectedOption(null)
            setSelectedSequence([])
            return
        }
    }

    const resetLessonState = () => {
        setReviewState(null)
        setSelectedOption(null)
        setSelectedSequence([])
    }

    const handleCheck = () => {
        if (currentLesson.type !== 'choice') {
            return
        }

        if (selectedOption === null) return
        const isCorrect = selectedOption === currentLesson.correctOption
        setReviewState(isCorrect ? 'correct' : 'wrong')
        setScoresByLanguage((prev) => ({
            ...prev,
            [currentLanguage.code]: Math.max(0, (prev[currentLanguage.code] ?? 5) + (isCorrect ? 2 : -1)),
        }))
        setShowReview(true)
    }

    const handleSkip = () => {
        setReviewState('skip')
        setShowReview(true)
    }

    const handleQuit = () => {
        setShowQuitModal(true)
    }

    const handleKeepLearning = () => {
        setShowQuitModal(false)
    }

    const handleEndSession = () => {
        setShowQuitModal(false)
        setStep('language')
        setLessonIndex(0)
        setSelectedLanguage(null)
        setSelectedKnowledge(1)
        setSelectedPath('scratch')
        setSelectedOption(null)
        setSelectedSequence([])
        setReviewState(null)
        setShowReview(false)
    }

    const handleContinue = () => {
        if (lessonIndex >= lessonBank.length - 1) {
            setLessonIndex(0)
            setStep('language')
        } else {
            setLessonIndex((prev) => prev + 1)
        }
        resetLessonState()
        setShowReview(false)
    }

    const handleTokenClick = (token) => {
        if (showReview) return
        setSelectedSequence((prev) => {
            if (prev.includes(token)) {
                return prev.filter((item) => item !== token)
            }
            return [...prev, token]
        })
    }

    const renderLanguageSelection = () => (
        <div className="duolingo-selection-page">
            <div className="duolingo-selection-grid">
                {languages.map((language) => {
                    const theme = languageTheme[language.code] || languageTheme.en
                    const isSelected = selectedLanguage?.code === language.code

                    return (
                        <button
                            key={language.code}
                            type="button"
                            className={`duolingo-language-card ${isSelected ? 'selected' : ''}`}
                            style={
                                isSelected
                                    ? {
                                        borderColor: theme.cardBorder,
                                        boxShadow: `0 0 0 2px ${theme.cardGlow}`,
                                    }
                                    : undefined
                            }
                            onClick={() => {
                                setSelectedLanguage(language)
                                setStep('knowledge')
                            }}
                        >
                            <div className="duolingo-flag" style={{ background: theme.flagBackground }}>
                                {flags[language.code] || '🌍'}
                            </div>
                            <div className="duolingo-language-name">{language.name}</div>
                            <div className="duolingo-language-count">{language.code === 'hi' ? '13.8M learners' : `${Math.round(Math.random() * 15 + 10)}.M learners`}</div>
                        </button>
                    )
                })}
            </div>
        </div>
    )

    const renderKnowledgeStep = () => (
        <div className="duolingo-flow-page">
            <div className="duolingo-chat-bubble">How much {currentLanguage.name} do you know?</div>
            <div className="duolingo-choice-stack duolingo-knowledge-stack">
                {knowledgeLevels.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        className={`duolingo-choice-button ${selectedKnowledge === option.id ? 'active' : ''}`}
                        onClick={() => setSelectedKnowledge(option.id)}
                    >
                        <span className="duolingo-signal" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                        </span>
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>
            <div className="duolingo-action-row">
                <button type="button" className="duolingo-ghost-button" onClick={() => setStep('language')}>
                    Back
                </button>
                <button type="button" className="duolingo-primary-button" onClick={nextStep}>
                    CONTINUE
                </button>
            </div>
        </div>
    )

    const renderPathStep = () => (
        <div className="duolingo-flow-page">
            <div className="duolingo-chat-bubble">Now let’s find the best place to start in {currentLanguage.name}!</div>
            <div className="duolingo-choice-stack path-stack duolingo-knowledge-stack">
                {routeOptions.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        className={`duolingo-route-card ${selectedPath === option.id ? 'active' : ''}`}
                        onClick={() => setSelectedPath(option.id)}
                    >
                        <div className={`duolingo-route-badge ${option.badgeColor}`}>{option.badge}</div>
                        <div className="duolingo-route-copy">
                            <h3>{option.title}</h3>
                            <p>{option.description}</p>
                        </div>
                    </button>
                ))}
            </div>
            <div className="duolingo-action-row">
                <button type="button" className="duolingo-ghost-button" onClick={() => setStep('knowledge')}>
                    Back
                </button>
                <button type="button" className="duolingo-primary-button" onClick={nextStep}>
                    CONTINUE
                </button>
            </div>
        </div>
    )

    const renderLessonStep = () => {
        const isChoice = currentLesson.type === 'choice'
        const answerPreview = selectedSequence.join(' ')

        return (
            <div className="duolingo-lesson-page">
                <div className="duolingo-topbar">
                    <button type="button" className="duolingo-close-button" aria-label="Close" onClick={handleQuit}>
                        ×
                    </button>
                    <div className="duolingo-progress-track">
                        <div className="duolingo-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="duolingo-heart-badge" style={{ color: activeTheme.cardBorder }}>❤ <span>{currentScore}</span></div>
                </div>

                {!showReview ? (
                    <>
                        <div className="duolingo-lesson-card">
                            <div className="duolingo-lesson-tag">{currentLesson.label} • {currentLanguage.name}</div>
                            <h2>{isChoice ? currentLesson.prompt : currentLesson.prompt}</h2>

                            {isChoice ? (
                                <div className="duolingo-answer-grid">
                                    {currentLesson.options.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            className={`duolingo-answer-option ${selectedOption === option.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedOption(option.id)}
                                        >
                                            <div className={`duolingo-answer-art ${option.accent}`}>{option.emoji}</div>
                                            <span>{option.label}</span>
                                            <small>{option.id}</small>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="duolingo-typing-card">
                                    <div className="duolingo-character" aria-hidden="true">🙂</div>
                                    <div className="duolingo-audio-bubble">▶ {currentLesson.instructions}</div>

                                    <div className="duolingo-multi-line">
                                        <div className="duolingo-solution-box">{answerPreview || ' '}</div>
                                    </div>

                                    <div className="duolingo-word-row">
                                        {currentLesson.options.map((token) => (
                                            <button
                                                key={token}
                                                type="button"
                                                className={`duolingo-token ${selectedSequence.includes(token) ? 'selected' : ''}`}
                                                onClick={() => handleTokenClick(token)}
                                            >
                                                {token}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="duolingo-bottom-row">
                            <button type="button" className="duolingo-skip-button" onClick={handleSkip}>SKIP</button>
                            <button type="button" className="duolingo-check-button" onClick={handleCheck}>CHECK</button>
                        </div>
                    </>
                ) : (
                    <div className={`duolingo-result-panel ${reviewState === 'correct' ? 'success' : 'danger'}`}>
                        <div className="duolingo-result-header">
                            <div className={`duolingo-result-icon ${reviewState === 'correct' ? 'success' : 'danger'}`}>
                                {reviewState === 'correct' ? '✓' : '×'}
                            </div>
                            <div className="duolingo-result-copy">
                                {reviewState === 'correct' ? (
                                    <div className="duolingo-result-title">Amazing!</div>
                                ) : (
                                    <>
                                        <div className="duolingo-result-title">Wrong answer</div>
                                        <div className="duolingo-result-solve">{currentLesson.type === 'choice' ? currentLesson.solution : currentLesson.correctText}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="duolingo-result-actions">
                            <button type="button" className={`duolingo-continue-button ${reviewState === 'correct' ? 'success' : 'danger'}`} onClick={handleContinue}>
                                CONTINUE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const memorizeMode = useMemo(() => step === 'lesson' && showReview && reviewState === 'wrong', [showReview, reviewState, step])

    return (
        <div className="duolingo-page-shell">
            <div className="duolingo-page-header">
                <Link to="/dashboard" className="duolingo-back-link">←</Link>
                <div className="duolingo-top-tabs">
                    <button type="button" className="duolingo-tab active">Learn</button>
                    <button type="button" className="duolingo-tab">Courses</button>
                </div>
            </div>

            {step === 'language' && renderLanguageSelection()}
            {step === 'knowledge' && renderKnowledgeStep()}
            {step === 'path' && renderPathStep()}
            {step === 'lesson' && renderLessonStep()}

            {showQuitModal && (
                <div className="duolingo-quit-overlay">
                    <div className="duolingo-quit-modal">
                        <div className="duolingo-quit-avatar">🙂</div>
                        <div className="duolingo-quit-message">Wait, don’t go! You’ll lose your progress if you quit now</div>
                        <button type="button" className="duolingo-keep-button" onClick={handleKeepLearning}>
                            KEEP LEARNING
                        </button>
                        <button type="button" className="duolingo-end-button" onClick={handleEndSession}>
                            END SESSION
                        </button>
                    </div>
                </div>
            )}

            {memorizeMode && <div className="duolingo-review-banner">Let’s review the exercises you missed!</div>}
        </div>
    )
}
