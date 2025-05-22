import React from 'react'

const Loading: React.FC = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center'>
			<div className='relative flex flex-col items-center'>
				<div className='w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin'></div>
				<div className='mt-4 text-lg font-semibold text-indigo-700'>
					Loading quiz...
				</div>
			</div>
		</div>
	)
}

export default Loading
