import React, { useEffect, useState, useContext } from 'react';
import { useSocket } from '../hooks/useSocket';
import { GameContext } from '../contexts/GameContext';
import Card from './Card';
import Chat from './Chat';
import PlayerList from './PlayerList';
import PlayersList from './PlayersList';
import './GameRoom.css';

const GameRoom = ({ gameId }) => {
  const socket = useSocket();
  const { gameState, dispatch } = useContext(GameContext);
  const [selectedCard, setSelectedCard] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('gameStateUpdate', (newState) => {
      dispatch({ type: 'UPDATE_GAME_STATE', payload: newState });
    });

    socket.on('cardSubmitted', ({ playerId, card }) => {
      dispatch({ type: 'CARD_SUBMITTED', payload: { playerId, card } });
    });

    socket.on('roundWinner', ({ winner, card }) => {
      dispatch({ type: 'ROUND_WINNER', payload: { winner, card } });
    });

    socket.on('newRound', (roundData) => {
      dispatch({ type: 'NEW_ROUND', payload: roundData });
      setSelectedCard(null);
    });

    socket.on('error', (error) => {
      setError(error.message);
      setIsSubmitting(false);
    });

    return () => {
      socket.off('gameStateUpdate');
      socket.off('cardSubmitted');
      socket.off('roundWinner');
      socket.off('newRound');
      socket.off('error');
    };
  }, [socket, dispatch]);

  const handleCardSelect = (card) => {
    if (gameState.isCardCzar || isSubmitting) return;
    setSelectedCard(card);
  };

  const handleCardSubmit = async () => {
    if (!selectedCard || isSubmitting) return;
    setIsSubmitting(true);

    socket.emit('submitCard', {
      gameId,
      cardId: selectedCard.id
    });
  };

  const handleWinnerSelect = (submissionId) => {
    if (!gameState.isCardCzar) return;

    socket.emit('selectWinner', {
      gameId,
      submissionId
    });
  };

  const getWaitingMessage = () => {
    const playerCount = gameState.players.length;
    if (playerCount < 3) {
      return `Waiting for more players... (Need at least 3 to start, ${3 - playerCount} more needed)`;
    }
    if (playerCount === 20) {
      return 'Game is full!';
    }
    return `${20 - playerCount} slots remaining`;
  };

  return (
    <div className="game-room">
      {error && <div className="error-message">{error}</div>}
      
      <div className="game-status">
        <h2>Round {gameState.currentRound}</h2>
        <div className="status-message">
          {gameState.status === 'waiting' && (
            <div className="waiting-message">
              {getWaitingMessage()}
            </div>
          )}
        </div>
        <PlayersList 
          players={gameState.players} 
          cardCzarId={gameState.cardCzar?.id}
        />
      </div>

      <div className="game-board">
        {gameState.blackCard && (
          <div className="black-card-area">
            <Card 
              type="black"
              content={gameState.blackCard.content}
              pick={gameState.blackCard.pick}
            />
          </div>
        )}

        {gameState.isCardCzar ? (
          <div className="submissions-area">
            {gameState.submittedCards.map((submission) => (
              <Card
                key={submission.id}
                type="white"
                content={submission.content}
                onClick={() => handleWinnerSelect(submission.id)}
                selectable={true}
              />
            ))}
          </div>
        ) : (
          <div className="player-hand">
            {gameState.hand.map((card) => (
              <Card
                key={card.id}
                type="white"
                content={card.content}
                onClick={() => handleCardSelect(card)}
                selected={selectedCard?.id === card.id}
                disabled={isSubmitting}
              />
            ))}
            {selectedCard && (
              <button 
                className="submit-button"
                onClick={handleCardSubmit}
                disabled={isSubmitting}
              >
                Submit Card
              </button>
            )}
          </div>
        )}
      </div>

      <Chat gameId={gameId} />
    </div>
  );
};

export default GameRoom; 