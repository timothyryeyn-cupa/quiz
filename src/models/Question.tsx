import { ReactElement } from 'react'

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
	get isUserAnswerCorrect(): boolean {
		return this.userAnswer == this.isCorrect
	}

	/**
	 * Record the user's answer to this question
	 * @param ua The user's boolean answer
	 */
	setUserAnswer(ua: boolean) {
		this.userAnswer = ua
	}

	clearUserAnswer() {
		this.userAnswer = null
	}
}
