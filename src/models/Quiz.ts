import { Activity } from './Activity'

export class Quiz {
	readonly name: string
	readonly heading: string
	readonly activities: Activity[]

	constructor(data: any = {}) {
		this.name = data.name
		this.heading = data.heading

		this.activities = []
		for (const a of data.activities) {
			this.activities.push(new Activity(a))
		}
	}
	get highestActivityOrder(): number {
		if (this.activities.length === 0) {
			return 0
		}
		return Math.max(...this.activities.map((a) => a.order))
	}

	getActivityByOrder(order: number): Activity | undefined {
		return this.activities.find((activity) => activity.order === order)
	}
}
