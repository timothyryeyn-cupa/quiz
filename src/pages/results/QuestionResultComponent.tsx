import React from 'react'

const QuestionResultComponent: React.FC<{
	order: number
	isAnswerCorrect: boolean
}> = ({ order, isAnswerCorrect }) => {
	return (
		<div
			className={`flex items-center p-3 mb-2 rounded-lg ${
				isAnswerCorrect
					? 'bg-green-100 text-green-800 border-green-200'
					: 'bg-red-100 text-red-800 border-red-200'
			}`}
		>
			<div
				className={`flex items-center justify-center w-8 h-8 mr-3 font-medium rounded-full ${
					isAnswerCorrect ? 'bg-green-200' : 'bg-red-200'
				}`}
			>
				{order}
			</div>
			<span className='font-medium'>
				{isAnswerCorrect ? 'Correct' : 'Incorrect'}
			</span>
		</div>
	)
}

export default QuestionResultComponent
