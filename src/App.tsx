import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { QuizProvider } from './contexts/QuizContext'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import Loading from './components/Loading'

const ErrorFallback = ({
	error,
	resetErrorBoundary
}: {
	error: Error
	resetErrorBoundary: () => void
}) => {
	console.error(error)
	return (
		<p>
			Error: <span>{error.message}</span>
			<br />
			<button onClick={resetErrorBoundary}>Retry</button>
		</p>
	)
}

function App() {
	const baseUrl = import.meta.env.BASE_URL

	return (
		<BrowserRouter basename={baseUrl}>
			<div className=''>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<Suspense fallback={<Loading></Loading>}>
						<QuizProvider>
							<AppRoutes />
						</QuizProvider>
					</Suspense>
				</ErrorBoundary>
			</div>
		</BrowserRouter>
	)
}

export default App
