import React from 'react';
import './PlayerList.css';

const PlayerList = ({ players, currentPlayer, czar }) => {
  return (
    <div className="player-list">
      <h3>Players</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id} className={`
            ${player.id === currentPlayer?.id ? 'current-player' : ''}
            ${player.id === czar?.id ? 'czar' : ''}
          `}>
            {player.username} {player.id === czar?.id ? '(Card Czar)' : ''}
            {player.id === currentPlayer?.id ? ' (You)' : ''}
            <span className="score">{player.score || 0} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList; 