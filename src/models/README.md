# Quiz Domain Models

## Architecture Overview

The models directory contains the core domain models that represent the quiz structure and user interaction. The architecture follows an object-oriented approach with a clear hierarchy:

- **Quiz**: Top-level container for the entire quiz
- **Activity**: Major sections within a quiz
- **Question/Round**: Content items within activities
- **QuizSession**: Runtime state of a user's interaction with a quiz

## Class Diagram

```
┌────────┐     ┌──────────┐     ┌─────────────┐
│  Quiz  │1───*│ Activity │1───*│QuestionOrRound│
└────────┘     └──────────┘     └─────────────┘
                                       ┃
                                       ┣━━━━━━━━━━━━━┓
                                       ┃             ┃
                                  ┌────────┐    ┌─────────┐
                                  │Question│    │  Round  │1───*┐
                                  └────────┘    └─────────┘     │
                                                               ┌────────┐
                                                               │Question│
                                                               └────────┘
┌────────────┐     ┌────────┐
│QuizSession │1────│  Quiz  │
└────────────┘     └────────┘
```

## Model Descriptions

### Question

The most basic unit of content. Represents a single question with its correct answer.

**Properties**:

- `stimulus`: The question text
- `feedback`: Feedback text shown after answering
- `order`: Position within parent (activity or round)
- `correctAnswer`: Boolean indicating the correct answer

### Round

A grouping mechanism for related questions.

**Properties**:

- `title`: The round title
- `order`: Position within parent activity
- `questions`: Array of Question objects

**Methods**:

- `highestQuestionOrder`: Returns highest question order number
- `getQuestionByOrder`: Retrieves a question by its order number

### Activity

A major section of the quiz containing questions and/or rounds.

**Properties**:

- `name`: Activity name/title
- `order`: Position within the quiz
- `questionsOrRounds`: Array of Question or Round objects

**Methods**:

- `highestQuestionOrRoundOrder`: Returns highest question/round order
- `getQuestionOrRoundByOrder`: Retrieves a question or round by order

### Quiz

The top-level container for all quiz content.

**Properties**:

- `name`: Quiz name/identifier
- `heading`: Quiz heading/title
- `activities`: Array of Activity objects

**Methods**:

- `highestActivityOrder`: Returns highest activity order
- `getActivityByOrder`: Retrieves an activity by order number

### QuizSession

Manages a user's interaction with a quiz, tracking answers and results.

**Properties**:

- `quiz`: Reference to Quiz object
- `answers`: Map of answers keyed by question IDs

**Methods**:

- `answerQuestion`: Records user's answer for a question
- `resetAnswers`: Clears all answers
- `getQuestionAnswer`: Retrieves user's answer for a question
- `isQuestionAnsweredCorrectly`: Checks if answer is correct
- `isActivityComplete`: Checks if all questions in activity are answered
- `getActivityResults`: Gets comprehensive results for an activity

## Technical Implementation Details

### Question Identification

Questions are uniquely identified by their position in the hierarchy:

- Direct questions: `${activityOrder}-${questionOrder}`
- Round questions: `${activityOrder}-${roundOrder}-${questionOrder}`

### Results Structure

Activity results are structured as:

```typescript
type QuestionResult = { questionOrder: number; correctAnswer: boolean }
type RoundResult = { roundOrder: number; results: QuestionResult[] }
type ActivityResults = (RoundResult | QuestionResult)[]
```

## Integration with Context System

The models are integrated with the React application through:

1. The `QuizContext` which holds a `QuizSession` instance
2. Reducers that operate on the quiz state
3. Selectors that derive UI state from the model state

## Best Practices for Model Extensions

When extending these models:

1. Maintain immutability in all operations
2. Keep business logic within the models
3. Use TypeScript for type safety
4. Follow the established hierarchy pattern
5. Add JSDoc comments for all public methods and properties
