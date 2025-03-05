import React, { useState, useEffect } from 'react';
import './GameTimer.css';

const GameTimer = ({ timeLeft, phase }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const totalTime = phase === 'submission' ? 60 : 30;
    setProgress((timeLeft / totalTime) * 100);
  }, [timeLeft, phase]);

  return (
    <div className="game-timer">
      <div className="timer-bar">
        <div 
          className="timer-progress"
          style={{ 
            width: `${progress}%`,
            backgroundColor: progress < 25 ? '#ff4444' : '#4CAF50'
          }}
        />
      </div>
      <div className="timer-text">
        {timeLeft} seconds remaining for {phase}
      </div>
    </div>
  );
};

export default GameTimer; 