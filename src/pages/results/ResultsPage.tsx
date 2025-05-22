import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuiz } from '../../contexts/QuizContext'
import QuestionResultComponent from './QuestionResultComponent'

const ResultsPage: React.FC = () => {
	const navigate = useNavigate()
	const { isCurrentActivityComplete, currentActivityResults } = useQuiz()

	useEffect(() => {
		if (!isCurrentActivityComplete) {
			navigate('/')
		}
	}, [])

	return (
		<div className='min-h-screen bg-gradient-to-br justify-center from-blue-50 to-indigo-100 p-6 flex flex-col items-center'>
			<div className='px-4 py-8 flex flex-col justify-center min-w-md'>
				<h1 className='mb-6 text-3xl font-bold text-center text-gray-800'>
					Quiz Results
				</h1>

				<div className='p-6 mb-6 bg-white rounded-lg shadow-md'>
					{currentActivityResults.map((result) => {
						if ('results' in result) {
							// This is a RoundResult
							return (
								<div
									key={`round-${result.roundOrder}`}
									className='mb-6 last:mb-0'
								>
									<h2 className='pb-2 mb-3 text-xl font-semibold text-gray-700 border-b'>
										Round {result.roundOrder}
									</h2>
									<div className='pl-2'>
										{result.results.map((qResult) => (
											<QuestionResultComponent
												key={`question-${qResult.questionOrder}`}
												order={qResult.questionOrder}
												isAnswerCorrect={qResult.correctAnswer}
											/>
										))}
									</div>
								</div>
							)
						} else {
							// This is a QuestionResult
							return (
								<QuestionResultComponent
									key={`question-${result.questionOrder}`}
									order={result.questionOrder}
									isAnswerCorrect={result.correctAnswer}
								/>
							)
						}
					})}
				</div>

				<div className='text-center'>
					<Link
						to='/'
						className='inline-block px-5 py-2.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300'
					>
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	)
}

export default ResultsPage
