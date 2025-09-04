import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Clock, Trophy, Target } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { HighScore } from '../types/quiz';

const HomePage: React.FC = () => {
  const [highScores] = useLocalStorage<HighScore[]>('quizHighScores', []);
  const bestScore = highScores.length > 0 ? Math.max(...highScores.map(score => score.percentage)) : 0;

  const features = [
    {
      icon: Brain,
      title: "10 Challenging Questions",
      description: "Test your knowledge across various topics"
    },
    {
      icon: Clock,
      title: "30-Second Timer",
      description: "Race against time for each question"
    },
    {
      icon: Target,
      title: "Instant Feedback",
      description: "See correct answers and explanations"
    },
    {
      icon: Trophy,
      title: "High Score Tracking",
      description: "Beat your personal best"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Brain<span className="text-blue-600">Quest</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Challenge yourself with our interactive quiz featuring multiple-choice questions, 
            timers, and detailed progress tracking.
          </p>
          
          {bestScore > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 mb-8"
            >
              <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">
                Your Best Score: {bestScore.toFixed(1)}%
              </span>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/quiz"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Brain className="w-6 h-6 mr-2" />
              Start Quiz
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {highScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
              Recent High Scores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {highScores.slice(0, 3).map((score, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {score.percentage.toFixed(1)}%
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

export default HomePage;
