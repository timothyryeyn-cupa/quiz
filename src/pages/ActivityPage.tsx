import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuiz } from '../contexts/QuizContext'
import { Round } from '../models'

const ActivityPage: React.FC = () => {
	const { order: activityOrderParam } = useParams()
	const [showRoundIntro, setShowRoundIntro] = useState(false)
	const navigate = useNavigate()

	const {
		currentActivity: { name: activityName },
		currentQuestionOrRound,
		currentRoundQuestion,
		isActivityComplete,
		nextQuestionOrRound,
		nextRoundQuestion,
		resetRoundQuestions,
		setActivityOrder
	} = useQuiz()

	// Initialize with correct activity order from URL
	useEffect(() => {
		if (activityOrderParam) {
			setActivityOrder(Number(activityOrderParam))
		}
	}, [activityOrderParam])

	useEffect(() => {
		if (isActivityComplete) {
			navigate('/results')
		}
	}, [isActivityComplete])

	useEffect(() => {
		if (
			currentQuestionOrRound instanceof Round &&
			currentRoundQuestion?.order === 1
		) {
			setShowRoundIntro(true)

			const timer = setTimeout(() => {
				setShowRoundIntro(false)
			}, 2000)

			// Clean up timer on unmount
			return () => clearTimeout(timer)
		}
	}, [currentQuestionOrRound])

	// Handle moving to next question/round
	const answerHandler = (ans: boolean) => {
		if (currentQuestionOrRound instanceof Round) {
			currentRoundQuestion?.setUserAnswer(ans)
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
			currentQuestionOrRound.setUserAnswer(ans)
			nextQuestionOrRound()
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br justify-center from-blue-50 to-indigo-100 p-6 flex flex-col items-center'>
			<div className='w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 transition-all'>
				<div className='text-center mb-8'>
					<h2 className='text-3xl font-bold text-indigo-700 mb-2'>
						{activityName}
					</h2>
					<div className='w-20 h-1 bg-indigo-500 mx-auto rounded-full'></div>
				</div>

				{currentQuestionOrRound instanceof Round ? (
					currentRoundQuestion && (
						<>
							{showRoundIntro ? (
								// Round intro screen
								<div className='flex flex-col items-center justify-center py-16 animate-fade-in'>
									<h3 className='text-2xl font-bold text-indigo-700 mb-4'>
										{currentQuestionOrRound.roundTitle}
									</h3>
									<div className='text-lg text-gray-600'>Get ready!</div>
								</div>
							) : (
								// Question screen
								currentRoundQuestion && (
									<div className='mb-8 animate-fade-in'>
										<h3 className='text-xl font-semibold text-gray-800 mb-6 p-3 bg-indigo-50 rounded-lg text-center'>
											{currentQuestionOrRound.roundTitle}
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
				) : (
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

const QuestionComponent: React.FC<{
	order: number
	stimulus: string
	answerHandler: (ans: boolean) => void
}> = ({ order, stimulus, answerHandler }) => {
	// Simple function to format a single asterisk-wrapped section as bold
	const formatStimulus = (text: string) => {
		const asteriskRegex = /\*(.*?)\*/
		const match = asteriskRegex.exec(text)

		if (match) {
			const beforeText = text.substring(0, match.index)
			const boldText = match[1] // The text between asterisks
			const afterText = text.substring(match.index + match[0].length)

			return (
				<>
					{beforeText}
					<span className='font-bold'>{boldText}</span>
					{afterText}
				</>
			)
		}

		// If no asterisks, return the text as is
		return text
	}

	return (
		<div className='flex flex-col'>
			<div className='mb-6 text-lg'>
				<span className='font-bold text-indigo-600'>Q{order}.</span>{' '}
				{formatStimulus(stimulus)}
			</div>
			<div className='flex gap-4 justify-center mt-4'>
				<button
					className='py-3 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-1'
					onClick={() => answerHandler(true)}
				>
					True
				</button>
				<button
					className='py-3 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-1'
					onClick={() => answerHandler(false)}
				>
					False
				</button>
			</div>
		</div>
	)
}

export default ActivityPage
