import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { HomePage, QuizPage, ResultsPage } from '../pages'

const AppRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='/quiz/:order' element={<QuizPage />} />
			<Route path='/results' element={<ResultsPage />} />
			<Route path='*' element={<HomePage />} />
		</Routes>
	)
}

export default AppRoutes
