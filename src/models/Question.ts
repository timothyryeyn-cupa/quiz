/**
 * Represents a single question in the quiz system.
 * Contains the question text, feedback, and correct answer information.
 */
export class Question {
	/** The text of the question presented to the user */
	readonly stimulus: string
	/** Feedback text to show after answering the question */
	readonly feedback: string
	/** The position/sequence number of this question */
	readonly order: number
	/** Whether true or false is the correct answer */
	readonly correctAnswer: boolean

	/**
	 * Creates a new Question instance
	 * @param data - Raw question data from API or storage
	 */
	constructor(data: any = {}) {
		this.order = data.order
		this.stimulus = data.stimulus
		this.feedback = data.feedback
		this.correctAnswer = data.is_correct
	}
}
