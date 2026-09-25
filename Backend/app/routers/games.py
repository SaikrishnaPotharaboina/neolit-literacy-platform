import random

from fastapi import APIRouter, HTTPException, Query

from app.schemas.games import GameBankItem, GameQuestion, GameRoundResponse

router = APIRouter()

WORD_BUILDER_HINTS = {
    'a fruit': 'फल',
    'a drink': 'पानी',
    'a greeting': 'नमस्ते',
    'a place to learn': 'सीखने की जगह',
    'a reading object': 'पढ़ने की चीज',
    'a close person': 'करीबी व्यक्ति',
    'a bright object in the sky': 'आकाश में चमकता वस्तु',
    'a large animal': 'बड़ा जानवर',
    'a place with many books': 'कई पुस्तकों वाली जगह',
    'a morning meal': 'सुबह का भोजन',
    'a color like grass': 'घास जैसी रंग',
    'a place to live': 'रहने की जगह',
    'a means of travel': 'यात्रा का साधन',
    'a person who teaches': 'जो सिखाता है',
    'a place to buy food': 'खाना खरीदने की जगह',
    'the opposite of night': 'रात का विपरीत',
    'a season after winter': 'सर्दी के बाद का मौसम',
    'a piece of furniture': 'फर्नीचर का टुकड़ा',
    'a vehicle with two wheels': 'दो पहियों वाली वाहन',
    'a place to see animals': 'जानवर देखने की जगह',
    'a hot drink': 'गर्म पेय',
    'a yellow fruit': 'पीला फल',
    'a room for cooking': 'पकाने का कमरा',
    'a place for sports': 'खेल का स्थान',
    'a person who drives': 'ड्राइवर',
    'the opposite of fast': 'तेज़ का विपरीत',
    'a body of flowing water': 'बहती पानी की धारा',
    'a tool for writing': 'लिखने का औज़ार',
    'a place for airplanes': 'हवाई जहाज़ों का स्थान',
    'a meal in the evening': 'शाम का भोजन',
    'a color like the sky': 'आसमान जैसा रंग',
    'a small animal that says meow': 'म्याऊँ कहने वाला छोटा जानवर',
    'a place to catch a train': 'रेलगाड़ी पकड़ने का स्थान',
    'a person who helps sick people': 'बीमार लोगों की मदद करने वाला',
    'the opposite of empty': 'खाली का विपरीत',
    'a bright light in the night sky': 'रात के आकाश में चमकती रोशनी',
    'a place with trees': 'पेड़ों वाली जगह',
    'something worn on the feet': 'पैर पर पहना जाने वाला',
    'a building where films are shown': 'फिल्म दिखाने वाला भवन',
    'a vehicle that flies': 'उड़ने वाला वाहन',
    'a red fruit': 'लाल फल',
    'a place for swimming': 'तैरने का स्थान',
    'a person who cooks food': 'जो खाना पकाता है',
    'the opposite of old': 'पुराने का विपरीत',
    'a place to borrow books': 'पुस्तक उधार लेने की जगह',
    'a natural high landform': 'प्रकृति की ऊँची भूमि',
    'a container for carrying things': 'चीज़ें ले जाने वाला कंटेनर',
    'a room where people sleep': 'जहाँ लोग सोते हैं',
    'a day after Friday': 'शुक्रवार के बाद का दिन',
    'a person who paints': 'जो चित्र बनाता है',
}

WORD_BUILDER_TRANSLATIONS = {
    'APPLE': 'सेब',
    'WATER': 'पानी',
    'HELLO': 'नमस्ते',
    'SCHOOL': 'स्कूल',
    'BOOK': 'किताब',
    'FRIEND': 'दोस्त',
    'SUN': 'सूर्य',
    'ELEPHANT': 'हाथी',
    'LIBRARY': 'पुस्तकालय',
    'BREAKFAST': 'नाश्ता',
    'GREEN': 'हरा',
    'HOUSE': 'घर',
    'TRAIN': 'रेल',
    'TEACHER': 'शिक्षक',
    'MARKET': 'बाज़ार',
    'DAY': 'दिन',
    'SPRING': 'वसंत',
    'TABLE': 'मेज़',
    'BICYCLE': 'साइकिल',
    'ZOO': 'चिड़ियाघर',
    'COFFEE': 'कॉफ़ी',
    'BANANA': 'केला',
    'KITCHEN': 'रसोई',
    'STADIUM': 'स्टेडियम',
    'DRIVER': 'चालक',
    'SLOW': 'धीमा',
    'RIVER': 'नदी',
    'PENCIL': 'पेंसिल',
    'AIRPORT': 'हवाईअड्डा',
    'DINNER': 'रात्रिभोजन',
    'BLUE': 'नीला',
    'CAT': 'बिल्ली',
    'STATION': 'स्टेशन',
    'DOCTOR': 'डॉक्टर',
    'FULL': 'भरा',
    'MOON': 'चाँद',
    'GARDEN': 'बगीचा',
    'SHOES': 'जूते',
    'CINEMA': 'सिनेमा',
    'AIRPLANE': 'हवाईजहाज़',
    'TOMATO': 'टमाटर',
    'POOL': 'तैराकी ताल',
    'CHEF': 'शेफ़',
    'NEW': 'नया',
    'MOUNTAIN': 'पर्वत',
    'BAG': 'बैग',
    'BEDROOM': 'शयनकक्ष',
    'SATURDAY': 'शनिवार',
    'ARTIST': 'कलाकार',
}

WORD_BUILDER_DATA = [
    [('a fruit', 'APPLE'), ('a drink', 'WATER'), ('a greeting', 'HELLO'), ('a place to learn', 'SCHOOL'), ('a reading object', 'BOOK'), ('a close person', 'FRIEND'), ('a bright object in the sky', 'SUN'), ('a large animal', 'ELEPHANT'), ('a place with many books', 'LIBRARY'), ('a morning meal', 'BREAKFAST')],
    [('a color like grass', 'GREEN'), ('a place to live', 'HOUSE'), ('a means of travel', 'TRAIN'), ('a person who teaches', 'TEACHER'), ('a place to buy food', 'MARKET'), ('the opposite of night', 'DAY'), ('a season after winter', 'SPRING'), ('a piece of furniture', 'TABLE'), ('a vehicle with two wheels', 'BICYCLE'), ('a place to see animals', 'ZOO')],
    [('a hot drink', 'COFFEE'), ('a yellow fruit', 'BANANA'), ('a room for cooking', 'KITCHEN'), ('a place for sports', 'STADIUM'), ('a person who drives', 'DRIVER'), ('the opposite of fast', 'SLOW'), ('a body of flowing water', 'RIVER'), ('a tool for writing', 'PENCIL'), ('a place for airplanes', 'AIRPORT'), ('a meal in the evening', 'DINNER')],
    [('a color like the sky', 'BLUE'), ('a small animal that says meow', 'CAT'), ('a place to catch a train', 'STATION'), ('a person who helps sick people', 'DOCTOR'), ('the opposite of empty', 'FULL'), ('a bright light in the night sky', 'MOON'), ('a place with trees', 'GARDEN'), ('something worn on the feet', 'SHOES'), ('a building where films are shown', 'CINEMA'), ('a vehicle that flies', 'AIRPLANE')],
    [('a red fruit', 'TOMATO'), ('a place for swimming', 'POOL'), ('a person who cooks food', 'CHEF'), ('the opposite of old', 'NEW'), ('a place to borrow books', 'LIBRARY'), ('a natural high landform', 'MOUNTAIN'), ('a container for carrying things', 'BAG'), ('a room where people sleep', 'BEDROOM'), ('a day after Friday', 'SATURDAY'), ('a person who paints', 'ARTIST')],
]


def shuffle_list(items):
    shuffled = list(items)
    random.shuffle(shuffled)
    return shuffled


def build_word_builder_questions(language_code: str):
    normalized = (language_code or 'en').lower()
    if normalized != 'hi':
        questions = []
        for question_set in WORD_BUILDER_DATA:
            for hint, answer in question_set:
                questions.append({
                    'id': f'word-builder-{answer.lower()}-{len(questions) + 1}',
                    'prompt': f'Build the word for {hint}.',
                    'letters': list(answer),
                    'correct': answer,
                    'answers': list(answer),
                })
        return questions

    questions = []
    for question_set in WORD_BUILDER_DATA:
        for hint, answer in question_set:
            localized_hint = WORD_BUILDER_HINTS.get(hint, hint)
            localized_answer = WORD_BUILDER_TRANSLATIONS.get(answer, answer)
            questions.append({
                'id': f'word-builder-hi-{len(questions) + 1}',
                'prompt': f'शब्द बनाएं: {localized_hint}।',
                'letters': list(localized_answer),
                'correct': localized_answer,
                'answers': list(localized_answer),
            })
    return questions


def build_word_hunt_bank(language_code: str):
    templates = {
        'en': [
            {'prompt': 'Find 3 words related to food.', 'answers': ['BOOK', 'APPLE', 'HOUSE', 'WATER', 'BREAD', 'DOG'], 'correct': ['APPLE', 'WATER', 'BREAD']},
            {'prompt': 'Find 3 words related to places.', 'answers': ['SCHOOL', 'CAT', 'MARKET', 'RIVER', 'HOUSE', 'GREEN'], 'correct': ['SCHOOL', 'MARKET', 'HOUSE']},
            {'prompt': 'Find 3 words related to nature.', 'answers': ['TREE', 'BOOK', 'RIVER', 'SUN', 'CHAIR', 'DOG'], 'correct': ['TREE', 'RIVER', 'SUN']},
            {'prompt': 'Find 3 words related to animals.', 'answers': ['DOG', 'TABLE', 'CAT', 'BIRD', 'HOUSE', 'BLUE'], 'correct': ['DOG', 'CAT', 'BIRD']},
            {'prompt': 'Find 3 words related to school.', 'answers': ['PENCIL', 'RIVER', 'TEACHER', 'BOOK', 'APPLE', 'MOON'], 'correct': ['PENCIL', 'TEACHER', 'BOOK']},
            {'prompt': 'Find 3 words related to travel.', 'answers': ['TRAIN', 'WATER', 'MAP', 'DESK', 'BAG', 'WINDOW'], 'correct': ['TRAIN', 'MAP', 'BAG']},
            {'prompt': 'Find 3 words related to emotions.', 'answers': ['HAPPY', 'TABLE', 'FRIEND', 'SAD', 'SHOES', 'LIGHT'], 'correct': ['HAPPY', 'FRIEND', 'SAD']},
            {'prompt': 'Find 3 words related to time.', 'answers': ['MORNING', 'BOOK', 'CLOCK', 'SCHOOL', 'NIGHT', 'LEAF'], 'correct': ['MORNING', 'CLOCK', 'NIGHT']},
        ],
        'hi': [
            {'prompt': 'खाने से जुड़े 3 शब्द ढूँढें।', 'answers': ['किताब', 'सेब', 'घर', 'पानी', 'रोटी', 'कुत्ता'], 'correct': ['सेब', 'पानी', 'रोटी']},
            {'prompt': 'जगहों से जुड़े 3 शब्द ढूँढें।', 'answers': ['स्कूल', 'बिल्ली', 'बाज़ार', 'नदी', 'घर', 'हरा'], 'correct': ['स्कूल', 'बाज़ार', 'घर']},
            {'prompt': 'प्रकृति से जुड़े 3 शब्द ढूँढें।', 'answers': ['पेड़', 'किताब', 'नदी', 'सूर्य', 'कुर्सी', 'कुत्ता'], 'correct': ['पेड़', 'नदी', 'सूर्य']},
            {'prompt': 'पशुओं से जुड़े 3 शब्द ढूँढें।', 'answers': ['कुत्ता', 'मेज़', 'बिल्ली', 'चिड़िया', 'घर', 'नीला'], 'correct': ['कुत्ता', 'बिल्ली', 'चिड़िया']},
            {'prompt': 'स्कूल से जुड़े 3 शब्द ढूँढें।', 'answers': ['पेंसिल', 'नदी', 'शिक्षक', 'किताब', 'सेब', 'चाँद'], 'correct': ['पेंसिल', 'शिक्षक', 'किताब']},
            {'prompt': 'यात्रा से जुड़े 3 शब्द ढूँढें।', 'answers': ['रेल', 'पानी', 'नक्शा', 'डेस्क', 'बैग', 'खिड़की'], 'correct': ['रेल', 'नक्शा', 'बैग']},
            {'prompt': 'भावनाओं से जुड़े 3 शब्द ढूँढें।', 'answers': ['खुश', 'मेज़', 'दोस्त', 'दुखी', 'जूते', 'रोशनी'], 'correct': ['खुश', 'दोस्त', 'दुखी']},
            {'prompt': 'समय से जुड़े 3 शब्द ढूँढें।', 'answers': ['सुबह', 'किताब', 'घड़ी', 'स्कूल', 'रात', 'पत्ता'], 'correct': ['सुबह', 'घड़ी', 'रात']},
        ],
    }
    bank = templates.get(language_code, templates['en'])
    results = []
    for index, template in enumerate(bank * 7):
        item = dict(template)
        item['id'] = f'word-hunt-{language_code}-{index + 1}'
        item['answers'] = list(item['answers'])
        item['correct'] = list(item['correct'])
        results.append(item)
    return results[:50]


def build_flip_card_bank(language_code: str):
    templates = {
        'en': [
            {'prompt': 'Choose the correct greeting word.', 'answers': ['HELLO', 'WINDOW', 'TABLE', 'MORNING', 'BOOK'], 'correct': 'HELLO'},
            {'prompt': 'Choose the correct word for a daily action.', 'answers': ['LEARN', 'GOODBYE', 'MOUNTAIN', 'BREAD', 'GARDEN'], 'correct': 'LEARN'},
            {'prompt': 'Choose the correct word for a place to study.', 'answers': ['SCHOOL', 'RIVER', 'CLOUD', 'CHAIR', 'SUN'], 'correct': 'SCHOOL'},
        ],
        'hi': [
            {'prompt': 'सही अभिवादन शब्द चुनें।', 'answers': ['नमस्ते', 'खिड़की', 'मेज़', 'सुबह', 'किताब'], 'correct': 'नमस्ते'},
            {'prompt': 'दैनिक क्रिया का सही शब्द चुनें।', 'answers': ['सीखना', 'अलविदा', 'पहाड़', 'रोटी', 'बगीचा'], 'correct': 'सीखना'},
            {'prompt': 'पढ़ने की जगह का सही शब्द चुनें।', 'answers': ['स्कूल', 'नदी', 'बादल', 'कुर्सी', 'सूर्य'], 'correct': 'स्कूल'},
        ],
    }
    bank = templates.get(language_code, templates['en'])
    results = []
    for index, template in enumerate(bank * 17):
        item = dict(template)
        item['id'] = f'flip-card-{language_code}-{index + 1}'
        item['answers'] = list(item['answers'])
        results.append(item)
    return results[:50]


def build_archer_bank(language_code: str):
    templates = {
        'en': [
            {'prompt': 'Which word means "to examine carefully"?', 'answers': ['Analyze', 'Gather', 'Breathe', 'Ignore'], 'correct': 'Analyze'},
            {'prompt': 'Select the word for "a sudden feeling of fear".', 'answers': ['Panic', 'Lantern', 'Pillow', 'Ribbon'], 'correct': 'Panic'},
            {'prompt': 'What does "fragile" mean?', 'answers': ['Easily broken', 'Very loud', 'Extremely slow', 'Completely empty'], 'correct': 'Easily broken'},
        ],
        'hi': [
            {'prompt': 'किस शब्द का अर्थ है “सावधानी से देखना”?', 'answers': ['जाँच', 'संग्रह', 'साँस लेना', 'अनदेखा करना'], 'correct': 'जाँच'},
            {'prompt': '“अचानक डर” का सही शब्द चुनें।', 'answers': ['घबराहट', 'दीपक', 'तकिया', 'फीत'], 'correct': 'घबराहट'},
            {'prompt': '“नाज़ुक” का अर्थ क्या है?', 'answers': ['आसानी से टूट जाने वाला', 'बहुत तेज़', 'बहुत धीमा', 'पूरा खाली'], 'correct': 'आसानी से टूट जाने वाला'},
        ],
    }
    bank = templates.get(language_code, templates['en'])
    results = []
    for index, template in enumerate(bank * 17):
        item = dict(template)
        item['id'] = f'archer-{language_code}-{index + 1}'
        item['answers'] = list(item['answers'])
        results.append(item)
    return results[:50]


def build_game_library(language_code: str):
    library = [
        {
            'id': 'word-builder',
            'icon': '🔤',
            'title': 'Word Builder' if language_code != 'hi' else 'शब्द बनाओ',
            'description': 'Arrange scrambled letters into the target word.' if language_code != 'hi' else 'अस्थिर अक्षरों को सही शब्द में लगाएँ।',
            'type': 'word-builder',
            'questions': build_word_builder_questions(language_code),
        },
        {
            'id': 'word-hunt',
            'icon': '🎯',
            'title': 'Word Hunt' if language_code != 'hi' else 'शब्द खोज',
            'description': 'Find all words that match the mission.' if language_code != 'hi' else 'मिशन से मेल खाने वाले सारे शब्द ढूँढें।',
            'type': 'word-hunt',
            'questions': build_word_hunt_bank(language_code),
        },
        {
            'id': 'flip-card',
            'icon': '🃏',
            'title': 'Flip Card Challenge' if language_code != 'hi' else 'फ्लिप कार्ड चैलेंज',
            'description': 'Flip the cards and match the right word.' if language_code != 'hi' else 'कार्ड पलटें और सही शब्द चुनें।',
            'type': 'flip-card',
            'questions': build_flip_card_bank(language_code),
        },
        {
            'id': 'archer',
            'icon': '🏹',
            'title': 'Word Archer' if language_code != 'hi' else 'वर्ड आर्चर',
            'description': 'Aim at the correct vocabulary target.' if language_code != 'hi' else 'सही शब्द पर निशाना लगाएँ।',
            'type': 'archer',
            'questions': build_archer_bank(language_code),
        },
    ]
    return library


def get_fresh_question_set(game_id: str, questions: list[dict], seen_ids: list[str] | None = None, size: int = 5):
    if not questions:
        return []
    seen = set(seen_ids or [])
    remaining = [question for question in questions if question.get('id') not in seen]
    source = remaining if len(remaining) >= size else questions
    selected = shuffle_list(source)[: min(size, len(source))]
    return selected


@router.get('/games/{language_code}', response_model=list[GameBankItem])
def list_games(language_code: str):
    normalized = (language_code or 'en').lower()
    if normalized not in {'en', 'hi', 'kn', 'ta', 'te'}:
        raise HTTPException(status_code=400, detail='Unsupported language code.')
    return build_game_library(normalized)


@router.get('/games/round/{game_id}', response_model=GameRoundResponse)
def get_game_round(
    game_id: str,
    language_code: str = Query(default='en'),
    size: int = Query(default=5, ge=1, le=10),
    seen_ids: list[str] = Query(default_factory=list),
):
    normalized_language = (language_code or 'en').lower()
    if normalized_language not in {'en', 'hi', 'kn', 'ta', 'te'}:
        raise HTTPException(status_code=400, detail='Unsupported language code.')

    for game in build_game_library(normalized_language):
        if game['id'] == game_id:
            questions = get_fresh_question_set(game_id, game['questions'], seen_ids=seen_ids, size=size)
            return {
                'game_id': game_id,
                'language_code': normalized_language,
                'size': len(questions),
                'questions': [GameQuestion(**question) for question in questions],
            }

    raise HTTPException(status_code=404, detail='Game not found for this language.')
