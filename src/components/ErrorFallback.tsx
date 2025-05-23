const ErrorFallback = ({
	error,
	resetErrorBoundary
}: {
	error: Error
	resetErrorBoundary: () => void
}) => {
	console.error(error)
	return (
		<div className='min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex flex-col justify-center items-center'>
			<div className='max-w-md w-full bg-white p-8 rounded-xl shadow-lg'>
				<div className='flex items-center justify-center mb-6'>
					<div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-6 text-red-600'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
							/>
						</svg>
					</div>
				</div>
				<h2 className='text-2xl font-bold text-center text-gray-800 mb-4'>
					Something went wrong
				</h2>
				<div className='bg-red-50 p-4 rounded-lg mb-6 border border-red-100'>
					<p className='text-red-600 font-medium mb-1'>Error:</p>
					<p className='text-gray-700'>{error.message}</p>
				</div>
				<button
					onClick={resetErrorBoundary}
					className='w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 mr-2'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
						/>
					</svg>
					Try Again
				</button>
			</div>
		</div>
	)
}

export default ErrorFallback
