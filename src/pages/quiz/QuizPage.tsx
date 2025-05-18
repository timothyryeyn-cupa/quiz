import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './QuizPage.css'
import { useQuiz } from '../../context/QuizContext'
import { Question, Round } from '../../models'

const QuestionComponent: React.FC<{
	question: Question
	answerCb: () => void
}> = ({ question, answerCb }) => {
	return (
		<div>
			<div>Q{question.order}</div>
			<div>{question.stimulus}</div>
			<div>{question.form(answerCb)}</div>
		</div>
	)
}

const RoundComponent: React.FC<{
	round: Round
	moveToNextRound: () => void
}> = ({ round, moveToNextRound }) => {
	const [currentOrder, setCurrentOrder] = useState<number>(1)

	const currentQuestion = useMemo(() => {
		return round.getQuestionByOrder(currentOrder)
	}, [currentOrder])

	const moveToNextInOrder = () => {
		if (round.highestQuestionOrder === currentOrder) {
			moveToNextRound()
			setCurrentOrder(1)
			return
		}
		setCurrentOrder(currentOrder + 1)
	}

	return (
		<div>
			{round.roundTitle}
			<div>
				<QuestionComponent
					question={currentQuestion}
					answerCb={moveToNextInOrder}
				></QuestionComponent>
			</div>
		</div>
	)
}

const QuizPage: React.FC = () => {
	const { order: quizOrder } = useParams()
	const navigate = useNavigate()
	const { getActivityByOrder, setCurrentActivityOrder } = useQuiz()
	setCurrentActivityOrder(Number(quizOrder))
	const activity = getActivityByOrder(Number(quizOrder))

	const [currentOrder, setCurrentOrder] = useState<number>(1)
	const currentQuestionOrRound = useMemo(() => {
		return activity.getQuestionOrRoundByOrder(currentOrder)
	}, [currentOrder])

	const moveToNextInOrder = () => {
		if (activity.highestQuestionOrRoundOrder === currentOrder) {
			navigate('/results')
		}

		setCurrentOrder(currentOrder + 1)
	}

	return (
		<div className='quiz-page-container'>
			<h1>{activity.name}</h1>
			{currentQuestionOrRound instanceof Question ? (
				<QuestionComponent
					question={currentQuestionOrRound}
					answerCb={moveToNextInOrder}
				></QuestionComponent>
			) : (
				<RoundComponent
					round={currentQuestionOrRound}
					moveToNextRound={moveToNextInOrder}
				></RoundComponent>
			)}
		</div>
	)
}

export default QuizPage
