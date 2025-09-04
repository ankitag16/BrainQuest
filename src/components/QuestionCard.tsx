import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedAnswer: number) => void;
  selectedAnswer: number | null;
  showCorrectAnswer?: boolean;
  userAnswer?: number;
  isSubmitted?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  selectedAnswer,
  showCorrectAnswer = false,
  userAnswer,
  isSubmitted = false,
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [question.id]);

  const getOptionStyle = (index: number) => {
    let baseStyle = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 cursor-pointer ";
    
    if (showCorrectAnswer) {
      if (index === question.correctAnswer) {
        baseStyle += "bg-green-100 border-green-500 text-green-800 ";
      } else if (index === userAnswer && index !== question.correctAnswer) {
        baseStyle += "bg-red-100 border-red-500 text-red-800 ";
      } else {
        baseStyle += "bg-gray-100 border-gray-300 text-gray-600 ";
      }
    } else {
      if (selectedAnswer === index) {
        if (isSubmitted) {
          // After submission, show if it's correct or incorrect
          if (index === question.correctAnswer) {
            baseStyle += "bg-green-100 border-green-500 text-green-800 ";
          } else {
            baseStyle += "bg-red-100 border-red-500 text-red-800 ";
          }
        } else {
          // Before submission, show as selected (blue)
          baseStyle += "bg-blue-100 border-blue-500 text-blue-800 ";
        }
      } else {
        if (isSubmitted && index === question.correctAnswer) {
          // Show correct answer even if not selected
          baseStyle += "bg-green-100 border-green-500 text-green-800 ";
        } else {
          baseStyle += "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 ";
        }
      }
    }
    
    return baseStyle;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if this question was unanswered (userAnswer = -1)
  const wasUnanswered = showCorrectAnswer && userAnswer === -1;

  return (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
          {question.question}
        </h2>
        
        {/* Show "No answer selected" message if question was unanswered */}
        {wasUnanswered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center text-red-700">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">No answer selected (Time ran out)</span>
            </div>
          </motion.div>
        )}
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              className={getOptionStyle(index)}
              onClick={() => !showCorrectAnswer && !isSubmitted && onAnswer(index)}
              disabled={showCorrectAnswer || isSubmitted}
              whileHover={!showCorrectAnswer && !isSubmitted ? { scale: 1.02 } : {}}
              whileTap={!showCorrectAnswer && !isSubmitted ? { scale: 0.98 } : {}}
              aria-label={`Option ${index + 1}: ${option}`}
            >
              <div className="flex items-center">
                <span className="font-semibold text-sm bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm md:text-base">{option}</span>
                {selectedAnswer === index && !showCorrectAnswer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    {isSubmitted ? (
                      index === question.correctAnswer ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-600 font-bold">✗</span>
                      )
                    ) : (
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    )}
                  </motion.div>
                )}
                {showCorrectAnswer && index === question.correctAnswer && (
                  <span className="ml-auto text-green-600 font-bold">✓</span>
                )}
                {showCorrectAnswer && index === userAnswer && index !== question.correctAnswer && userAnswer !== -1 && (
                  <span className="ml-auto text-red-600 font-bold">✗</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {!showCorrectAnswer && !isSubmitted && selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-blue-600 font-medium">
              Selected: Option {String.fromCharCode(65 + selectedAnswer)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              You can change your answer before submitting
            </p>
          </motion.div>
        )}

        {/* Show the correct answer section for review */}
        {showCorrectAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-4 border-t border-gray-200"
          >
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium text-gray-700">Your Answer: </span>
                <span className={wasUnanswered ? "text-red-600 font-medium" : 
                  userAnswer === question.correctAnswer ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {wasUnanswered ? "No answer selected" : 
                    `Option ${String.fromCharCode(65 + (userAnswer || 0))}`}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Correct Answer: </span>
                <span className="text-green-600 font-medium">
                  Option {String.fromCharCode(65 + question.correctAnswer)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
