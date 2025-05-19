import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'
import { useQuiz } from '../../context/QuizContext'
import LoadingSpinner from '../../components/loading spinner/LoadingSpinner'

const HomePage: React.FC = () => {
	const { quizName, quizHeading, quizActivities, resetQuiz, isLoading } =
		useQuiz()
	resetQuiz()

	return (
		<div className='homepage-container'>
			<h1>{quizName}</h1>
			<p>{quizHeading}</p>
			<div className='navigation-links'>
				{quizActivities?.map((qa) => (
					<Link
						key={qa.order}
						to={`/activity/${qa.order}`}
						className='nav-link'
					>
						Start {qa.name}
					</Link>
				))}
			</div>
		</div>
	)
}

export default HomePage
