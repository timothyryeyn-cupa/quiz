import { QuizSession, Round } from '../models'

type QuizAction =
	| { type: 'SET_QUIZ_SESSION'; quizSession: QuizSession }
	| { type: 'SET_ACTIVITY_ORDER'; order: number }
	| { type: 'NEXT_QUESTION_OR_ROUND' }
	| { type: 'NEXT_ROUND_QUESTION' }
	| { type: 'RESET_ROUND_QUESTIONS' }
	| { type: 'RESET_ANSWERS' }
	| { type: 'ANSWER_QUESTION'; answer: boolean }

interface QuizState {
	quizSession: QuizSession
	currentActivityOrder: number
	currentQuestionOrRoundOrder: number
	currentRoundQuestionOrder: number
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
	switch (action.type) {
		case 'SET_QUIZ_SESSION':
			return {
				...state,
				quizSession: action.quizSession,
				currentActivityOrder: 1,
				currentQuestionOrRoundOrder: 1,
				currentRoundQuestionOrder: 1
			}
		case 'SET_ACTIVITY_ORDER':
			return {
				...state,
				currentActivityOrder: action.order,
				currentQuestionOrRoundOrder: 1,
				currentRoundQuestionOrder: 1
			}

		case 'NEXT_QUESTION_OR_ROUND': {
			const activity = state.quizSession.quiz.getActivityByOrder(
				state.currentActivityOrder
			)
			if (!activity) return state

			const nextOrder =
				state.currentQuestionOrRoundOrder >=
				activity.highestQuestionOrRoundOrder
					? 1
					: state.currentQuestionOrRoundOrder + 1

			return {
				...state,
				currentQuestionOrRoundOrder: nextOrder,
				currentRoundQuestionOrder: 1
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

			const nextOrder =
				state.currentRoundQuestionOrder >= qor.highestQuestionOrder
					? 1
					: state.currentRoundQuestionOrder + 1

			return {
				...state,
				currentRoundQuestionOrder: nextOrder
			}
		}

		case 'RESET_ROUND_QUESTIONS':
			return {
				...state,
				currentRoundQuestionOrder: 1
			}

		case 'RESET_ANSWERS':
			state.quizSession.resetAnswers()
			return {
				...state,
				currentActivityOrder: 0,
				currentQuestionOrRoundOrder: 0,
				currentRoundQuestionOrder: 0
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
