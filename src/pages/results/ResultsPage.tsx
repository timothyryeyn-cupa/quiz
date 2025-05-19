import React from 'react'
import { Link } from 'react-router-dom'
import './ResultsPage.css'
import { useQuiz } from '../../context/QuizContext'
import { Round } from '../../models'

const QuestionResult: React.FC<{ order: number; isAnswerCorrect: boolean }> = ({
	order,
	isAnswerCorrect
}) => {
	return <div>{`Q${order} ${isAnswerCorrect}`}</div>
}

const ResultsPage: React.FC = () => {
	const { currentActivity } = useQuiz()

	return (
		<div className='results-page-container'>
			<h1>Quiz Results</h1>
			<div>
				{currentActivity.questionsOrRounds.map((qor) => {
					if (qor instanceof Round) {
						return (
							<div>
								Round {qor.order}
								{qor.questions.map((q) => (
									<QuestionResult
										order={q.order}
										isAnswerCorrect={q.isUserAnswerCorrect}
									/>
								))}
							</div>
						)
					}
					return (
						<QuestionResult
							order={qor.order}
							isAnswerCorrect={qor.isUserAnswerCorrect}
						/>
					)
				})}
			</div>
			<p>Here you will see your quiz results</p>
			<div className='navigation-links'>
				<Link to='/' className='nav-link'>
					Back to Home
				</Link>
			</div>
		</div>
	)
}

export default ResultsPage
