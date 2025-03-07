import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import AdminGameSettings from './AdminGameSettings';

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [games, setGames] = useState([]);
  const [cardPacks, setCardPacks] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch games and card packs on component mount
  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate('/admin/login');
      return;
    }
    
    // Fetch games and card packs
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gamesResponse, packsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/games`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/packs`)
        ]);
        
        setGames(gamesResponse.data);
        setCardPacks(packsResponse.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, isAdmin, navigate]);

  // Define the fetchGameDetails function
  const fetchGameDetails = async (gameId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/games/${gameId}`);
      setSelectedGame(response.data);
    } catch (err) {
      setError(`Failed to load game details for game ${gameId}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update selectedGame and fetch details
  useEffect(() => {
    if (selectedGame?.id) {
      fetchGameDetails(selectedGame.id);
    }
  }, [selectedGame?.id]); // Include the dependency

  // Handle game selection
  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  // Handle card pack toggle
  const handlePackToggle = async (packId, isEnabled) => {
    if (!selectedGame) return;
    
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/games/${selectedGame.id}/packs`, {
        packId,
        enabled: isEnabled
      });
      
      // Refresh game details
      fetchGameDetails(selectedGame.id);
    } catch (err) {
      setError('Failed to update game settings');
      console.error(err);
    }
  };

  if (loading && !games.length) {
    return <div className="admin-dashboard loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-dashboard error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-content">
        <div className="games-list">
          <h2>Active Games</h2>
          {games.length === 0 ? (
            <p>No active games</p>
          ) : (
            <ul>
              {games.map(game => (
                <li 
                  key={game.id} 
                  className={selectedGame?.id === game.id ? 'selected' : ''}
                  onClick={() => handleGameSelect(game)}
                >
                  {game.name} ({game.players.length}/{game.max_players})
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="game-settings">
          {selectedGame ? (
            <AdminGameSettings 
              game={selectedGame}
              cardPacks={cardPacks}
              onPackToggle={handlePackToggle}
            />
          ) : (
            <p>Select a game to view and edit settings</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 