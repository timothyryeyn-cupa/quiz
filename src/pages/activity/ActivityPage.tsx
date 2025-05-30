import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuiz } from '../../contexts/QuizContext'
import { Round } from '../../models'
import QuestionComponent from './QuestionComponent'

const ActivityPage: React.FC = () => {
	const { activityOrder } = useParams()
	const [showRoundIntro, setShowRoundIntro] = useState(false)
	const navigate = useNavigate()

	const {
		currentActivity,
		currentQuestionOrRound,
		currentRoundQuestion,
		isCurrentActivityComplete,
		nextQuestionOrRound,
		nextRoundQuestion,
		resetRoundQuestions,
		setActivityOrder,
		answerCurrentQuestion
	} = useQuiz()

	useEffect(() => {
		if (activityOrder) {
			setActivityOrder(Number(activityOrder))
		}
	}, [currentActivity])

	useEffect(() => {
		if (isCurrentActivityComplete) {
			navigate('/results')
		}
	}, [isCurrentActivityComplete])

	useEffect(() => {
		if (
			currentQuestionOrRound instanceof Round &&
			currentRoundQuestion?.order === 1
		) {
			setShowRoundIntro(true)
			const timer = setTimeout(() => {
				setShowRoundIntro(false)
			}, 1000)
			return () => clearTimeout(timer)
		}
	}, [currentQuestionOrRound])

	const answerHandler = (ans: boolean) => {
		answerCurrentQuestion(ans)

		if (currentQuestionOrRound instanceof Round) {
			if (
				currentQuestionOrRound.highestQuestionOrder ===
				currentRoundQuestion?.order
			) {
				nextQuestionOrRound()
				resetRoundQuestions()
				return
			}
			nextRoundQuestion()
		} else {
			nextQuestionOrRound()
		}
	}
	if (!currentActivity) {
		return (
			<div className='min-h-screen bg-gradient-to-br justify-center from-blue-50 to-indigo-100 p-6 flex flex-col items-center'>
				<div className='w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 transition-all text-center'>
					<svg className="w-16 h-16 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<h2 className='text-2xl font-bold text-indigo-700 mb-3'>Activity Not Found</h2>
					<p className='text-gray-600 mb-6'>The requested activity does not exist or could not be loaded.</p>
					<button 
						onClick={() => navigate('/')} 
						className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors'
					>
						Return to Home
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br justify-center from-blue-50 to-indigo-100 p-6 flex flex-col items-center'>
			<div className='w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 transition-all'>
				<div className='text-center mb-8'>
					<h2 className='text-3xl font-bold text-indigo-700 mb-2'>
						{currentActivity.name}
					</h2>
					<div className='w-20 h-1 bg-indigo-500 mx-auto rounded-full'></div>
				</div>

				{currentQuestionOrRound instanceof Round
					? currentRoundQuestion && (
							<>
								{showRoundIntro ? (
									// Round intro screen
									<div className='flex flex-col items-center justify-center py-16 animate-fade-in'>
										<h3 className='text-2xl font-bold text-indigo-700 mb-4'>
											{currentQuestionOrRound.title}
										</h3>
										<div className='text-lg text-gray-600'>Get ready!</div>
									</div>
								) : (
									// Question screen
									currentRoundQuestion && (
										<div className='mb-8 animate-fade-in'>
											<h3 className='text-xl font-semibold text-gray-800 mb-6 p-3 bg-indigo-50 rounded-lg text-center'>
												{currentQuestionOrRound.title}
											</h3>
											<div className='bg-white rounded-lg p-4'>
												<QuestionComponent
													order={currentRoundQuestion.order}
													stimulus={currentRoundQuestion.stimulus}
													answerHandler={answerHandler}
												/>
											</div>
										</div>
									)
								)}
							</>
					  )
					: currentQuestionOrRound && (
							<QuestionComponent
								order={currentQuestionOrRound.order}
								stimulus={currentQuestionOrRound.stimulus}
								answerHandler={answerHandler}
							/>
					  )}
			</div>
		</div>
	)
}

export default ActivityPage
