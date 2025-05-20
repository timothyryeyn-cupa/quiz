import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuiz } from '../contexts/QuizContext'

const HomePage: React.FC = () => {
	const { quizName, quizHeading, quizActivities, resetQuiz, isLoading } =
		useQuiz()

	useEffect(() => {
		resetQuiz()
	}, [])

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center'>
				<div className='relative flex flex-col items-center'>
					<div className='w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin'></div>
					<div className='mt-4 text-lg font-semibold text-indigo-700'>
						Loading quiz...
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex flex-col justify-center items-center'>
			<div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-indigo-700 mb-3'>
						{quizName}
					</h1>
					<p className='text-gray-600 text-lg'>{quizHeading}</p>
				</div>

				<div className='space-y-4'>
					{quizActivities?.map((a) => (
						<Link
							key={a.order}
							to={`/activity/${a.order}`}
							className='block w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center transition-colors duration-200 shadow-md hover:shadow-lg'
						>
							Start {a.name}
						</Link>
					))}
				</div>

				<div className='mt-8 text-center'>
					<p className='text-sm text-gray-500'>
						Select an activity to begin your quiz
					</p>
				</div>
			</div>
		</div>
	)
}

export default HomePage
