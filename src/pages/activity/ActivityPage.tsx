import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ActivityPage.css'
import { useQuiz } from '../../context/QuizContext'
import { Question, Round } from '../../models'

const ActivityPage: React.FC = () => {
	const { order: activityOrderParam } = useParams()
	const navigate = useNavigate()

	const {
		currentActivity,
		currentQuestionOrRound,
		currentRoundQuestion,
		isActivityComplete,
		nextQuestionOrRound,
		nextRoundQuestion,
		resetRoundQuestions,
		setActivityOrder
	} = useQuiz()

	// Initialize with correct activity order from URL
	useEffect(() => {
		if (activityOrderParam) {
			setActivityOrder(Number(activityOrderParam))
		}
	}, [activityOrderParam, setActivityOrder])

	useEffect(() => {
		if (isActivityComplete) {
			navigate('/results')
		}
	}, [isActivityComplete])

	// Handle moving to next question/round
	const handleNextQuestion = () => {
		if (currentQuestionOrRound instanceof Round) {
			nextRoundQuestion()
		} else {
			nextQuestionOrRound()
		}
	}

	// Handle moving to next round
	const handleNextRound = () => {
		resetRoundQuestions()
		nextQuestionOrRound()
	}

	// Go back to home
	const navigateToHome = () => {
		navigate('/')
	}

	return (
		<div className='quiz-page-container'>
			<h1>{currentActivity.name}</h1>

			{currentQuestionOrRound instanceof Round ? (
				// If it's a round, render the RoundComponent
				currentRoundQuestion && (
					<RoundComponent
						round={currentQuestionOrRound}
						roundQuestion={currentRoundQuestion}
						moveToNextRound={handleNextRound}
						moveToNextRoundQuestion={handleNextQuestion}
					/>
				)
			) : (
				// If it's a question, render the QuestionComponent
				<QuestionComponent
					question={currentQuestionOrRound as Question}
					answerCb={handleNextQuestion}
				/>
			)}

			<div className='navigation'>
				<button onClick={navigateToHome} className='nav-button'>
					Back to Home
				</button>
			</div>
		</div>
	)
}

export default ActivityPage

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
	roundQuestion: Question
	moveToNextRound: () => void
	moveToNextRoundQuestion: () => void
}> = ({ round, roundQuestion, moveToNextRound, moveToNextRoundQuestion }) => {
	const moveToNextInOrder = () => {
		if (round.highestQuestionOrder === roundQuestion.order) {
			moveToNextRound()
		}
		moveToNextRoundQuestion()
	}
	console.log('round')

	return (
		<div>
			{round.roundTitle}
			<div>
				<QuestionComponent
					question={roundQuestion}
					answerCb={moveToNextInOrder}
				></QuestionComponent>
			</div>
		</div>
	)
}
