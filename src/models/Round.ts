import { Question } from './Question'

export class Round {
	readonly title: string
	readonly order: number
	readonly questions: Question[] = []

	constructor(data: any = {}) {
		this.order = data.order
		this.title = data.round_title

		data.questions.forEach((q: any) => {
			this.questions.push(new Question(q))
		})
	}

	get highestQuestionOrder(): number {
		if (this.questions.length === 0) {
			return 0
		}
		return Math.max(...this.questions.map((q) => q.order))
	}

	getQuestionByOrder(order: number): Question | undefined {
		return this.questions.find((q) => q.order === order)
	}
}
