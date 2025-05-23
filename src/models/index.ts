/**
 * Models module - Contains all domain models for the quiz application
 *
 * This module exports the complete domain model structure:
 * - Question: Basic question unit with stimulus and answer
 * - Round: Group of related questions
 * - Activity: Major section containing questions and/or rounds
 * - Quiz: Top-level structure organizing all quiz content
 * - QuizSession: User's interaction with a quiz including answers and results
 *
 * The models form a hierarchy:
 * Quiz → Activities → Questions or Rounds → (for Rounds) Questions
 */

export * from './Question'
export * from './Round'
export * from './Activity'
export * from './Quiz'
export * from './QuizSession'
