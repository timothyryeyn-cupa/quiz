import { Question } from './Question'
import { Round } from './Round'

export type QuestionOrRound = Question | Round

export class Activity {
	readonly name: string
	readonly order: number
	readonly questionsOrRounds: QuestionOrRound[] = []

	constructor(data: any = {}) {
		this.order = data.order
		this.name = data.activity_name

		data.questions.forEach((q: any) => {
			this.questionsOrRounds.push(
				q.hasOwnProperty('round_title') ? new Round(q) : new Question(q)
			)
		})
	}

	get highestQuestionOrRoundOrder(): number {
		if (this.questionsOrRounds.length === 0) {
			return 0
		}
		return Math.max(...this.questionsOrRounds.map((qor) => qor.order))
	}

	getQuestionOrRoundByOrder(order: number): QuestionOrRound | undefined {
		return this.questionsOrRounds.find((qor) => qor.order === order)
	}
}
