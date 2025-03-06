const { app, server } = require('./app');
const http = require('http');
const SocketManager = require('./services/socketManager');
const logger = require('./utils/logger');
const { pool } = require('./config/database');
const roomService = require('./services/roomService');
const { v4: uuidv4 } = require('uuid');
const cardService = require('./services/cardService');

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Initialize socket manager
new SocketManager(io);

// Store io instance for use in routes
app.set('io', io);

// Database connection test
pool.query('SELECT NOW()', (err) => {
  if (err) {
    logger.error('Database connection error:', err);
    process.exit(1);
  }
  logger.info('Database connected successfully');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('createRoom', async (data) => {
    try {
      const room = await roomService.createRoom(data.username);
      socket.join(room.id);
      socket.emit('roomCreated', room);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('joinRoom', async (data) => {
    try {
      const { room, player } = await roomService.joinRoom(data.gameId, data.username);
      socket.join(room.id);
      
      // Notify all players in the room
      io.to(room.id).emit('playerJoined', { player, room });
      
      // Start game if room is ready
      if (room.status === 'ready') {
        const gameState = await roomService.startGame(room.id);
        io.to(room.id).emit('gameStarted', gameState);
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      // Add message to database if you want to persist chat history
      const message = {
        id: uuidv4(),
        ...data,
        username: socket.username // Set this when user joins
      };
      
      io.to(data.gameId).emit('chatMessage', message);
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('submitCard', async ({ gameId, cardId }) => {
    try {
      const submission = await cardService.submitWhiteCard(gameId, socket.playerId, cardId);
      
      // Notify all players of the submission (without revealing the card to others)
      socket.to(gameId).emit('cardSubmitted', {
        playerId: socket.playerId,
        hidden: true
      });
      
      // Send the full submission back to the submitting player
      socket.emit('cardSubmitted', {
        playerId: socket.playerId,
        card: submission
      });

      // Check if all players have submitted
      const room = roomService.getRoom(gameId);
      const submissions = await cardService.getSubmissions(gameId);
      
      if (submissions.length === room.players.length - 1) { // Minus 1 for Card Czar
        // Reveal cards to Card Czar
        io.to(gameId).emit('allCardsSubmitted', { submissions });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('selectWinner', async ({ gameId, submissionId }) => {
    try {
      const room = roomService.getRoom(gameId);
      if (socket.playerId !== room.cardCzar) {
        throw new Error('Only the Card Czar can select the winner');
      }

      const winner = await cardService.selectWinner(gameId, submissionId);
      io.to(gameId).emit('roundWinner', { winner, submissionId });

      // Start new round
      const newRound = await roomService.startNewRound(gameId);
      io.to(gameId).emit('newRound', newRound);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', async () => {
    // Remove player from any rooms they're in
    // This requires tracking which room the socket is in
    if (socket.gameId) {
      const room = await roomService.removePlayer(socket.gameId, socket.playerId);
      if (room) {
        io.to(room.id).emit('playerLeft', {
          playerId: socket.playerId,
          room
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

// Start the server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to exit here
  // process.exit(1);
}); 