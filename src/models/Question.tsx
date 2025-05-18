/**
 * Question class representing a single question in the quiz
 */
export class Question {
	stimulus: string
	feedback: string
	order: number
	userAnswer: boolean | null = null
	isCorrect: boolean

	constructor(data: any = {}) {
		this.stimulus = data.stimulus
		this.feedback = data.feedback
		this.order = data.order
		this.isCorrect = data.is_correct
	}

	/**
	 * Get appropriate feedback based on the user's answer
	 */
	get isUserAnswerCorrect() {
		return this.userAnswer != this.isCorrect
	}

	/**
	 * Record the user's answer to this question
	 * @param ua The user's boolean answer
	 */
	answer(ua: boolean) {
		this.userAnswer = ua
		console.log(this.userAnswer)
	}

	form(callbackFn: () => void) {
		const handleClick = (ans: boolean) => {
			callbackFn()
			this.answer(ans)
		}

		return (
			<div className='question-buttons'>
				<button className='question-button' onClick={() => handleClick(true)}>
					True
				</button>
				<button className='question-button' onClick={() => handleClick(false)}>
					False
				</button>
			</div>
		)
	}
}
