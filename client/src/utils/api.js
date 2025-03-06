import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const fetchCardPacks = async () => {
  try {
    const response = await api.get('/api/packs');
    return response.data;
  } catch (error) {
    console.error('Error fetching card packs:', error);
    throw error;
  }
};

export const fetchGameList = async () => {
  try {
    const response = await api.get('/api/games');
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const createGame = async (gameData) => {
  try {
    const response = await api.post('/api/games', gameData);
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

export const fetchGameById = async (gameId) => {
  try {
    const response = await api.get(`/api/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    throw error;
  }
};

export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Export the api instance and functions
const apiService = {
  fetchCardPacks,
  fetchGameList,
  createGame,
  fetchGameById,
  loginAdmin
};

export default apiService; 