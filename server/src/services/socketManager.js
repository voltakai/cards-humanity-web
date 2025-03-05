const GameStateManager = require('./gameStateManager');

class SocketManager {
  constructor(io) {
    this.io = io;
    this.gameStateManager = new GameStateManager(io);
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('joinGame', async (data) => {
        try {
          const { gameId, username } = data;
          
          // Join socket room
          socket.join(gameId);
          socket.gameId = gameId;
          
          // Add player to game
          await this.gameStateManager.addPlayer(gameId, username, socket.id);
          
          // Notify other players
          socket.to(gameId).emit('playerJoined', { username });
          
          // Send current game state
          const gameState = await this.gameStateManager.getGameState(gameId);
          socket.emit('gameState', gameState);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('submitCard', async (data) => {
        try {
          const { gameId, cardId } = data;
          await this.gameStateManager.handleCardSubmission(gameId, socket.id, cardId);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('selectWinner', async (data) => {
        try {
          const { gameId, submissionId } = data;
          await this.gameStateManager.handleWinnerSelection(gameId, submissionId);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('disconnect', async () => {
        try {
          if (socket.gameId) {
            await this.gameStateManager.handlePlayerDisconnect(socket.gameId, socket.id);
          }
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      });
    });
  }
}

module.exports = SocketManager; 