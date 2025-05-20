import {
	createContext,
	ReactNode,
	useContext,
	useReducer,
	useMemo,
	useCallback,
	useState
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
	| { type: 'NEXT_QUESTION_OR_ROUND'; highestQuestionOrRoundOrder: number }
	| { type: 'NEXT_ROUND_QUESTION'; highestRoundQuestionOrder: number }
	| { type: 'RESET_QUIZ' }
	| { type: 'RESET_ROUND_QUESTIONS' }

function quizReducer(state: QuizState, action: QuizAction): QuizState {
	switch (action.type) {
		case 'SET_ACTIVITY_ORDER':
			return { ...state, currentActivityOrder: action.order }
		case 'NEXT_QUESTION_OR_ROUND':
			return {
				...state,
				currentQuestionOrRoundOrder:
					state.currentQuestionOrRoundOrder ===
					action.highestQuestionOrRoundOrder
						? 1
						: state.currentQuestionOrRoundOrder + 1
			}
		case 'NEXT_ROUND_QUESTION':
			return {
				...state,
				currentRoundQuestionOrder:
					state.currentRoundQuestionOrder === action.highestRoundQuestionOrder
						? 1
						: state.currentRoundQuestionOrder + 1
			}
		case 'RESET_QUIZ':
			return {
				currentActivityOrder: 1,
				currentQuestionOrRoundOrder: 1,
				currentRoundQuestionOrder: 1
			}
		case 'RESET_ROUND_QUESTIONS':
			return { ...state, currentRoundQuestionOrder: 1 }
		default:
			return state
	}
}

type QuizContextType = {
	isLoading: boolean

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
	resetQuiz: () => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const QuizProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false)

	const [state, dispatch] = useReducer(quizReducer, {
		currentActivityOrder: 1,
		currentQuestionOrRoundOrder: 1,
		currentRoundQuestionOrder: 1
	})

	// Computed Activity, QuestionOrRound and RoundQuestion based on their order in state
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

	const isActivityComplete = useMemo(() => {
		return currentActivity.allQuestionsOrRoundsAnswered
	}, [state])

	// Action creators
	const setActivityOrder = useCallback((order: number) => {
		dispatch({ type: 'SET_ACTIVITY_ORDER', order })
	}, [])

	const nextQuestionOrRound = useCallback(() => {
		dispatch({
			type: 'NEXT_QUESTION_OR_ROUND',
			highestQuestionOrRoundOrder: currentActivity.highestQuestionOrRoundOrder
		})
	}, [currentActivity])

	const nextRoundQuestion = useCallback(() => {
		if (currentQuestionOrRound instanceof Round) {
			dispatch({
				type: 'NEXT_ROUND_QUESTION',
				highestRoundQuestionOrder: currentQuestionOrRound.highestQuestionOrder
			})
		}
	}, [currentQuestionOrRound])

	const resetRoundQuestions = useCallback(() => {
		dispatch({ type: 'RESET_ROUND_QUESTIONS' })
	}, [])

	const resetQuiz = useCallback(() => {
		quiz.activities.forEach((a) => a.clearQuestionUserAnswers())
		dispatch({ type: 'RESET_QUIZ' })
	}, [])

	const contextValue = useMemo(
		() => ({
			isLoading,

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
			resetRoundQuestions,
			resetQuiz
		}),
		[
			currentActivity,
			currentQuestionOrRound,
			currentRoundQuestion,
			isActivityComplete
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
