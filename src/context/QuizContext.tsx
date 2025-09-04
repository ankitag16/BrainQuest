import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { Question, UserAnswer, QuizResult } from '../types/quiz';

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isQuizCompleted: boolean;
  quizStartTime: number | null;
  questionStartTime: number | null;
}

type QuizAction =
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: number; selectedAnswer: number; isCorrect: boolean; timeSpent: number } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESTART_QUIZ' };

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  isQuizCompleted: false,
  quizStartTime: null,
  questionStartTime: null,
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'START_QUIZ':
      return { 
        ...state, 
        quizStartTime: Date.now(),
        questionStartTime: Date.now()
      };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        userAnswers: [...state.userAnswers, action.payload],
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        questionStartTime: Date.now(),
      };
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        questionStartTime: Date.now(),
      };
    case 'COMPLETE_QUIZ':
      return { ...state, isQuizCompleted: true };
    case 'RESTART_QUIZ':
      return { 
        ...initialState,
        questions: state.questions,
      };
    default:
      return state;
  }
};

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  getQuizResult: () => QuizResult;
} | null>(null);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const getQuizResult = useMemo(() => {
    return (): QuizResult => {
      const score = state.userAnswers.filter(answer => answer.isCorrect).length;
      const totalTime = state.quizStartTime ? Date.now() - state.quizStartTime : 0;
      
      return {
        score,
        totalQuestions: state.questions.length,
        userAnswers: state.userAnswers,
        completedAt: new Date().toISOString(),
        totalTime,
      };
    };
  }, [state.userAnswers, state.questions.length, state.quizStartTime]);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    getQuizResult,
  }), [state, getQuizResult]);

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
