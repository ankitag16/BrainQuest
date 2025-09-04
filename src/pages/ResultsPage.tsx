import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw, Clock, Target, Award, AlertCircle } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { HighScore } from '../types/quiz';
import QuestionCard from '../components/QuestionCard';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useQuiz();
  const [highScores, setHighScores] = useLocalStorage<HighScore[]>('quizHighScores', []);
  const hasProcessedResults = useRef(false);

  const quizResult = useMemo(() => {
    const score = state.userAnswers.filter(answer => answer.isCorrect).length;
    const totalTime = state.quizStartTime ? Date.now() - state.quizStartTime : 0;
    
    return {
      score,
      totalQuestions: state.questions.length,
      userAnswers: state.userAnswers,
      completedAt: new Date().toISOString(),
      totalTime,
    };
  }, [state.userAnswers, state.questions.length, state.quizStartTime]);

  const percentage = useMemo(() => {
    return (quizResult.score / quizResult.totalQuestions) * 100;
  }, [quizResult.score, quizResult.totalQuestions]);

  const averageTimePerQuestion = useMemo(() => {
    return quizResult.totalTime / quizResult.totalQuestions / 1000;
  }, [quizResult.totalTime, quizResult.totalQuestions]);

  const unansweredCount = useMemo(() => {
    return state.userAnswers.filter(answer => answer.selectedAnswer === -1).length;
  }, [state.userAnswers]);

  useEffect(() => {
    if (!state.isQuizCompleted || state.userAnswers.length === 0) {
      navigate('/');
      return;
    }

    // Only process results once
    if (!hasProcessedResults.current) {
      const newHighScore: HighScore = {
        score: quizResult.score,
        totalQuestions: quizResult.totalQuestions,
        percentage,
        completedAt: quizResult.completedAt,
        totalTime: quizResult.totalTime,
      };

      setHighScores(prev => {
        const updated = [...prev, newHighScore];
        return updated.sort((a, b) => b.percentage - a.percentage).slice(0, 10);
      });

      hasProcessedResults.current = true;
    }
  }, [state.isQuizCompleted, state.userAnswers.length, navigate, quizResult, percentage, setHighScores]);

  const handleRestart = () => {
    hasProcessedResults.current = false;
    dispatch({ type: 'RESTART_QUIZ' });
    navigate('/');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { message: 'Outstanding!', icon: '🏆' };
    if (score >= 80) return { message: 'Excellent!', icon: '🌟' };
    if (score >= 70) return { message: 'Good job!', icon: '👍' };
    if (score >= 60) return { message: 'Not bad!', icon: '👌' };
    return { message: 'Keep practicing!', icon: '💪' };
  };

  const scoreInfo = useMemo(() => getScoreMessage(percentage), [percentage]);

  if (!state.isQuizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Quiz Complete! {scoreInfo.icon}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{scoreInfo.message}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className={`text-4xl md:text-5xl font-bold ${getScoreColor(percentage)} mb-2`}>
                {percentage.toFixed(1)}%
              </div>
              <p className="text-gray-600 font-medium">Final Score</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                <Target className="w-6 h-6 mr-2" />
                {quizResult.score}/{quizResult.totalQuestions}
              </div>
              <p className="text-gray-600 font-medium">Correct Answers</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center text-2xl md:text-3xl font-bold text-purple-600 mb-2">
                <Clock className="w-6 h-6 mr-2" />
                {averageTimePerQuestion.toFixed(1)}s
              </div>
              <p className="text-gray-600 font-medium">Avg. per Question</p>
            </div>

            {unansweredCount > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center text-2xl md:text-3xl font-bold text-red-600 mb-2">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  {unansweredCount}
                </div>
                <p className="text-gray-600 font-medium">Unanswered</p>
              </div>
            )}
          </div>

          {unansweredCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex items-center text-yellow-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {unansweredCount} question{unansweredCount > 1 ? 's' : ''} left unanswered due to timeout
                </span>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            <Link
              to="/"
              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2" />
            Answer Review
          </h2>
          
          <div className="space-y-6">
            {state.questions.map((question, index) => {
              const userAnswer = state.userAnswers.find(a => a.questionId === question.id);
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <QuestionCard
                    question={question}
                    onAnswer={() => {}}
                    selectedAnswer={null}
                    showCorrectAnswer={true}
                    userAnswer={userAnswer?.selectedAnswer}
                    isSubmitted={true}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {highScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
              High Scores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highScores.slice(0, 6).map((score, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{score.percentage.toFixed(1)}%</span>
                    {index === 0 && <Trophy className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <div className="text-sm text-gray-600">
                    {score.score}/{score.totalQuestions} correct
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(score.completedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
