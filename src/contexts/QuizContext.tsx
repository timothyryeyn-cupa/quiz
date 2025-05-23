import {
	createContext,
	ReactNode,
	useContext,
	useReducer,
	useState,
	useEffect,
	useMemo
} from 'react'
import { loadQuiz } from '../services/quizService'
import {
	Activity,
	Question,
	QuestionOrRound,
	QuizSession,
	Round
} from '../models'
import { ActivityResults } from '../models/QuizSession'
import { quizReducer, RESET_ORDER } from './QuizReducer'

type QuizContextType = {
	isLoading: boolean
	quizDetails: {
		name: string
		heading: string
		activityNameAndOrders: {
			name: string
			order: number
		}[]
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
	resetQuizSession: () => void
	answerCurrentQuestion: (answer: boolean) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const QuizProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [state, dispatch] = useReducer(quizReducer, {
		quizSession: null as any,
		currentActivityOrder: RESET_ORDER,
		currentQuestionOrRoundOrder: RESET_ORDER,
		currentRoundQuestionOrder: RESET_ORDER
	})

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

	const currentActivity = useMemo(() => {
		return state.quizSession?.quiz.getActivityByOrder(
			state.currentActivityOrder
		)
	}, [state.quizSession, state.currentActivityOrder])

	const currentQuestionOrRound = useMemo(() => {
		return currentActivity?.getQuestionOrRoundByOrder(
			state.currentQuestionOrRoundOrder
		)
	}, [currentActivity, state.currentQuestionOrRoundOrder])

	const currentRoundQuestion = useMemo(() => {
		const qor = currentQuestionOrRound
		if (!qor || !(qor instanceof Round)) {
			return
		}
		return qor.getQuestionByOrder(state.currentRoundQuestionOrder)
	}, [currentQuestionOrRound, state.currentRoundQuestionOrder])

	const isCurrentActivityComplete = useMemo(() => {
		if (!state.quizSession) return false
		return state.quizSession.isActivityComplete(state.currentActivityOrder)
	}, [state])

	const currentActivityResults = useMemo(() => {
		if (!state.quizSession) return []
		return state.quizSession.getActivityResults(state.currentActivityOrder)
	}, [state])

	const contextValue: QuizContextType = useMemo(() => {
		return {
			isLoading,
			quizDetails: {
				name: state.quizSession?.quiz.name,
				heading: state.quizSession?.quiz.heading,
				activityNameAndOrders: state.quizSession?.quiz.activities.map(
					(a: Activity) => {
						return { name: a.name, order: a.order }
					}
				)
			},
			currentActivity,
			currentQuestionOrRound,
			currentRoundQuestion,
			isCurrentActivityComplete,
			currentActivityResults,
			setActivityOrder: (order) =>
				dispatch({ type: 'SET_ACTIVITY_ORDER', order }),
			nextQuestionOrRound: () => dispatch({ type: 'NEXT_QUESTION_OR_ROUND' }),
			nextRoundQuestion: () => dispatch({ type: 'NEXT_ROUND_QUESTION' }),
			resetRoundQuestions: () => dispatch({ type: 'RESET_ROUND_QUESTIONS' }),
			resetQuizSession: () => dispatch({ type: 'RESET_QUIZ_SESSION' }),
			answerCurrentQuestion: (answer) =>
				dispatch({ type: 'ANSWER_QUESTION', answer })
		}
	}, [state])

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
