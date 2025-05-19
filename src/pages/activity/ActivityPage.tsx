import React, { FormEvent, useEffect } from 'react'
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
	const answerHandler = (ans: boolean) => {
		if (currentQuestionOrRound instanceof Round) {
			currentRoundQuestion?.setUserAnswer(ans)
			if (
				currentQuestionOrRound.highestQuestionOrder ===
				currentRoundQuestion?.order
			) {
				nextQuestionOrRound()
				resetRoundQuestions()
				return
			}
			nextRoundQuestion()
		} else {
			currentQuestionOrRound.setUserAnswer(ans)
			nextQuestionOrRound()
		}
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
						answerHandler={answerHandler}
					/>
				)
			) : (
				// If it's a question, render the QuestionComponent
				<QuestionComponent
					order={currentQuestionOrRound.order}
					stimulus={currentQuestionOrRound.stimulus}
					answerHandler={answerHandler}
				/>
			)}
		</div>
	)
}

export default ActivityPage

const QuestionComponent: React.FC<{
	order: number
	stimulus: string
	answerHandler: (ans: boolean) => void
}> = ({ order, stimulus, answerHandler }) => {
	return (
		<div>
			<div>{`Q${order}. ${stimulus}`}</div>
			<div>
				<button className='question-button' onClick={() => answerHandler(true)}>
					True
				</button>
				<button
					className='question-button'
					value='false'
					onClick={() => answerHandler(true)}
				>
					False
				</button>
			</div>
		</div>
	)
}

const RoundComponent: React.FC<{
	round: Round
	roundQuestion: Question
	answerHandler: (ans: boolean) => void
}> = ({ round, roundQuestion, answerHandler }) => {
	return (
		<div>
			{round.roundTitle}
			<div>
				<QuestionComponent
					order={roundQuestion.order}
					stimulus={roundQuestion.stimulus}
					answerHandler={answerHandler}
				></QuestionComponent>
			</div>
		</div>
	)
}
