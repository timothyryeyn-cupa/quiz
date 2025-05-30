import axios from 'axios'
import { Quiz } from '../models'

// The API URL to fetch quiz data from
const API_URL = import.meta.env.VITE_API_URL
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

const DATA = {
	name: 'Error Find',
	heading: 'This game teaches you to find mistakes in written text.',
	activities: [
		{
			activity_name: 'Activity One',
			order: 1,
			questions: [
				{
					is_correct: false,
					stimulus: 'I really enjoy *to play football* with friends.',
					order: 1,
					user_answers: [],
					feedback: 'I really enjoy *playing football* with friends.'
				},
				{
					is_correct: true,
					stimulus:
						'I think that *starting* a school science magazine is an excellent idea!',
					order: 2,
					user_answers: [],
					feedback:
						'I think that *starting* a school science magazine is an excellent idea!'
				},
				{
					is_correct: false,
					stimulus:
						'Watching films at home is *more cheaper* than at the cinema.',
					order: 3,
					user_answers: [],
					feedback: 'Watching films at home is *cheaper* than at the cinema.'
				},
				{
					is_correct: false,
					stimulus:
						'On the one hand, small cameras are comfortable. *In the other hand*, larger ones take better photos.',
					order: 4,
					user_answers: [],
					feedback:
						'On the one hand, small cameras are comfortable. *On the other hand*, larger ones take better photos.'
				},
				{
					is_correct: false,
					stimulus: 'My friend *like listening* to songs in English',
					order: 5,
					user_answers: [],
					feedback: 'My friend *likes listening* to songs in English'
				}
			]
		},
		{
			activity_name: 'Activity Two',
			order: 2,
			questions: [
				{
					round_title: 'Round 1',
					order: 1,
					questions: [
						{
							is_correct: false,
							stimulus:
								'Watching films at home is *more cheaper* than at the cinema.',
							order: 1,
							user_answers: [],
							feedback:
								'Watching films at home is *cheaper* than at the cinema.'
						},
						{
							is_correct: false,
							stimulus:
								'On the one hand, small cameras are comfortable. *In the other hand*, larger ones take better photos.',
							order: 2,
							user_answers: [],
							feedback:
								'On the one hand, small cameras are comfortable. *On the other hand*, larger ones take better photos.'
						}
					]
				},
				{
					round_title: 'Round 2',
					order: 2,
					questions: [
						{
							is_correct: true,
							stimulus:
								"I can't go out because I *haven't finished* my homework yet.",
							order: 1,
							user_answers: [],
							feedback:
								"I can't go out because I *haven't finished* my homework yet."
						},
						{
							is_correct: false,
							stimulus: 'My friend *like listening* to songs in English',
							order: 2,
							user_answers: [],
							feedback: 'My friend *likes listening* to songs in English'
						}
					]
				}
			]
		}
	]
}

/**
 * Loads quiz data from the API or returns mock data for development
 */
export async function loadQuiz(): Promise<Quiz> {
	try {
		// In production, use the actual API
		if (!USE_MOCK_DATA) {
			const response = await axios.get(`${API_URL}/quiz`)
			return new Quiz(response.data)
		}

		// In development, use hardcoded data
		return new Quiz(DATA)
	} catch (error) {
		console.error('Error loading quiz:', error)
		throw new Error('Failed to load quiz data')
	}
}
