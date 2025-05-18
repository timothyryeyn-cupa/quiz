import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { loadQuiz } from '../services/quizService'
import { Activity } from '../models'

const quiz = await loadQuiz()

type QuizContextType = {
	quizName: string
	quizHeading: string
	quizActivities: Activity[]
	getActivityByOrder: (order: number) => Activity
	currentActivityOrder: number | undefined
	setCurrentActivityOrder: (order: number) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const QuizProvider = ({ children }: { children: ReactNode }) => {
	const [currentActivityOrder, setCurrentActivityOrder] = useState<number>()

	const value = useMemo(() => {
		return {
			quizName: quiz.name,
			quizHeading: quiz.heading,
			quizActivities: quiz.activities,
			getActivityByOrder: (order: number) => quiz.getActivityByOrder(order),
			currentActivityOrder,
			setCurrentActivityOrder
		}
	}, [currentActivityOrder])

	return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export const useQuiz = () => {
	const context = useContext(QuizContext)
	if (context === undefined) {
		throw new Error('useQuiz must be used within a QuizProvider')
	}
	return context
}
