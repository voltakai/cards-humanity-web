import React from 'react';
import './GameResults.css';

const GameResults = ({ winners, finalScores, onPlayAgain }) => {
  return (
    <div className="game-results">
      <div className="results-content">
        <h2>Game Over!</h2>
        
        {winners.length > 0 && (
          <div className="winners-section">
            <h3>Winner{winners.length > 1 ? 's' : ''}:</h3>
            {winners.map(winner => (
              <div key={winner.id} className="winner-item">
                <span className="winner-name">{winner.username}</span>
                <span className="winner-score">{winner.score} points</span>
              </div>
            ))}
          </div>
        )}

        <div className="final-scores">
          <h3>Final Scores</h3>
          {finalScores
            .sort((a, b) => b.score - a.score)
            .map(player => (
              <div key={player.id} className="score-item">
                <span className="player-name">{player.username}</span>
                <span className="player-score">{player.score} points</span>
              </div>
            ))}
        </div>

        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameResults; 