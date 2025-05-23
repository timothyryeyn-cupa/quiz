import { Question } from './Question'
import { Round } from './Round'

/** 
 * Union type representing either a Question or a Round
 */
export type QuestionOrRound = Question | Round

/**
 * Represents a group of questions and/or rounds that form an activity within the quiz.
 * An activity is a major section of the quiz that contains one or more questions or rounds.
 */
export class Activity {
	/** The name/title of the activity */
	readonly name: string
	/** The position/sequence number of this activity within the quiz */
	readonly order: number
	/** Collection of questions and/or rounds that belong to this activity */
	readonly questionsOrRounds: QuestionOrRound[] = []

	/**
	 * Creates a new Activity instance
	 * @param data - Raw activity data from API or storage
	 */
	constructor(data: any = {}) {
		this.order = data.order
		this.name = data.activity_name

		data.questions.forEach((q: any) => {
			this.questionsOrRounds.push(
				q.hasOwnProperty('round_title') ? new Round(q) : new Question(q)
			)
		})
	}

	/**
	 * Gets the highest order number among all questions and rounds in this activity
	 * @returns The highest order number or 0 if the activity has no questions/rounds
	 */
	get highestQuestionOrRoundOrder(): number {
		if (this.questionsOrRounds.length === 0) {
			return 0
		}
		return Math.max(...this.questionsOrRounds.map((qor) => qor.order))
	}

	/**
	 * Gets a specific question or round from this activity by its order number
	 * @param order - The order number of the question or round to retrieve
	 * @returns The matching question or round, or undefined if not found
	 */
	getQuestionOrRoundByOrder(order: number): QuestionOrRound | undefined {
		return this.questionsOrRounds.find((qor) => qor.order === order)
	}
}
