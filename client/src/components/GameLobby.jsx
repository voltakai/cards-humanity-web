import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import './GameLobby.css';

const GameLobby = () => {
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on('gameCreated', ({ gameId }) => {
      setIsCreating(false);
      navigate(`/game/${gameId}`);
    });

    socket.on('joinedGame', ({ gameId }) => {
      setIsJoining(false);
      navigate(`/game/${gameId}`);
    });

    socket.on('error', (error) => {
      setError(error.message);
      setIsCreating(false);
      setIsJoining(false);
    });

    return () => {
      socket.off('gameCreated');
      socket.off('joinedGame');
      socket.off('error');
    };
  }, [socket, navigate]);

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setIsCreating(true);
    setError('');
    socket.emit('createGame', { username: username.trim() });
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!username.trim() || !gameId.trim()) {
      setError('Both username and game ID are required');
      return;
    }

    setIsJoining(true);
    setError('');
    socket.emit('joinGame', { 
      username: username.trim(), 
      gameId: gameId.trim() 
    });
  };

  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <h1>Cards Against Humanity</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="username-section">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            required
          />
        </div>

        <div className="lobby-actions">
          <div className="create-game">
            <h2>Create New Game</h2>
            <button 
              onClick={handleCreateGame}
              disabled={isCreating || !username}
            >
              {isCreating ? 'Creating...' : 'Create Game'}
            </button>
          </div>

          <div className="join-game">
            <h2>Join Existing Game</h2>
            <form onSubmit={handleJoinGame}>
              <input
                type="text"
                placeholder="Enter game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={isJoining || !username || !gameId}
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby; 