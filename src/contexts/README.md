# QuizContext Technical Documentation

## Architecture Overview

The `QuizContext` implements a state management solution using React's Context API with a reducer pattern. It serves as the central state store for the quiz application, managing navigation state, user answers, and quiz progression.

## Core Components

- **QuizContext.tsx**: Creates context, provider component, and `useQuiz` hook
- **QuizReducer.ts**: Contains reducer function and action type definitions

## State Structure

The state is managed via a reducer with the following structure:

```typescript
interface QuizState {
	quizSession: QuizSession // Holds quiz data and user answers
	currentActivityOrder: number // Current activity index
	currentQuestionOrRoundOrder: number // Current question/round index
	currentRoundQuestionOrder: number // Current question within round
}
```

## Action Types

The reducer handles the following action types:

```typescript
type QuizAction =
	| { type: 'SET_QUIZ_SESSION'; quizSession: QuizSession }
	| { type: 'SET_ACTIVITY_ORDER'; order: number }
	| { type: 'NEXT_QUESTION_OR_ROUND' }
	| { type: 'NEXT_ROUND_QUESTION' }
	| { type: 'RESET_ROUND_QUESTIONS' }
	| { type: 'RESET_ANSWERS' }
	| { type: 'ANSWER_QUESTION'; answer: boolean }
```

## Data Flow

1. **Initialization**: `loadQuiz()` fetches data, then creates a `QuizSession` instance
2. **State Updates**: All state updates go through the `dispatch` function
3. **Derived State**: Uses `useMemo` to compute derived state from the core state
4. **Component Access**: Components access state via the `useQuiz()` hook

## Technical Implementation Details

### State Initialization

```typescript
useEffect(() => {
	const initQuiz = async () => {
		setIsLoading(true)
		try {
			const quiz = await loadQuiz()
			const quizSession = new QuizSession(quiz)
			dispatch({ type: 'SET_QUIZ_SESSION', quizSession })
		} finally {
			setIsLoading(false)
		}
	}
	initQuiz()
}, [])
```

### Memoized Selectors

Derived state is computed using `useMemo` to prevent unnecessary recalculations:

```typescript
const currentActivity = useMemo(() => {
	if (!state.quizSession?.quiz) {
		return
	}
	return state.quizSession.quiz.getActivityByOrder(state.currentActivityOrder)
}, [state.quizSession, state.currentActivityOrder])
```

### Question ID Structure

Question IDs are structured to handle both direct questions and questions within rounds:

- Direct questions: `${activityOrder}-${questionOrder}`
- Round questions: `${activityOrder}-${roundOrder}-${questionOrder}`

### Context Value Composition

The context value is constructed using `useMemo` to optimize performance, combining:

- Raw state values
- Computed/derived values
- Action dispatchers

## QuizSession Model Integration

The `QuizSession` class acts as the bridge between the UI state and the quiz data model:

- Stores all user answers in a `Map<QuestionId, boolean>`
- Provides methods to answer questions and reset state
- Computes activity completion status
- Generates result summaries for answered questions

## API Reference

### Exposed Properties

| Property                    | Type                             | Description                                            |
| --------------------------- | -------------------------------- | ------------------------------------------------------ |
| `isLoading`                 | `boolean`                        | Indicates data loading state                           |
| `quizDetails`               | `object`                         | Contains quiz metadata                                 |
| `currentActivity`           | `Activity \| undefined`          | Currently active activity                              |
| `currentQuestionOrRound`    | `Question \| Round \| undefined` | Current question or round                              |
| `currentRoundQuestion`      | `Question \| undefined`          | Current question within a round                        |
| `isCurrentActivityComplete` | `boolean`                        | Whether all questions in current activity are answered |
| `currentActivityResults`    | `ActivityResults`                | Results for the current activity                       |

### Exposed Methods

| Method                  | Parameters        | Return | Description                                |
| ----------------------- | ----------------- | ------ | ------------------------------------------ |
| `setActivityOrder`      | `order: number`   | `void` | Navigates to specific activity by order    |
| `nextQuestionOrRound`   | none              | `void` | Advances to next question or round         |
| `nextRoundQuestion`     | none              | `void` | Advances to next question in current round |
| `resetRoundQuestions`   | none              | `void` | Resets to first question in current round  |
| `resetAnswers`          | none              | `void` | Resets all answers and navigation state    |
| `answerCurrentQuestion` | `answer: boolean` | `void` | Records answer for current question        |

## Using with TypeScript

Type checking is provided through the `QuizContextType` interface:

```typescript
type QuizContextType = {
	isLoading: boolean
	quizDetails: {
		name: string
		heading: string
		activityNameAndOrders: { name: string; order: number }[]
	}
	currentActivity: Activity | undefined
	currentQuestionOrRound: QuestionOrRound | undefined
	currentRoundQuestion: Question | undefined
	isCurrentActivityComplete: boolean
	currentActivityResults: ActivityResults
	setActivityOrder: (order: number) => void
	nextQuestionOrRound: () => void
	nextRoundQuestion: () => void
	resetRoundQuestions: () => void
	resetAnswers: () => void
	answerCurrentQuestion: (answer: boolean) => void
}
```

## Common Development Scenarios

### Adding a New Action

1. Add the action type to the `QuizAction` union type in `QuizReducer.ts`:

   ```typescript
   type QuizAction =
   	| { type: 'EXISTING_ACTION' }
   	| { type: 'NEW_ACTION'; someParam: string }
   ```

2. Handle the action in the reducer function:

   ```typescript
   case 'NEW_ACTION':
     return {
       ...state,
       // Update state properties based on action
     }
   ```

3. Add a dispatcher function to the context value:
   ```typescript
   const contextValue = useMemo(
   	() => ({
   		// ...other values
   		handleNewAction: (someParam: string) =>
   			dispatch({ type: 'NEW_ACTION', someParam })
   	}),
   	[
   		/* dependencies */
   	]
   )
   ```

### Adding a New Derived State

Add a new memoized value in the `QuizProvider` component:

```typescript
const newDerivedValue = useMemo(() => {
	// Compute value based on state
	return someComputation(state.someValue)
}, [state.someValue])

// Add to context value
const contextValue = useMemo(
	() => ({
		// ...existing values
		newDerivedValue
	}),
	[
		/* dependencies including newDerivedValue */
	]
)
```

## Integration with Models

The context integrates with the model classes to enforce type safety and encapsulation of quiz logic. This separation of concerns ensures that:

1. UI components only need to know how to interact with the context API
2. Quiz business logic is contained within the models
3. State transitions are handled predictably through the reducer

The `QuizSession` model is particularly important as it acts as a bridge between the UI state and the underlying quiz data model.
