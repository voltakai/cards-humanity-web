import React from 'react';
import Card from './Card';
import './PlayerHand.css';

const PlayerHand = ({ cards, onCardSelect, selectedCard, isSubmitting }) => {
  return (
    <div className="player-hand">
      <div className="hand-container">
        {cards.map(card => (
          <div 
            key={card.id} 
            className={`card-slot ${selectedCard?.id === card.id ? 'selected' : ''}`}
          >
            <Card
              type="white"
              content={card.content}
              onClick={() => onCardSelect(card)}
              disabled={isSubmitting}
              selected={selectedCard?.id === card.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHand; 