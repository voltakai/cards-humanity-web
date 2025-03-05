import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext(null);

const initialState = {
  gameId: null,
  players: [],
  hand: [],
  blackCard: null,
  submissions: [],
  isCardCzar: false,
  selectedCard: null,
  phase: 'waiting',
  timeLeft: 0,
  error: null
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      return {
        ...state,
        gameId: action.payload.gameId,
        players: action.payload.players,
        phase: 'waiting'
      };
    case 'UPDATE_GAME_STATE':
      return { ...state, ...action.payload };
    case 'SET_HAND':
      return { ...state, hand: action.payload };
    case 'SUBMIT_CARD':
      return {
        ...state,
        hand: state.hand.filter(card => card.id !== action.payload.id)
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ gameState: state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 