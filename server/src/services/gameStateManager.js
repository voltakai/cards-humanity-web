const { pool } = require('../config/database');
const cardService = require('./cardService');

class GameStateManager {
  constructor(io) {
    this.io = io;
    this.activeGames = new Map();
  }

  async initializeGame(gameId) {
    try {
      // Initialize game state
      const gameState = {
        id: gameId,
        status: 'waiting',
        players: [],
        currentRound: 0,
        blackCard: null,
        submissions: new Map(),
        cardCzar: null,
        roundTimeout: null,
        minPlayers: 3,    // Minimum players needed to start
        maxPlayers: 20,   // Updated to 20 maximum players
        pointsToWin: 10   // Points needed to win
      };

      // Load initial cards
      await this.loadCards(gameId);
      this.activeGames.set(gameId, gameState);
      return gameState;
    } catch (error) {
      console.error('Error initializing game:', error);
      throw error;
    }
  }

  async loadCards(gameId) {
    const query = `
      INSERT INTO game_cards (game_id, card_id, status)
      SELECT $1, id, 'in_deck'
      FROM cards
      WHERE type IN ('black', 'white')
    `;

    try {
      await pool.query(query, [gameId]);
    } catch (error) {
      console.error('Error loading cards:', error);
      throw error;
    }
  }

  async startRound(gameId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) throw new Error('Game not found');

    try {
      // Select new Card Czar
      const newCardCzar = await this.selectNextCardCzar(gameId);
      gameState.cardCzar = newCardCzar;

      // Draw new black card
      const blackCard = await cardService.drawBlackCard(gameId);
      gameState.blackCard = blackCard;

      // Reset submissions
      gameState.submissions.clear();
      gameState.currentRound++;

      // Update game state
      this.activeGames.set(gameId, gameState);

      // Notify players
      this.io.to(gameId).emit('roundStarted', {
        round: gameState.currentRound,
        blackCard,
        cardCzar: newCardCzar
      });

      // Set round timer
      this.setRoundTimer(gameId);
    } catch (error) {
      console.error('Error starting round:', error);
      throw error;
    }
  }

  setRoundTimer(gameId) {
    const gameState = this.activeGames.get(gameId);
    if (gameState.roundTimeout) {
      clearTimeout(gameState.roundTimeout);
    }

    // 60 seconds for submissions, 30 seconds for Card Czar to choose
    const SUBMISSION_TIME = 60000;
    const SELECTION_TIME = 30000;

    gameState.roundTimeout = setTimeout(() => {
      this.handleRoundTimeout(gameId);
    }, SUBMISSION_TIME);

    // Notify players of time remaining
    let timeLeft = SUBMISSION_TIME / 1000;
    const timer = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearInterval(timer);
      } else {
        this.io.to(gameId).emit('timeUpdate', { timeLeft });
      }
    }, 1000);
  }

  async handleRoundTimeout(gameId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return;

    // If not all players have submitted, auto-submit random cards
    const players = gameState.players.filter(p => p.id !== gameState.cardCzar.id);
    for (const player of players) {
      if (!gameState.submissions.has(player.id)) {
        await this.autoSubmitCard(gameId, player.id);
      }
    }

    // Start Card Czar selection phase
    this.startSelectionPhase(gameId);
  }

  async autoSubmitCard(gameId, playerId) {
    try {
      const randomCard = await cardService.getRandomCardFromHand(gameId, playerId);
      if (randomCard) {
        await this.handleCardSubmission(gameId, playerId, randomCard.id);
      }
    } catch (error) {
      console.error('Error auto-submitting card:', error);
    }
  }

  async handleCardSubmission(gameId, playerId, cardId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) throw new Error('Game not found');

    try {
      // Submit card
      const submission = await cardService.submitWhiteCard(gameId, playerId, cardId);
      gameState.submissions.set(playerId, submission);

      // Notify players
      this.io.to(gameId).emit('cardSubmitted', {
        playerId,
        submissionCount: gameState.submissions.size
      });

      // Check if all players have submitted
      const players = gameState.players.filter(p => p.id !== gameState.cardCzar.id);
      if (gameState.submissions.size === players.length) {
        this.startSelectionPhase(gameId);
      }
    } catch (error) {
      console.error('Error handling card submission:', error);
      throw error;
    }
  }

  async startSelectionPhase(gameId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return;

    // Clear submission timer
    if (gameState.roundTimeout) {
      clearTimeout(gameState.roundTimeout);
    }

    // Shuffle submissions
    const submissions = Array.from(gameState.submissions.values());
    const shuffledSubmissions = this.shuffleArray(submissions);

    // Send submissions to all players
    this.io.to(gameId).emit('selectionPhaseStarted', {
      submissions: shuffledSubmissions
    });

    // Set selection timer
    const SELECTION_TIME = 30000;
    gameState.roundTimeout = setTimeout(() => {
      this.handleSelectionTimeout(gameId);
    }, SELECTION_TIME);
  }

  async handleSelectionTimeout(gameId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return;

    // Auto-select random winner
    const submissions = Array.from(gameState.submissions.values());
    if (submissions.length > 0) {
      const randomWinner = submissions[Math.floor(Math.random() * submissions.length)];
      await this.handleWinnerSelection(gameId, randomWinner.id);
    }
  }

  async handleWinnerSelection(gameId, submissionId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) throw new Error('Game not found');

    try {
      // Update winner
      const winner = await cardService.selectWinner(gameId, submissionId);

      // Notify players
      this.io.to(gameId).emit('roundWinner', {
        winner,
        winningCard: gameState.submissions.get(winner.id)
      });

      // Check if game should end
      if (await this.checkGameEnd(gameId)) {
        await this.endGame(gameId);
      } else {
        // Start new round after delay
        setTimeout(() => this.startRound(gameId), 5000);
      }
    } catch (error) {
      console.error('Error handling winner selection:', error);
      throw error;
    }
  }

  async checkGameEnd(gameId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return true;

    // End game if any player reaches 10 points
    return gameState.players.some(player => player.score >= 10);
  }

  async endGame(gameId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return;

    try {
      // Update game status in database
      await pool.query(
        'UPDATE games SET status = $1 WHERE id = $2',
        ['ended', gameId]
      );

      // Get final scores
      const finalScores = gameState.players.map(player => ({
        id: player.id,
        username: player.username,
        score: player.score
      }));

      // Notify players
      this.io.to(gameId).emit('gameEnded', {
        winners: finalScores.filter(p => p.score >= 10),
        finalScores
      });

      // Cleanup
      if (gameState.roundTimeout) {
        clearTimeout(gameState.roundTimeout);
      }
      this.activeGames.delete(gameId);
    } catch (error) {
      console.error('Error ending game:', error);
      throw error;
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = GameStateManager; 