import { Question } from './Question'
import { Round } from './Round'

/**
 * Activity class representing a set of questions or rounds in the quiz
 */
export type QuestionOrRound = Question | Round

export class Activity {
	name: string
	order: number
	questionsOrRounds: QuestionOrRound[] = []
	highestQuestionOrRoundOrder: number

	constructor(data: any = {}) {
		this.name = data.activity_name
		this.order = data.order
		this.highestQuestionOrRoundOrder = 0

		data.questions.forEach((q: any) => {
			if (q.order > this.highestQuestionOrRoundOrder) {
				this.highestQuestionOrRoundOrder = q.order
			}

			this.questionsOrRounds.push(
				q.hasOwnProperty('round_title') ? new Round(q) : new Question(q)
			)
		})
	}

	/**
	 * Get a question or round by its order number
	 * @param order The order number of the question/round to find
	 * @returns The Question or Round with the specified order
	 * @throws Error if question/round not found
	 */
	getQuestionOrRoundByOrder(order: number): QuestionOrRound {
		const questionOrRound = this.questionsOrRounds.find(
			(qor) => qor.order === order
		)
		if (!questionOrRound) {
			throw new Error(`Question or Round with order ${order} not found`)
		}
		return questionOrRound
	}
}
