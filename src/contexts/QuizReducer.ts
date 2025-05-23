import { QuizSession, Round } from '../models'

type QuizAction =
	| { type: 'SET_QUIZ_SESSION'; quizSession: QuizSession }
	| { type: 'SET_ACTIVITY_ORDER'; order: number }
	| { type: 'NEXT_QUESTION_OR_ROUND' }
	| { type: 'NEXT_ROUND_QUESTION' }
	| { type: 'RESET_ROUND_QUESTIONS' }
	| { type: 'RESET_QUIZ_SESSION' }
	| { type: 'ANSWER_QUESTION'; answer: boolean }

interface QuizState {
	quizSession: QuizSession
	currentActivityOrder: number
	currentQuestionOrRoundOrder: number
	currentRoundQuestionOrder: number
}

export const RESET_ORDER = 0
const INITIAL_ORDER = 1

function getNextQuestionOrRoundOrder(
	currentOrder: number,
	highestOrder: number
): number {
	return currentOrder >= highestOrder ? INITIAL_ORDER : currentOrder + 1
}

function getNextRoundQuestionOrder(
	currentRoundQuestionOrder: number,
	highestQuestionOrder: number
): number {
	return currentRoundQuestionOrder >= highestQuestionOrder
		? INITIAL_ORDER
		: currentRoundQuestionOrder + 1
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
	switch (action.type) {
		case 'SET_QUIZ_SESSION':
			return {
				...state,
				quizSession: action.quizSession,
				currentActivityOrder: INITIAL_ORDER,
				currentQuestionOrRoundOrder: INITIAL_ORDER,
				currentRoundQuestionOrder: INITIAL_ORDER
			}
		case 'SET_ACTIVITY_ORDER':
			return {
				...state,
				currentActivityOrder: action.order,
				currentQuestionOrRoundOrder: INITIAL_ORDER,
				currentRoundQuestionOrder: INITIAL_ORDER
			}

		case 'NEXT_QUESTION_OR_ROUND': {
			const activity = state.quizSession.quiz.getActivityByOrder(
				state.currentActivityOrder
			)
			if (!activity) return state

			const nextOrder = getNextQuestionOrRoundOrder(
				state.currentQuestionOrRoundOrder,
				activity.highestQuestionOrRoundOrder
			)

			return {
				...state,
				currentQuestionOrRoundOrder: nextOrder,
				currentRoundQuestionOrder: INITIAL_ORDER
			}
		}

		case 'NEXT_ROUND_QUESTION': {
			const activity = state.quizSession.quiz.getActivityByOrder(
				state.currentActivityOrder
			)
			if (!activity) return state

			const qor = activity.getQuestionOrRoundByOrder(
				state.currentQuestionOrRoundOrder
			)
			if (!qor || !(qor instanceof Round)) return state

			const nextOrder = getNextRoundQuestionOrder(
				state.currentRoundQuestionOrder,
				qor.highestQuestionOrder
			)

			return {
				...state,
				currentRoundQuestionOrder: nextOrder
			}
		}

		case 'RESET_ROUND_QUESTIONS':
			return {
				...state,
				currentRoundQuestionOrder: INITIAL_ORDER
			}

		case 'RESET_QUIZ_SESSION': {
			state.quizSession.resetAnswers()
			return {
				...state,
				currentActivityOrder: RESET_ORDER,
				currentQuestionOrRoundOrder: RESET_ORDER,
				currentRoundQuestionOrder: RESET_ORDER
			}
		}

		case 'ANSWER_QUESTION': {
			const {
				currentActivityOrder,
				currentQuestionOrRoundOrder,
				currentRoundQuestionOrder
			} = state
			const activity =
				state.quizSession.quiz.getActivityByOrder(currentActivityOrder)

			if (activity) {
				const qor = activity.getQuestionOrRoundByOrder(
					currentQuestionOrRoundOrder
				)
				if (qor) {
					state.quizSession.answerQuestion(
						currentActivityOrder,
						currentQuestionOrRoundOrder,
						qor instanceof Round ? currentRoundQuestionOrder : undefined,
						action.answer
					)
				}
			}
			return { ...state }
		}

		default:
			return state
	}
}
