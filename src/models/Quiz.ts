import { Activity } from './Activity'

/**
 * Represents the top-level quiz structure containing all activities.
 * This is the root model that organizes the entire quiz content.
 */
export class Quiz {
	/** The name/identifier of the quiz */
	readonly name: string
	/** The main heading or title displayed for the quiz */
	readonly heading: string
	/** Collection of activities that form this quiz */
	readonly activities: Activity[]

	/**
	 * Creates a new Quiz instance
	 * @param data - Raw quiz data from API or storage
	 */
	constructor(data: any = {}) {
		this.name = data.name
		this.heading = data.heading

		this.activities = []
		for (const a of data.activities) {
			this.activities.push(new Activity(a))
		}
	}

	/**
	 * Gets the highest activity order number in this quiz
	 * @returns The highest activity order or 0 if the quiz has no activities
	 */
	get highestActivityOrder(): number {
		if (this.activities.length === 0) {
			return 0
		}
		return Math.max(...this.activities.map((a) => a.order))
	}

	/**
	 * Gets a specific activity from this quiz by its order number
	 * @param order - The order number of the activity to retrieve
	 * @returns The matching activity or undefined if not found
	 */
	getActivityByOrder(order: number): Activity | undefined {
		return this.activities.find((activity) => activity.order === order)
	}
}
