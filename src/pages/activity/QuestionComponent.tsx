import React from 'react'

const QuestionComponent: React.FC<{
	order: number
	stimulus: string
	answerHandler: (ans: boolean) => void
}> = ({ order, stimulus, answerHandler }) => {
	const formatStimulus = (text: string) => {
		const asteriskRegex = /\*(.*?)\*/
		const match = asteriskRegex.exec(text)
		if (match) {
			const beforeText = text.substring(0, match.index)
			const boldText = match[1]
			const afterText = text.substring(match.index + match[0].length)

			return (
				<>
					{beforeText}
					<span className='font-bold'>{boldText}</span>
					{afterText}
				</>
			)
		}
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

export default QuestionComponent
