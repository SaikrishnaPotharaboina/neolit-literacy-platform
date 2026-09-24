export default function GameSelector({ gameGroups, selectedId, chooseGame, gamesUiCopy }) {
    return (
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
                            <button
                                key={game.id}
                                type="button"
                                className={`game-card ${selectedId === game.id ? 'active' : ''}`}
                                onClick={() => chooseGame(game.id)}
                            >
                                <span className="game-card-icon">{game.icon}</span>
                                <strong>{game.title}</strong>
                                <small>{game.description}</small>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}
