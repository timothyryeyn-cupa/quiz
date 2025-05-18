import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import './App.css'
import { QuizProvider } from './context/QuizContext'

function App() {
	return (
		<BrowserRouter>
			<div className='app-container'>
				<QuizProvider>
					<AppRoutes />
				</QuizProvider>
			</div>
		</BrowserRouter>
	)
}

export default App

