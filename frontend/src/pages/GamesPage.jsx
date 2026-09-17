import { useState } from 'react'

const games = [
    {
        id: 'match',
        icon: '🔗',
        title: 'Word Match',
        description: 'Connect a word with its meaning.',
        questions: [
            { prompt: 'Which word means "casa"?', answers: ['House', 'Water', 'Book'], correct: 'House' },
            { prompt: 'Which word means "agua"?', answers: ['Food', 'Water', 'Morning'], correct: 'Water' },
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
        ],
    },
]

export default function GamesPage() {
    const [selectedId, setSelectedId] = useState(games[0].id)
    const [answer, setAnswer] = useState('')
    const [score, setScore] = useState(0)
    const [questionIndex, setQuestionIndex] = useState(0)
    const selectedGame = games.find((game) => game.id === selectedId) || games[0]
    const question = selectedGame.questions[questionIndex % selectedGame.questions.length]

    const chooseGame = (gameId) => {
        setSelectedId(gameId)
        setAnswer('')
        setQuestionIndex(0)
    }

    const chooseAnswer = (choice) => {
        setAnswer(choice)
        if (choice === question.correct && answer !== question.correct) setScore((current) => current + 10)
    }

    const nextQuestion = () => {
        setQuestionIndex((current) => (current + 1) % selectedGame.questions.length)
        setAnswer('')
    }

    return (
        <main className="games-page">
            <section className="games-hero">
                <div>
                    <span className="games-kicker">NEOLIT ARCADE</span>
                    <h1>Play a language game</h1>
                    <p>Choose a mode, solve the challenge, and earn XP as you play.</p>
                </div>
                <div className="games-score"><span>YOUR SCORE</span><strong>{score} XP</strong></div>
            </section>

            <section className="game-board">
                <div className="game-board-heading">
                    <span className="games-kicker">{selectedGame.icon} {selectedGame.title}</span>
                    <span>+10 XP</span>
                </div>
                <p className="game-board-description">{selectedGame.description}</p>
                <h2>{question.prompt}</h2>
                <div className={`game-answer-grid ${selectedGame.type === 'cards' ? 'card-game-grid' : ''}`}>
                    {question.answers.map((choice) => (
                        <button key={choice} type="button" className={answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''} onClick={() => chooseAnswer(choice)}>
                            {selectedGame.type === 'cards' && <span className="catch-card-icon">✦</span>}
                            {choice}
                        </button>
                    ))}
                </div>
                {answer && <p className={answer === question.correct ? 'game-feedback correct' : 'game-feedback wrong'}>{answer === question.correct ? 'Correct! Great work.' : 'Try another answer.'}</p>}
                {answer && <button type="button" className="game-next-button" onClick={nextQuestion}>Next question</button>}
            </section>

            <section className="games-selector" aria-label="Choose a game">
                <div className="games-selector-heading">
                    <span className="games-kicker">CHOOSE A MODE</span>
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
        </main>
    )
}
