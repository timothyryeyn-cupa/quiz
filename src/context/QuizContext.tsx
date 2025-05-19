import {
	createContext,
	ReactNode,
	useContext,
	useReducer,
	useMemo,
	useCallback,
	useEffect
} from 'react'
import { loadQuiz } from '../services/quizService'
import { Activity, Question, QuestionOrRound, Round } from '../models'

const quiz = await loadQuiz()

type QuizState = {
	currentActivityOrder: number
	currentQuestionOrRoundOrder: number
	currentRoundQuestionOrder: number
}

type QuizAction =
	| { type: 'SET_ACTIVITY_ORDER'; order: number }
	| { type: 'SET_QUESTION_OR_ROUND_ORDER'; order: number }
	| { type: 'SET_ROUND_QUESTION_ORDER'; order: number }
	| { type: 'NEXT_QUESTION_OR_ROUND'; activity: Activity }
	| { type: 'NEXT_ROUND_QUESTION'; round: Round }
	| { type: 'RESET_ROUND_QUESTIONS' }

function quizReducer(state: QuizState, action: QuizAction): QuizState {
	switch (action.type) {
		case 'SET_ACTIVITY_ORDER':
			return { ...state, currentActivityOrder: action.order }
		case 'SET_QUESTION_OR_ROUND_ORDER':
			return { ...state, currentQuestionOrRoundOrder: action.order }
		case 'SET_ROUND_QUESTION_ORDER':
			return { ...state, currentRoundQuestionOrder: action.order }
		case 'NEXT_QUESTION_OR_ROUND':
			return {
				...state,
				currentQuestionOrRoundOrder:
					state.currentQuestionOrRoundOrder ===
					action.activity.highestQuestionOrRoundOrder
						? 1
						: state.currentQuestionOrRoundOrder + 1
			}
		case 'NEXT_ROUND_QUESTION':
			return {
				...state,
				currentRoundQuestionOrder:
					state.currentRoundQuestionOrder === action.round.highestQuestionOrder
						? 1
						: state.currentRoundQuestionOrder + 1
			}
		case 'RESET_ROUND_QUESTIONS':
			return { ...state, currentRoundQuestionOrder: 1 }
		default:
			return state
	}
}

type QuizContextType = {
	// Quiz data
	quizName: string
	quizHeading: string
	quizActivities: Activity[]

	// Computed values
	currentActivity: Activity
	currentQuestionOrRound: QuestionOrRound
	currentRoundQuestion: Question | null
	isActivityComplete: boolean

	// Actions
	setActivityOrder: (order: number) => void
	nextQuestionOrRound: () => void
	nextRoundQuestion: () => void
	resetRoundQuestions: () => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const QuizProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(quizReducer, {
		currentActivityOrder: 1,
		currentQuestionOrRoundOrder: 1,
		currentRoundQuestionOrder: 1
	})

	const currentActivity = useMemo(
		() => quiz.getActivityByOrder(state.currentActivityOrder),
		[state.currentActivityOrder]
	)

	const currentQuestionOrRound = useMemo(
		() =>
			currentActivity.getQuestionOrRoundByOrder(
				state.currentQuestionOrRoundOrder
			),
		[currentActivity, state.currentQuestionOrRoundOrder]
	)

	const currentRoundQuestion = useMemo(() => {
		if (currentQuestionOrRound instanceof Round) {
			return currentQuestionOrRound.getQuestionByOrder(
				state.currentRoundQuestionOrder
			)
		}
		return null
	}, [currentQuestionOrRound, state.currentRoundQuestionOrder])

	// Add this after the currentRoundQuestion useMemo

	const isActivityComplete = useMemo(() => {
		// Check if we're at the last question/round of the current activity
		const isLastQuestionOrRound =
			state.currentQuestionOrRoundOrder ===
			currentActivity.highestQuestionOrRoundOrder

		// If we're looking at a round, also check if it's the last question in the round
		if (currentQuestionOrRound instanceof Round) {
			const isLastRoundQuestion =
				state.currentRoundQuestionOrder ===
				currentQuestionOrRound.highestQuestionOrder
			return isLastQuestionOrRound && isLastRoundQuestion
		}

		return isLastQuestionOrRound
	}, [
		state.currentQuestionOrRoundOrder,
		state.currentRoundQuestionOrder,
		currentActivity,
		currentQuestionOrRound
	])

	// Action creators
	const setActivityOrder = useCallback((order: number) => {
		dispatch({ type: 'SET_ACTIVITY_ORDER', order })
	}, [])

	const nextQuestionOrRound = useCallback(() => {
		dispatch({ type: 'NEXT_QUESTION_OR_ROUND', activity: currentActivity })
	}, [currentActivity])

	const nextRoundQuestion = useCallback(() => {
		if (currentQuestionOrRound instanceof Round) {
			dispatch({ type: 'NEXT_ROUND_QUESTION', round: currentQuestionOrRound })
		}
	}, [currentQuestionOrRound])

	const resetRoundQuestions = useCallback(() => {
		dispatch({ type: 'RESET_ROUND_QUESTIONS' })
	}, [])

	const contextValue = useMemo(
		() => ({
			// Quiz data
			quizName: quiz.name,
			quizHeading: quiz.heading,
			quizActivities: quiz.activities,

			// Computed values
			currentActivity,
			currentQuestionOrRound,
			currentRoundQuestion,
			isActivityComplete,

			// Actions
			setActivityOrder,
			nextQuestionOrRound,
			nextRoundQuestion,
			resetRoundQuestions
		}),
		[
			currentActivity,
			currentQuestionOrRound,
			currentRoundQuestion,
			isActivityComplete,
			setActivityOrder,
			nextQuestionOrRound,
			nextRoundQuestion,
			resetRoundQuestions
		]
	)

	return (
		<QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
	)
}

export const useQuiz = () => {
	const context = useContext(QuizContext)
	if (context === undefined) {
		throw new Error('useQuiz must be used within a QuizProvider')
	}
	return context
}
