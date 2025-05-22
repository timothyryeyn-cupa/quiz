import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuiz } from '../../contexts/QuizContext'
import Loading from '../../components/Loading'

const HomePage: React.FC = () => {
	const { quizDetails, isLoading, resetAnswers } = useQuiz()

	useEffect(() => {
		if (!isLoading) {
			resetAnswers()
		}
	}, [])

	if (isLoading) {
		return <Loading></Loading>
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex flex-col justify-center items-center'>
			<div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-indigo-700 mb-3'>
						{quizDetails.name}
					</h1>
					<p className='text-gray-600 text-lg'>{quizDetails.heading}</p>
				</div>

				<div className='space-y-4'>
					{quizDetails.activityNameAndOrders?.map((a) => (
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
