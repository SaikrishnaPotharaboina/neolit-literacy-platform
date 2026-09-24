export const shuffleGameOptions = (items) => [...items].sort(() => Math.random() - 0.5)

export const shuffleQuestions = (items) => [...items].sort(() => Math.random() - 0.5)

export const createQuestionRound = (items) => shuffleQuestions(items).slice(0, Math.min(5, items.length))

export const getSavedGameRound = (gameId, questions) => {
    try {
        const savedIds = JSON.parse(localStorage.getItem(`neolit_${gameId}_current_round`) || 'null')
        if (!Array.isArray(savedIds) || savedIds.length !== 5) return null
        const savedQuestions = savedIds.map((id) => questions.find((question) => question.id === id)).filter(Boolean)
        return savedQuestions.length === 5 ? savedQuestions : null
    } catch {
        return null
    }
}

export const saveGameRound = (gameId, questions) => {
    localStorage.setItem(`neolit_${gameId}_current_round`, JSON.stringify(questions.map((question) => question.id)))
}

export const getGameLibraryWithListening = (languageCode, { universalGamesByLanguage, visualGamesByLanguage, listeningGameByLanguage, removedGameIds = new Set() }) => [
    ...(universalGamesByLanguage[languageCode] || universalGamesByLanguage.en),
    ...(visualGamesByLanguage[languageCode] || visualGamesByLanguage.en),
    listeningGameByLanguage[languageCode] || listeningGameByLanguage.en,
].filter(Boolean)
    .filter((game) => !removedGameIds.has(game.id))
    .map((game) => ({
        ...game,
        questions: game.questions.map((question) => ({
            ...question,
            answers: question.answers ? shuffleGameOptions(question.answers) : question.answers,
            letters: question.letters ? shuffleGameOptions(question.letters) : question.letters,
        })),
    }))
