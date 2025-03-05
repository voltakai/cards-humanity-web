import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import LoadingSpinner from './LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeGames, setActiveGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const socket = useSocket();

  useEffect(() => {
    fetchActiveGames();
    
    if (socket) {
      socket.emit('adminJoin', { token: localStorage.getItem('adminToken') });
      
      socket.on('gameUpdate', (updatedGame) => {
        setActiveGames(prev => 
          prev.map(game => 
            game.id === updatedGame.id ? updatedGame : game
          )
        );
      });

      socket.on('gameRemoved', (gameId) => {
        setActiveGames(prev => prev.filter(game => game.id !== gameId));
        if (selectedGame?.id === gameId) {
          setSelectedGame(null);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('gameUpdate');
        socket.off('gameRemoved');
      }
    };
  }, [socket]);

  const fetchActiveGames = async () => {
    try {
      const response = await fetch('/api/admin/games', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const data = await response.json();
      setActiveGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKickPlayer = async (gameId, playerId) => {
    try {
      const response = await fetch(`/api/admin/games/${gameId}/kick/${playerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to kick player');
      }

      // Socket will handle the update
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMessage = async (gameId, messageId) => {
    try {
      const response = await fetch(`/api/admin/games/${gameId}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      // Socket will handle the update
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to reset this game?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/games/${gameId}/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset game');
      }

      // Socket will handle the update
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button 
          className="refresh-button"
          onClick={fetchActiveGames}
        >
          Refresh Games
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="games-list">
          <h2>Active Games</h2>
          {activeGames.map(game => (
            <div 
              key={game.id}
              className={`game-item ${selectedGame?.id === game.id ? 'selected' : ''}`}
              onClick={() => setSelectedGame(game)}
            >
              <div className="game-info">
                <span className="game-id">Game: {game.id}</span>
                <span className="player-count">
                  Players: {game.players.length}
                </span>
                <span className="game-status">
                  Status: {game.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedGame && (
          <div className="game-details">
            <h2>Game Details</h2>
            <div className="game-actions">
              <button 
                className="reset-button"
                onClick={() => handleResetGame(selectedGame.id)}
              >
                Reset Game
              </button>
            </div>

            <div className="players-section">
              <h3>Players</h3>
              {selectedGame.players.map(player => (
                <div key={player.id} className="player-item">
                  <span>{player.username}</span>
                  <span>Score: {player.score}</span>
                  {player.isCardCzar && <span className="czar-badge">Card Czar</span>}
                  <button
                    className="kick-button"
                    onClick={() => handleKickPlayer(selectedGame.id, player.id)}
                  >
                    Kick
                  </button>
                </div>
              ))}
            </div>

            <div className="chat-section">
              <h3>Chat Messages</h3>
              {selectedGame.messages.map(message => (
                <div key={message.id} className="message-item">
                  <span className="message-user">{message.username}</span>
                  <span className="message-content">{message.content}</span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteMessage(selectedGame.id, message.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 