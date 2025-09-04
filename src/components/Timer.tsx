import React, { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
  onReset?: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive, onReset }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (onReset) {
      setTimeLeft(duration);
    }
  }, [onReset, duration]);

  // Handle time up in a separate effect to avoid setState during render
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      // Use setTimeout to ensure this runs after the current render cycle
      const timeoutId = setTimeout(() => {
        onTimeUp();
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [timeLeft, isActive, onTimeUp]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; // Just set to 0, don't call onTimeUp here
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]); // Removed onTimeUp from dependencies

  const percentage = (timeLeft / duration) * 100;
  const isLowTime = timeLeft <= 10;

  return (
    <motion.div 
      className="flex items-center space-x-3"
      animate={{ scale: isLowTime ? [1, 1.05, 1] : 1 }}
      transition={{ repeat: isLowTime ? Infinity : 0, duration: 0.5 }}
    >
      <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-500' : 'text-blue-500'}`} />
      <div className="flex items-center space-x-2">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${isLowTime ? 'bg-red-500' : 'bg-blue-500'} rounded-full`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className={`text-sm font-medium ${isLowTime ? 'text-red-500' : 'text-gray-600'}`}>
          {timeLeft}s
        </span>
      </div>
    </motion.div>
  );
};

export default Timer;
