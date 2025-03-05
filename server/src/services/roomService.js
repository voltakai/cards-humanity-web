const { pool } = require('../config/database');
const gameService = require('./gameService');

class RoomService {
  constructor() {
    this.rooms = new Map();
  }

  async createRoom(hostUsername) {
    try {
      const game = await gameService.createGame();
      const host = await gameService.addPlayer(game.id, hostUsername);
      
      this.rooms.set(game.id, {
        id: game.id,
        host: host.id,
        players: [host],
        status: 'waiting',
        round: 0,
        cardCzar: null,
        submittedCards: [],
        startTime: new Date()
      });

      return this.rooms.get(game.id);
    } catch (error) {
      console.error('Error creating room:', error);
      throw new Error('Failed to create room');
    }
  }

  async joinRoom(gameId, username) {
    const room = this.rooms.get(gameId);
    if (!room) throw new Error('Room not found');
    if (room.status !== 'waiting') throw new Error('Game already in progress');
    
    try {
      const player = await gameService.addPlayer(gameId, username);
      room.players.push(player);
      
      // Start game if enough players
      if (room.players.length >= 3) {
        room.status = 'ready';
      }

      return { room, player };
    } catch (error) {
      console.error('Error joining room:', error);
      throw new Error('Failed to join room');
    }
  }

  async startGame(gameId) {
    const room = this.rooms.get(gameId);
    if (!room) throw new Error('Room not found');
    if (room.players.length < 3) throw new Error('Not enough players');

    try {
      // Select first card czar
      const cardCzar = await gameService.selectNextCardCzar(gameId);
      room.cardCzar = cardCzar.id;
      room.status = 'playing';
      room.round = 1;

      // Deal initial cards to all players
      for (const player of room.players) {
        await gameService.dealCards(gameId, player.id);
      }

      return room;
    } catch (error) {
      console.error('Error starting game:', error);
      throw new Error('Failed to start game');
    }
  }

  async removePlayer(gameId, playerId) {
    const room = this.rooms.get(gameId);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== playerId);

    // End game if not enough players
    if (room.players.length < 3 && room.status === 'playing') {
      room.status = 'ended';
    }

    // Delete room if empty
    if (room.players.length === 0) {
      this.rooms.delete(gameId);
    }

    return room;
  }
}

module.exports = new RoomService(); 