export class Question {
	readonly stimulus: string
	readonly feedback: string
	readonly order: number
	readonly correctAnswer: boolean

	constructor(data: any = {}) {
		this.order = data.order
		this.stimulus = data.stimulus
		this.feedback = data.feedback
		this.correctAnswer = data.is_correct
	}
}
