import React from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
	message?: string
	size?: 'small' | 'medium' | 'large'
	fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	message = 'Loading...',
	size = 'medium',
	fullScreen = false
}) => {
	const containerClass = fullScreen
		? 'loading-container full-screen'
		: 'loading-container'

	return (
		<div className={containerClass}>
			<div className={`loading-spinner ${size}`}>
				<div className='spinner-circle'></div>
				<div className='spinner-circle'></div>
				<div className='spinner-circle'></div>
			</div>
			{message && <p className='loading-message'>{message}</p>}
		</div>
	)
}

export default LoadingSpinner
