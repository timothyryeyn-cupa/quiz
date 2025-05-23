import { Quiz, Question, Round } from './index'

/**
 * Unique identifier for a question, composed of activity, question, and optional round orders
 * Format: "activityOrder-questionOrder" or "activityOrder-roundOrder-questionOrder"
 */
type QuestionId = `${number}-${number}-${number}` | `${number}-${number}`

/**
 * Represents the result of answering a single question
 */
type QuestionResult = { questionOrder: number; correctAnswer: boolean }

/**
 * Represents the results for a round containing multiple questions
 */
type RoundResult = { roundOrder: number; results: QuestionResult[] }

/**
 * Collection of results for an activity, containing results for questions and/or rounds
 */
export type ActivityResults = (RoundResult | QuestionResult)[]

/**
 * Manages a user's session for a quiz, tracking answers and providing results.
 * This class links the static quiz structure with the dynamic user interaction.
 */
export class QuizSession {
	/** The quiz structure this session is based on */
	readonly quiz: Quiz
	/** Map of user's answers keyed by question IDs */
	readonly answers: Map<QuestionId, boolean> = new Map()

	/**
	 * Creates a new QuizSession instance
	 * @param quiz - The quiz structure to base this session on
	 */
	constructor(quiz: Quiz) {
		this.quiz = quiz
	}

	/**
	 * Generates a unique identifier for a question based on its location in the quiz
	 * @param activityOrder - The order of the activity containing the question
	 * @param questionOrder - The order of the question within its activity or round
	 * @param roundOrder - Optional order of the round if the question belongs to one
	 * @returns A unique string identifier for the question
	 */
	private getQuestionId(
		activityOrder: number,
		questionOrder: number,
		roundOrder?: number
	): QuestionId {
		return roundOrder
			? `${activityOrder}-${roundOrder}-${questionOrder}`
			: `${activityOrder}-${questionOrder}`
	}
	/**
	 * Records a user's answer to a specific question
	 * @param activityOrder - The order of the activity containing the question
	 * @param questionOrder - The order of the question within its activity or round
	 * @param roundOrder - Optional order of the round if the question belongs to one
	 * @param answer - The user's answer (true/false)
	 */
	answerQuestion(
		activityOrder: number,
		questionOrder: number,
		roundOrder: number | undefined,
		answer: boolean
	): void {
		const id = this.getQuestionId(activityOrder, questionOrder, roundOrder)
		this.answers.set(id, answer)
	}

	/**
	 * Clears all answers from this session, resetting progress
	 */
	resetAnswers(): void {
		this.answers.clear()
	}

	/**
	 * Retrieves the user's answer for a specific question
	 * @param activityOrder - The order of the activity containing the question
	 * @param questionOrder - The order of the question within its activity or round
	 * @param roundOrder - Optional order of the round if the question belongs to one
	 * @returns The user's answer or null if the question hasn't been answered
	 */
	getQuestionAnswer(
		activityOrder: number,
		questionOrder: number,
		roundOrder?: number
	): boolean | null {
		const id = this.getQuestionId(activityOrder, questionOrder, roundOrder)
		return this.answers.has(id) ? this.answers.get(id)! : null
	}
	/**
	 * Determines if a question has been answered correctly
	 * @param activityOrder - The order of the activity containing the question
	 * @param questionOrder - The order of the question within its activity or round
	 * @param roundOrder - Optional order of the round if the question belongs to one
	 * @returns Boolean indicating correctness, or null if the question hasn't been answered or doesn't exist
	 */
	isQuestionAnsweredCorrectly(
		activityOrder: number,
		questionOrder: number,
		roundOrder?: number
	): boolean | null {
		let question: Question | null = null
		const answer = this.getQuestionAnswer(
			activityOrder,
			questionOrder,
			roundOrder
		)

		if (answer === null) {
			return null // Question hasn't been answered
		}

		try {
			const activity = this.quiz.getActivityByOrder(activityOrder)!

			if (roundOrder) {
				const round = activity.getQuestionOrRoundByOrder(questionOrder) as Round
				question = round.getQuestionByOrder(roundOrder)!
			} else {
				question = activity.getQuestionOrRoundByOrder(questionOrder) as Question
			}

			return answer === question.correctAnswer
		} catch {
			return null
		}
	}
	/**
	 * Checks if an activity has been completed by answering all its questions
	 * @param activityOrder - The order of the activity to check
	 * @returns True if all questions in the activity have been answered, false otherwise
	 */
	isActivityComplete(activityOrder: number): boolean {
		const activity = this.quiz.getActivityByOrder(activityOrder)
		if (!activity) return false

		return activity.questionsOrRounds.every((qor) => {
			if (qor instanceof Round) {
				return qor.questions.every((q) => {
					return (
						this.getQuestionAnswer(activityOrder, q.order, qor.order) !== null
					)
				})
			} else {
				return this.getQuestionAnswer(activityOrder, qor.order) !== null
			}
		})
	}
	/**
	 * Retrieves comprehensive results for an activity, including correctness of all answered questions
	 * @param activityOrder - The order of the activity to get results for
	 * @returns Collection of results for questions and rounds in the activity
	 */
	getActivityResults(activityOrder: number): ActivityResults {
		const results: ActivityResults = []
		const activity = this.quiz.getActivityByOrder(activityOrder)

		if (!activity) {
			return results
		}

		activity.questionsOrRounds.forEach((qor) => {
			if (qor instanceof Round) {
				const roundResults: RoundResult = { roundOrder: qor.order, results: [] }
				qor.questions.forEach((q) => {
					const userAnswer = this.getQuestionAnswer(
						activity.order,
						q.order,
						qor.order
					)

					if (userAnswer !== null) {
						roundResults.results.push({
							questionOrder: q.order,
							correctAnswer: userAnswer === q.correctAnswer
						})
					}
				})

				results.push(roundResults)
			} else {
				const userAnswer = this.getQuestionAnswer(activity.order, qor.order)

				if (userAnswer !== null) {
					results.push({
						questionOrder: qor.order,
						correctAnswer: userAnswer === qor.correctAnswer
					})
				}
			}
		})

		return results
	}
}
