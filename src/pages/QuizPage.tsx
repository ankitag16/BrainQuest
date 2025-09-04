import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, SkipForward, Send } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import QuestionCard from '../components/QuestionCard';
import ProgressIndicator from '../components/ProgressIndicator';
import Timer from '../components/Timer';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const currentQuestion = useMemo(() => {
    return state.questions[state.currentQuestionIndex];
  }, [state.questions, state.currentQuestionIndex]);

  const isLastQuestion = useMemo(() => {
    return state.currentQuestionIndex === state.questions.length - 1;
  }, [state.currentQuestionIndex, state.questions.length]);

  const canGoPrevious = useMemo(() => {
    return state.currentQuestionIndex > 0;
  }, [state.currentQuestionIndex]);

  useEffect(() => {
    if (state.questions.length === 0) {
      navigate('/');
      return;
    }
    
    if (!state.quizStartTime) {
      dispatch({ type: 'START_QUIZ' });
    }
  }, [state.questions.length, state.quizStartTime, dispatch, navigate]);

  useEffect(() => {
    if (!currentQuestion) return;

    const currentAnswerIndex = state.userAnswers.findIndex(
      answer => answer.questionId === currentQuestion.id
    );
    
    if (currentAnswerIndex !== -1) {
      setSelectedAnswer(state.userAnswers[currentAnswerIndex].selectedAnswer);
      setIsAnswered(true);
    } else {
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
    
    setTimerKey(prev => prev + 1);
  }, [state.currentQuestionIndex, currentQuestion?.id, state.userAnswers]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (isAnswered) return; // Don't allow changes after submission
    setSelectedAnswer(answerIndex);
  }, [isAnswered]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null || isAnswered || !currentQuestion) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = state.questionStartTime ? Date.now() - state.questionStartTime : 0;
    
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
        timeSpent,
      },
    });
    
    setIsAnswered(true);
  }, [selectedAnswer, isAnswered, currentQuestion, state.questionStartTime, dispatch]);

  // Auto-advance to next question after timeout
  const handleTimeUp = useCallback(() => {
    if (!isAnswered && currentQuestion) {
      const timeSpent = state.questionStartTime ? Date.now() - state.questionStartTime : 0;
      
      if (selectedAnswer !== null) {
        // Submit the currently selected answer
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        dispatch({
          type: 'ANSWER_QUESTION',
          payload: {
            questionId: currentQuestion.id,
            selectedAnswer,
            isCorrect,
            timeSpent,
          },
        });
      } else {
        // No answer selected, submit -1 (unanswered)
        dispatch({
          type: 'ANSWER_QUESTION',
          payload: {
            questionId: currentQuestion.id,
            selectedAnswer: -1, // -1 indicates no answer selected
            isCorrect: false,
            timeSpent,
          },
        });
      }
      
      setIsAnswered(true);
      
      // Auto-advance to next question after a short delay
      setTimeout(() => {
        if (isLastQuestion) {
          dispatch({ type: 'COMPLETE_QUIZ' });
          navigate('/results');
        } else {
          dispatch({ type: 'NEXT_QUESTION' });
        }
      }, 1500); // 1.5 second delay to show the result
    }
  }, [isAnswered, selectedAnswer, currentQuestion, state.questionStartTime, dispatch, isLastQuestion, navigate]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      dispatch({ type: 'COMPLETE_QUIZ' });
      navigate('/results');
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }, [isLastQuestion, dispatch, navigate]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      dispatch({ type: 'PREVIOUS_QUESTION' });
    }
  }, [canGoPrevious, dispatch]);

  const handleSkip = useCallback(() => {
    if (!isAnswered && currentQuestion) {
      const timeSpent = state.questionStartTime ? Date.now() - state.questionStartTime : 0;
      
      dispatch({
        type: 'ANSWER_QUESTION',
        payload: {
          questionId: currentQuestion.id,
          selectedAnswer: -1, // Skip counts as no answer
          isCorrect: false,
          timeSpent,
        },
      });
      
      setIsAnswered(true);
    }
  }, [isAnswered, currentQuestion, state.questionStartTime, dispatch]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <ProgressIndicator
            current={state.currentQuestionIndex}
            total={state.questions.length}
          />
        </motion.div>

        <div className="flex justify-center mb-6">
          <Timer
            key={timerKey}
            duration={30}
            onTimeUp={handleTimeUp}
            isActive={!isAnswered}
            onReset={true}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswerSelect}
              selectedAnswer={selectedAnswer}
              isSubmitted={isAnswered}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-2xl mx-auto"
        >
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              canGoPrevious
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Previous question"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="flex gap-3">
            {!isAnswered && (
              <>
                <button
                  onClick={handleSkip}
                  className="flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200"
                  aria-label="Skip question"
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Skip
                </button>
                
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    selectedAnswer !== null
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Submit answer"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit
                </button>
              </>
            )}
            
            {isAnswered && (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                aria-label={isLastQuestion ? "Finish quiz" : "Next question"}
              >
                {isLastQuestion ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Finish Quiz
                  </>
                ) : (
                  <>
                    Next Question
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Answer selection hint */}
        {!isAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-gray-500">
              {selectedAnswer !== null 
                ? "You can change your answer before submitting" 
                : "Select an answer to continue or wait for auto-advance"
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
