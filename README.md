# BrainQuest App

A modern, interactive quiz application built with React, TypeScript, and Tailwind CSS. Features multiple-choice questions, timer functionality, progress tracking, and high score management.

## Features

### Core Functionality
- **10 Multiple-Choice Questions**: Covering various topics with different difficulty levels
- **30-Second Timer**: Each question has a countdown timer that auto-submits when time runs out
- **Progress Tracking**: Visual progress indicator showing current question and completion percentage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Experience
- **Clean, Modern UI**: Beautiful interface with smooth animations using Framer Motion
- **Question Navigation**: Move between questions with Previous/Next buttons
- **Skip Option**: Skip questions if unsure (counts as incorrect)
- **Real-time Feedback**: Immediate visual feedback for selected answers

### Results & Analytics
- **Detailed Results Page**: Shows final score, percentage, and average time per question
- **Answer Review**: Review all questions with correct answers highlighted
- **High Score Tracking**: Local storage saves your best performances
- **Performance Metrics**: Track accuracy and speed improvements

### Accessibility & Technical
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Local Storage**: Persistent high scores and settings
- **TypeScript**: Full type safety and better development experience
- **Modular Architecture**: Clean, maintainable component structure

## Tech Stack

- **React 19** with functional components and hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vite** for fast development and building

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── QuestionCard.tsx
│   ├── ProgressIndicator.tsx
│   └── Timer.tsx
├── context/            # React Context for state management
│   └── QuizContext.tsx
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── pages/              # Main page components
│   ├── HomePage.tsx
│   ├── QuizPage.tsx
│   └── ResultsPage.tsx
├── types/              # TypeScript type definitions
│   └── quiz.ts
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- Yarn package manager

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
yarn build
```

The built files will be in the `dist` directory.

## Usage

1. **Start Quiz**: Click "Start Quiz" on the home page
2. **Answer Questions**: Select your answer and click "Next" or wait for the timer
3. **Navigate**: Use Previous/Next buttons or Skip if unsure
4. **Review Results**: See your score and review all answers
5. **Try Again**: Click "Try Again" to take the quiz again

## Question Format

Questions are stored in `public/questions.json` with the following structure:

```json
{
  "questions": [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "correctAnswer": 2,
      "difficulty": "easy"
    }
  ]
}
```

## Customization

### Adding Questions
Edit `public/questions.json` to add more questions. Each question needs:
- Unique `id`
- Question text
- Array of 4 options
- Index of correct answer (0-3)
- Difficulty level (easy/medium/hard)

### Modifying Timer
Change the timer duration in `src/pages/QuizPage.tsx`:
```typescript
<Timer
  duration={30} // Change this value (seconds)
  onTimeUp={handleTimeUp}
  isActive={!isAnswered}
/>
```

### Styling
The app uses Tailwind CSS. Modify styles in component files or extend the Tailwind config in `tailwind.config.js`.

## Performance Optimizations

- **Code Splitting**: Routes are automatically code-split
- **Efficient Re-renders**: React Context with reducer pattern
- **Optimized Images**: Uses external CDN for placeholder images
- **Local Storage**: Minimal data storage for high scores

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.
