// Game status constants
export const GAME_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  JUDGING: 'judging',
  COMPLETED: 'completed'
};

// Helper to shuffle array (for cards)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Format time for display
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Calculate if a player is the current czar
export const isPlayerCzar = (playerId, czarId) => {
  return playerId === czarId;
};

// Format player name with special indicators
export const formatPlayerName = (player, currentPlayerId, czarId) => {
  let name = player.username;
  
  if (player.id === czarId) {
    name += ' (Card Czar)';
  }
  
  if (player.id === currentPlayerId) {
    name += ' (You)';
  }
  
  return name;
};

// Default export with all helpers
const gameHelpers = {
  GAME_STATUS,
  shuffleArray,
  formatTime,
  isPlayerCzar,
  formatPlayerName
};

export default gameHelpers; 