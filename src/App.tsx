import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { QuizProvider } from './contexts/QuizContext'

function App() {
	return (
		<BrowserRouter>
			<div className=''>
				<QuizProvider>
					<AppRoutes />
				</QuizProvider>
			</div>
		</BrowserRouter>
	)
}

export default App

