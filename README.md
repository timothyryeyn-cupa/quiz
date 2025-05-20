# Quiz App

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [State Management](#state-management)
- [Routing](#routing)
- [Models](#models)
- [Customizing Quizzes](#customizing-quizzes)
- [Contributing](#contributing)
- [Available Scripts](#available-scripts)

## Overview

A React-based Quiz application built with the following technical stack and features:
- React v19 with functional components and hooks
- TypeScript for type safety
- Vite for development and bundling
- React Router v7 for navigation
- React Context API for state management
- TailwindCSS for styling
- Axios for API calls
- OOP-based model architecture
- Mock data support for development

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository to your local machine
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# OR
yarn
```

### Environment Setup

1. Create a `.env` file in the root directory of the project
2. Add the following environment variables to control app behavior:

```bash
# Set to 'true' to use mock data instead of API
VITE_USE_MOCK_DATA=true

# API URL for quiz data (only needed if not using mock data)
VITE_API_URL=http://your-api-endpoint.com/api/quiz
```

Notes:

- When `VITE_USE_MOCK_DATA` is set to 'true', the app will use the mock data defined in `src/services/quizService.ts`
- When set to 'false', the app will attempt to fetch quiz data from the URL specified in `VITE_API_URL`

### Running the Application

To start the development server:

```bash
npm run dev
# OR
yarn dev
```

This will start the Vite dev server, typically at http://localhost:5173/

## Project Structure

```
src/
├── assets/            # Static assets like images
├── components/        # Reusable UI components
├── contexts/          # React contexts including QuizContext
├── models/            # Data models (Quiz, Activity, Question, Round)
├── pages/             # Page components for routing
│   ├── ActivityPage.tsx     # Page for displaying quiz questions
│   ├── HomePage.tsx         # Landing page
│   └── ResultsPage.tsx      # Shows quiz results
├── routes/            # Routing configuration
├── services/          # API and data services
│   └── quizService.ts # Service for loading quiz data
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## State Management

The application uses React Context API for state management via `QuizContext`. This context provides:

- Current quiz data and progress
- Navigation functions between questions and activities
- Quiz state management (answers, progress, completion status)

Key hooks and state functions:

- `useQuiz()` - Access quiz context in components
- `setActivityOrder()` - Navigate to a specific activity
- `nextQuestionOrRound()` - Move to the next question or round
- `resetQuiz()` - Reset the quiz to its initial state

## Routing

The application uses React Router v7 with the following routes:

- `/` - Home page
- `/activity/:order` - Activity page showing questions (with dynamic parameter)
- `/results` - Results page after completing activities

## Models

The app is structured around object-oriented models:

- `Quiz` - Top-level container for all activities
- `Activity` - Contains questions or rounds
- `Question` - Individual question with stimulus and answer
- `Round` - Group of related questions

## Customizing Quizzes

Quiz data can be customized by:

1. Modifying the mock data in `quizService.ts`
2. Or connecting to a real API by setting the `VITE_API_URL` environment variable

The quiz structure follows this format:

```typescript
{
  name: "Quiz Name",
  heading: "Quiz Description",
  activities: [
    {
      activity_name: "Activity Name",
      order: 1,
      questions: [
        {
          is_correct: false,
          stimulus: "Question text with *highlighted error*",
          order: 1,
          feedback: "Corrected text with *correct solution*"
        },
        // More questions...
      ]
    },
    // More activities...
  ]
}
```

