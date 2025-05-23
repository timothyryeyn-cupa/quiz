import { Question } from './Question'

/**
 * Represents a group of related questions that form a round in the quiz.
 * A round contains multiple questions that are presented as a group.
 */
export class Round {
	/** The title of the round */
	readonly title: string
	/** The position/sequence number of this round within an activity */
	readonly order: number
	/** Collection of questions that belong to this round */
	readonly questions: Question[] = []

	/**
	 * Creates a new Round instance
	 * @param data - Raw round data from API or storage
	 */
	constructor(data: any = {}) {
		this.order = data.order
		this.title = data.round_title

		data.questions.forEach((q: any) => {
			this.questions.push(new Question(q))
		})
	}

	/**
	 * Gets the highest question order number in this round
	 * @returns The highest question order or 0 if the round has no questions
	 */
	get highestQuestionOrder(): number {
		if (this.questions.length === 0) {
			return 0
		}
		return Math.max(...this.questions.map((q) => q.order))
	}

	/**
	 * Gets a specific question from this round by its order number
	 * @param order - The order number of the question to retrieve
	 * @returns The matching question or undefined if not found
	 */
	getQuestionByOrder(order: number): Question | undefined {
		return this.questions.find((q) => q.order === order)
	}
}
