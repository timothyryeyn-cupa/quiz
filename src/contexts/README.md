# QuizContext Documentation

## Overview

The `QuizContext` provides centralized state management for the quiz application using React's Context API. It handles quiz data, navigation, and state tracking throughout the application.

## Key Concepts

### Quiz Structure

The quiz consists of:
- **Activities**: Top-level sections of the quiz (accessible via `currentActivity`)
- **Questions or Rounds**: Each activity contains either direct questions or rounds (accessible via `currentQuestionOrRound`)
- **Round Questions**: If the current item is a round, it contains multiple questions (accessible via `currentRoundQuestion`)

### State Management

State is managed using a reducer with three key position trackers:
- `currentActivityOrder`: The position in the quiz activities array
- `currentQuestionOrRoundOrder`: The position within the current activity
- `currentRoundQuestionOrder`: The position within the current round (if applicable)

## Available Properties and Methods

### Quiz Data
- `quizName`: The name of the entire quiz
- `quizHeading`: The heading or title text for the quiz
- `quizActivities`: Array of all activities in the quiz
- `isLoading`: Boolean indicating if data is being loaded

### Computed Values
- `currentActivity`: The active Activity object
- `currentQuestionOrRound`: The current Question or Round object
- `currentRoundQuestion`: If in a round, the current Question within that round
- `isActivityComplete`: Boolean indicating if all questions in the current activity are answered

### Actions
- `setActivityOrder(order)`: Navigate to a specific activity
- `nextQuestionOrRound()`: Advance to the next question or round
- `nextRoundQuestion()`: Advance to the next question within the current round
- `resetRoundQuestions()`: Reset to the first question in the current round
- `resetQuiz()`: Reset the entire quiz state and clear all user answers

## Usage Example

```tsx
import { useQuiz } from '../contexts/QuizContext';

function QuizNavigation() {
  const { 
    currentActivity, 
    currentQuestionOrRound,
    nextQuestionOrRound,
    isActivityComplete 
  } = useQuiz();

  return (
    <div>
      <h2>{currentActivity.name}</h2>
      <p>{currentQuestionOrRound.text}</p>
      
      <button 
        onClick={nextQuestionOrRound}
        disabled={!isActivityComplete}
      >
        Next
      </button>
    </div>
  );
}
```

## Implementation Details

- Uses React's `useReducer` for state transitions
- Optimizes with `useMemo` and `useCallback` for performance
- Loads quiz data using the `loadQuiz()` service
- Works with model classes from the `/models` directory

## Provider Setup

Wrap your application with `QuizProvider` at the app level. This is typically done in the main App component:

```tsx
import { QuizProvider } from './contexts/QuizContext';

function App() {
  return (
    <QuizProvider>
      {/* Application components */}
    </QuizProvider>
  );
}
```
