export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  completedAt: string;
  totalTime: number;
}

export interface HighScore {
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  totalTime: number;
}
