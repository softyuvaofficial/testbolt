'use client';

import { createContext, useContext, useReducer } from 'react';

const TestContext = createContext({});

const initialState = {
  currentTest: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  markedQuestions: [],
  timeRemaining: 0,
  testStartTime: null,
  testStatus: 'not_started' // not_started, in_progress, completed
};

const testReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEST':
      return {
        ...state,
        currentTest: action.payload,
        testStatus: 'not_started'
      };
    
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload
      };
    
    case 'START_TEST':
      return {
        ...state,
        testStatus: 'in_progress',
        testStartTime: new Date(),
        timeRemaining: action.payload.duration * 60 // Convert minutes to seconds
      };
    
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: action.payload
      };
    
    case 'SAVE_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer
        }
      };
    
    case 'MARK_QUESTION':
      return {
        ...state,
        markedQuestions: state.markedQuestions.includes(action.payload)
          ? state.markedQuestions.filter(id => id !== action.payload)
          : [...state.markedQuestions, action.payload]
      };
    
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1)
      };
    
    case 'COMPLETE_TEST':
      return {
        ...state,
        testStatus: 'completed'
      };
    
    case 'RESET_TEST':
      return initialState;
    
    default:
      return state;
  }
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within TestProvider');
  }
  return context;
};

export const TestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(testReducer, initialState);

  const value = {
    ...state,
    dispatch
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
};