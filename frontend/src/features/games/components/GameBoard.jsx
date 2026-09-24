export default function GameBoard({
    selectedGame,
    difficultySettings,
    gamesUiCopy,
    question,
    activeQuestionOrder,
    questionIndex,
    timeLeft,
    answer,
    chooseAnswer,
    chooseDragonTarget,
    playListeningClue,
    catchWord,
    handleMemoryChoice,
    handleSentenceChoice,
    chooseBuilderLetter,
    removeBuilderLetter,
    revealMysteryClue,
    chooseHuntWord,
    flipCardChoice,
    nextQuestion,
    selectedFlipCards,
    matchedFlipCards,
    flipCardDeck,
    flipCardStatus,
    localizedGameCopy,
    languageCode,
    MEMORY_DECOYS_BY_LANGUAGE,
    mysteryClueIndex,
    huntFound,
    builderLetters,
    dragonHealth,
    dragonCoins,
    dragonDistance,
    villageBuildings,
    villageWood,
    dragonTargets,
    runnerWords,
    runnerFallen,
    selectedGameType,
    shooterAim,
    shooterAimY,
    shotFlash,
    shotTarget,
    shooterAmmo,
    shooterStreak,
    shooterMisses,
    moveShooter,
    shootCurrentWord,
    shootWord,
    reloadShooter,
    fallingWords,
    restartDragonRun,
    questionOrder,
    gameTimeLimit,
}) {
    return (
        <section className="game-board">
            <div className="game-board-heading">
                <span className="games-kicker active-mode">{selectedGame.icon} {selectedGame.title}</span>
                <span>+{difficultySettings.points} pts</span>
            </div>
            <p className="game-board-description">{selectedGame.description}</p>
            <div className="game-meta-row">
                <span className="game-question-count">
                    {selectedGame.type === 'dragon' || selectedGame.type === 'runner'
                        ? gamesUiCopy.endless
                        : `${gamesUiCopy.question} ${Math.min(questionIndex + 1, activeQuestionOrder.length)}/${activeQuestionOrder.length}`}
                </span>
                <span className={`game-timer ${timeLeft <= 4 ? 'warning' : ''}`}>{timeLeft}{gamesUiCopy.seconds}</span>
            </div>

            {selectedGame.type !== 'memory' && <h2>{question.prompt}</h2>}

            {selectedGame.type === 'dragon' ? (
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
                            <span
                                className={`visual-player shooter-character ${shotFlash ? 'shooting' : ''}`}
                                style={{ left: `${shooterAim}%`, '--gun-angle': `${-25 - ((shooterAimY - 50) * 0.8)}deg` }}
                            >
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
                    <div className="builder-answer">
                        {builderLetters.map((item) => (
                            <button key={item.index} type="button" onClick={() => removeBuilderLetter(item.index)}>{item.letter}</button>
                        ))}
                    </div>
                    <div className="builder-letters">
                        {question.letters.map((letter, index) => (
                            <button
                                key={`${letter}-${index}`}
                                type="button"
                                disabled={builderLetters.some((item) => item.index === index)}
                                onClick={() => chooseBuilderLetter(letter, index)}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
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
                        const isVisible = answer === choice || choice === question.correct
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
                        {answer ? answer : 'Select the missing word'}
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
                        <button
                            key={choice}
                            type="button"
                            className={`game-orb ${answer === choice ? (choice === question.correct ? 'correct' : 'wrong') : ''}`}
                            onClick={() => chooseAnswer(choice)}
                        >
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
            ) : null}
        </section>
    )
}
