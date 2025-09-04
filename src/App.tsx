import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider, useQuiz } from './context/QuizContext';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

const QuizLoader: React.FC = () => {
  const { dispatch } = useQuiz();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        const data = await response.json();
        dispatch({ type: 'SET_QUESTIONS', payload: data.questions });
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    loadQuestions();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <QuizProvider>
        <QuizLoader />
      </QuizProvider>
    </Router>
  );
};

export default App;
