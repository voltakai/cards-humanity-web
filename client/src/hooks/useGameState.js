import { useReducer } from 'react';

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

    case 'START_ROUND':
      return {
        ...state,
        blackCard: action.payload.blackCard,
        isCardCzar: action.payload.isCardCzar,
        submissions: [],
        selectedCard: null,
        phase: 'submission',
        timeLeft: 60
      };

    case 'UPDATE_HAND':
      return {
        ...state,
        hand: action.payload
      };

    case 'SELECT_CARD':
      return {
        ...state,
        selectedCard: action.payload
      };

    case 'SUBMIT_CARD':
      return {
        ...state,
        hand: state.hand.filter(card => card.id !== action.payload.id),
        selectedCard: null,
        phase: 'waiting'
      };

    case 'UPDATE_SUBMISSIONS':
      return {
        ...state,
        submissions: action.payload,
        phase: state.isCardCzar ? 'selection' : 'waiting'
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeLeft: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return { state, dispatch };
} 