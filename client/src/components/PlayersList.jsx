import React from 'react';
import './PlayersList.css';

const PlayersList = ({ players, cardCzarId }) => {
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="players-container">
      <h3>Players ({players.length}/20)</h3>
      <div className="players-grid">
        {sortedPlayers.map(player => (
          <div 
            key={player.id} 
            className={`player-card ${player.id === cardCzarId ? 'card-czar' : ''}`}
          >
            <div className="player-info">
              <span className="player-name" title={player.username}>
                {player.username.length > 15 
                  ? `${player.username.substring(0, 12)}...` 
                  : player.username}
              </span>
              <span className="player-score">{player.score} pts</span>
            </div>
            {player.id === cardCzarId && (
              <div className="czar-badge">CZAR</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList; 