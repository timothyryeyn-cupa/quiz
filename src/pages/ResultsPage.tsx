import React from 'react'
import { Link } from 'react-router-dom'
import { useQuiz } from '../contexts/QuizContext'
import { Round } from '../models'

const QuestionResult: React.FC<{ order: number; isAnswerCorrect: boolean }> = ({
	order,
	isAnswerCorrect
}) => {
	return (
		<div
			className={`flex items-center p-3 mb-2 rounded-lg ${
				isAnswerCorrect
					? 'bg-green-100 text-green-800 border-green-200'
					: 'bg-red-100 text-red-800 border-red-200'
			}`}
		>
			<div
				className={`flex items-center justify-center w-8 h-8 mr-3 font-medium rounded-full ${
					isAnswerCorrect ? 'bg-green-200' : 'bg-red-200'
				}`}
			>
				{order}
			</div>
			<span className='font-medium'>
				{isAnswerCorrect ? 'Correct' : 'Incorrect'}
			</span>
		</div>
	)
}

const ResultsPage: React.FC = () => {
	const { currentActivity } = useQuiz()

	return (
		<div className='max-w-3xl px-4 py-8 mx-auto flex flex-col justify-center min-h-screen'>
			<h1 className='mb-6 text-3xl font-bold text-center text-gray-800'>
				Quiz Results
			</h1>

			<div className='p-6 mb-6 bg-white rounded-lg shadow-md'>
				{currentActivity.questionsOrRounds.map((qor) => {
					if (qor instanceof Round) {
						return (
							<div key={`round-${qor.order}`} className='mb-6 last:mb-0'>
								<h2 className='pb-2 mb-3 text-xl font-semibold text-gray-700 border-b'>
									Round {qor.order}
								</h2>
								<div className='pl-2'>
									{qor.questions.map((q) => (
										<QuestionResult
											key={`question-${q.order}`}
											order={q.order}
											isAnswerCorrect={q.isUserAnswerCorrect}
										/>
									))}
								</div>
							</div>
						)
					}
					return (
						<QuestionResult
							key={`question-${qor.order}`}
							order={qor.order}
							isAnswerCorrect={qor.isUserAnswerCorrect}
						/>
					)
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
	)
}

export default ResultsPage
