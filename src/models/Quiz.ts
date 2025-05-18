import { Activity } from './Activity'

/**
 * Quiz class representing the entire quiz structure
 */
export class Quiz {
	name: string
	heading: string
	activities: Activity[]
	highestActivityOrder: number

	constructor(data: any = {}) {
		this.name = data.name
		this.heading = data.heading
		this.highestActivityOrder = 0

		this.activities = []
		for (const a of data.activities) {
			if (a.order > this.highestActivityOrder) {
				this.highestActivityOrder = a.order
			}

			this.activities.push(new Activity(a))
		}
	}

	/**
	 * Get an activity by its order number
	 * @param order The order number of the activity to find
	 * @returns The Activity with the specified order
	 * @throws Error if activity not found
	 */
	getActivityByOrder(order: number): Activity {
		const activity = this.activities.find(
			(activity) => activity.order === order
		)
		if (!activity) {
			throw new Error(`Activity with order ${order} not found`)
		}
		return activity
	}
}
