import { Question } from './Question'

/**
 * Round class representing a group of questions in the quiz
 */
export class Round {
	roundTitle: string
	questions: Question[] = []
	order: number
	highestQuestionOrder: number

	constructor(data: any = {}) {
		this.roundTitle = data.round_title
		this.order = data.order
		this.highestQuestionOrder = 0

		data.questions.forEach((q: any) => {
			if (q.order > this.highestQuestionOrder) {
				this.highestQuestionOrder = q.order
			}

			this.questions.push(new Question(q))
		})
	}

	get allQuestionsAnswered(): boolean {
		return this.questions.every((q) => q.userAnswer != null)
	}

	clearQuestionUserAnswers() {
		this.questions.forEach((q) => q.clearUserAnswer())
	}

	/**
	 * Get a question by its order number within this round
	 * @param order The order number of the question to find
	 * @returns The Question with the specified order
	 * @throws Error if question not found
	 */
	getQuestionByOrder(order: number): Question {
		const question = this.questions.find((q) => q.order === order)
		if (!question) {
			throw new Error(`Question with order ${order} not found`)
		}
		return question
	}
}
