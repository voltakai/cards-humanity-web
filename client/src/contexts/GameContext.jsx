import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import { AuthContext } from './AuthContext';

// Create the GameContext
export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    gameId: null,
    players: [],
    cards: {
      black: null,
      hand: [],
      submissions: [],
    },
    round: {
      czar: null,
      status: 'waiting',
      winner: null,
      timer: 0
    },
    chat: {
      messages: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Initialize socket connection
  const socket = useSocket(process.env.REACT_APP_API_URL || 'http://localhost:3001');

  useEffect(() => {
    if (!socket) return;

    socket.on('game:update', (updatedGameState) => {
      setGameState(prevState => ({
        ...prevState,
        ...updatedGameState
      }));
    });

    socket.on('game:error', (err) => {
      setError(err.message);
    });

    // Clean up socket listeners on unmount
    return () => {
      socket.off('game:update');
      socket.off('game:error');
    };
  }, [socket]);

  // Join a game
  const joinGame = (gameId, username) => {
    setLoading(true);
    setError(null);

    if (socket) {
      socket.emit('join-game', { gameId, username }, (response) => {
        setLoading(false);
        if (response.error) {
          setError(response.error);
        } else {
          setGameState(prevState => ({
            ...prevState,
            gameId,
            players: response.players || []
          }));
          navigate(`/game/${gameId}`);
        }
      });
    }
  };

  // Create a new game
  const createGame = (gameName, username, options = {}) => {
    setLoading(true);
    setError(null);

    if (socket) {
      socket.emit('create-game', { name: gameName, host: username, options }, (response) => {
        setLoading(false);
        if (response.error) {
          setError(response.error);
        } else {
          setGameState(prevState => ({
            ...prevState,
            gameId: response.gameId,
            players: [{ id: socket.id, username, isHost: true }]
          }));
          navigate(`/game/${response.gameId}`);
        }
      });
    }
  };

  // Submit a card
  const submitCard = (cardId) => {
    if (socket && gameState.gameId) {
      socket.emit('submit-card', { 
        gameId: gameState.gameId, 
        cardId 
      });
    }
  };

  // Select a winner (for card czar)
  const selectWinner = (playerId) => {
    if (socket && gameState.gameId) {
      socket.emit('select-winner', { 
        gameId: gameState.gameId, 
        playerId 
      });
    }
  };

  // Send a chat message
  const sendChatMessage = (message) => {
    if (socket && gameState.gameId && user) {
      socket.emit('chat-message', {
        gameId: gameState.gameId,
        message,
        user: user.username
      });
    }
  };

  // Leave the current game
  const leaveGame = () => {
    if (socket && gameState.gameId) {
      socket.emit('leave-game', { gameId: gameState.gameId });
      setGameState({
        gameId: null,
        players: [],
        cards: {
          black: null,
          hand: [],
          submissions: [],
        },
        round: {
          czar: null,
          status: 'waiting',
          winner: null,
          timer: 0
        },
        chat: {
          messages: []
        }
      });
      navigate('/');
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        loading,
        error,
        joinGame,
        createGame,
        submitCard,
        selectWinner,
        sendChatMessage,
        leaveGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
}; 