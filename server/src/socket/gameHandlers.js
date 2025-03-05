const logger = require('../utils/logger');

function gameHandlers(io, socket) {
  // Join game room
  socket.on('join-game', (gameId, callback) => {
    try {
      socket.join(`game:${gameId}`);
      logger.info(`Player ${socket.id} joined game ${gameId}`);
      if (callback) callback({ success: true });
    } catch (error) {
      logger.error('Error joining game:', error);
      if (callback) callback({ success: false, error: 'Failed to join game' });
    }
  });

  // Leave game room
  socket.on('leave-game', (gameId, callback) => {
    try {
      socket.leave(`game:${gameId}`);
      logger.info(`Player ${socket.id} left game ${gameId}`);
      if (callback) callback({ success: true });
    } catch (error) {
      logger.error('Error leaving game:', error);
      if (callback) callback({ success: false, error: 'Failed to leave game' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
}

module.exports = gameHandlers; 