import { useEffect, useState } from "react";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const PLAYER_NAMES = {
  X: "Taino",
  O: "Caribe",
};

function getWinner(squares) {
  const line = WINNING_LINES.find(([a, b, c]) => {
    return squares[a] && squares[a] === squares[b] && squares[a] === squares[c];
  });

  return line ? { player: squares[line[0]], line } : null;
}

function getSavedGame() {
  try {
    const savedGame = window.localStorage.getItem("tres-en-raya");
    if (!savedGame) return null;

    const game = JSON.parse(savedGame);
    const isValid =
      Array.isArray(game.squares) &&
      game.squares.length === 9 &&
      game.squares.every((square) => square === null || square === "X" || square === "O") &&
      (game.currentPlayer === "X" || game.currentPlayer === "O");

    return isValid ? game : null;
  } catch (error) {
    console.error("No se pudo recuperar la partida guardada.", error);
    return null;
  }
}

function App() {
  const [savedGame] = useState(getSavedGame);
  const [squares, setSquares] = useState(() => savedGame?.squares ?? Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(() => savedGame?.currentPlayer ?? "X");

  const winner = getWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  const isGameOver = Boolean(winner || isDraw);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "tres-en-raya",
        JSON.stringify({ squares, currentPlayer }),
      );
    } catch (error) {
      console.error("No se pudo guardar la partida.", error);
    }
  }, [squares, currentPlayer]);

  function playSquare(index) {
    if (squares[index] || isGameOver) return;

    const nextSquares = [...squares];
    nextSquares[index] = currentPlayer;
    setSquares(nextSquares);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }

  function restartGame() {
    setSquares(Array(9).fill(null));
    setCurrentPlayer("X");
  }

  let gameMessage = `Turno de ${PLAYER_NAMES[currentPlayer]}`;
  if (winner) gameMessage = `¡${PLAYER_NAMES[winner.player]} gana la partida!`;
  if (isDraw) gameMessage = "¡Empate! La próxima se decide en el patio.";

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Taino vs Caribe, inicio">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>JUEGOS DE QUISQUEYA</span>
        </a>
        <span className="edition">EDICIÓN DE PATIO <span aria-hidden="true">✳</span></span>
      </header>

      <section className="game-layout" aria-labelledby="game-title">
        <div className="intro">
          <p className="eyebrow"><span /> UN CLÁSICO, A LO DOMINICANO</p>
          <h1 id="game-title">Taino <span>vs.</span><br />Caribe</h1>
          <p className="intro-copy">
            Tres en raya, una sola misión: alinear tus símbolos antes que tu
            contrincante.
          </p>

          <div className="players" aria-label="Jugadores">
            <div className={`player-card player-x ${currentPlayer === "X" && !isGameOver ? "is-active" : ""}`}>
              <span className="player-symbol">X</span>
              <span className="player-info"><strong>Taino</strong><small>JUGADOR 1</small></span>
              {currentPlayer === "X" && !isGameOver && <span className="turn-dot" aria-label="Su turno" />}
            </div>
            <div className={`player-card player-o ${currentPlayer === "O" && !isGameOver ? "is-active" : ""}`}>
              <span className="player-symbol">O</span>
              <span className="player-info"><strong>Caribe</strong><small>JUGADOR 2</small></span>
              {currentPlayer === "O" && !isGameOver && <span className="turn-dot" aria-label="Su turno" />}
            </div>
          </div>

          <p className="how-to-play"><span aria-hidden="true">↗</span> ¡Toca un cuadro vacío para jugar!</p>
        </div>

        <div className="board-panel">
          <div className="board-heading">
            <div>
              <p className="board-label">PARTIDA EN CURSO</p>
              <p className="game-status" aria-live="polite">{gameMessage}</p>
            </div>
            <span className="round-number">01 <span>/ 01</span></span>
          </div>

          <div className="board" role="group" aria-label="Tablero de Tres en Raya">
            {squares.map((square, index) => {
              const isWinningSquare = winner?.line.includes(index);

              return (
                <button
                  className={`square ${square ? `square-${square.toLowerCase()}` : ""} ${isWinningSquare ? "is-winning" : ""}`}
                  key={index}
                  type="button"
                  onClick={() => playSquare(index)}
                  disabled={Boolean(square) || isGameOver}
                  aria-label={`Cuadro ${index + 1}${square ? `, ${square === "X" ? "Taino" : "Caribe"}` : ", vacío"}`}
                >
                  {square}
                </button>
              );
            })}
          </div>

          <button className="reset-button" type="button" onClick={restartGame}>
            <span aria-hidden="true">↻</span> Reiniciar partida
          </button>
        </div>
      </section>

      <footer className="footer">
        <p>HECHO CON ORGULLO EN QUISQUEYA <span aria-hidden="true">♥</span></p>
        <div className="flag" role="img" aria-label="Bandera de República Dominicana">
          <span /><span /><span /><span />
        </div>
      </footer>
    </main>
  );
}

export default App;
