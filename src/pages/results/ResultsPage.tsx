import React from 'react'
import { Link } from 'react-router-dom'
import './ResultsPage.css'

const ResultsPage: React.FC = () => {
	// const { getActivityByOrder } = useQuiz()
	// const activity = getActivityByOrder(Number(quizOrder))

	return (
		<div className='results-page-container'>
			<h1>Quiz Results</h1>
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
