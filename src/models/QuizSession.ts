import { Quiz, Question, Round } from './index'

type QuestionId = `${number}-${number}-${number}` | `${number}-${number}`

type QuestionResult = { questionOrder: number; correctAnswer: boolean }

type RoundResult = { roundOrder: number; results: QuestionResult[] }

export type ActivityResults = (RoundResult | QuestionResult)[]

export class QuizSession {
	readonly quiz: Quiz
	readonly answers: Map<QuestionId, boolean> = new Map()

	constructor(quiz: Quiz) {
		this.quiz = quiz
	}

	private getQuestionId(
		activityOrder: number,
		questionOrder: number,
		roundOrder?: number
	): QuestionId {
		return roundOrder
			? `${activityOrder}-${roundOrder}-${questionOrder}`
			: `${activityOrder}-${questionOrder}`
	}

	answerQuestion(
		activityOrder: number,
		questionOrder: number,
		roundOrder: number | undefined,
		answer: boolean
	): void {
		const id = this.getQuestionId(activityOrder, questionOrder, roundOrder)
		this.answers.set(id, answer)
	}

	resetAnswers(): void {
		this.answers.clear()
	}

	getQuestionAnswer(
		activityOrder: number,
		questionOrder: number,
		roundOrder?: number
	): boolean | null {
		const id = this.getQuestionId(activityOrder, questionOrder, roundOrder)
		return this.answers.has(id) ? this.answers.get(id)! : null
	}

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
