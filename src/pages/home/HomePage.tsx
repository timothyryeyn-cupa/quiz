import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'
import { useQuiz } from '../../context/QuizContext'

const HomePage: React.FC = () => {
	const { quizName, quizHeading, quizActivities } = useQuiz()

	return (
		<div className='homepage-container'>
			<h1>{quizName}</h1>
			<p>{quizHeading}</p>
			<div className='navigation-links'>
				{quizActivities?.map((qa) => (
					<Link key={qa.order} to={`/quiz/${qa.order}`} className='nav-link'>
						Start {qa.name}
					</Link>
				))}
			</div>
		</div>
	)
}

export default HomePage
