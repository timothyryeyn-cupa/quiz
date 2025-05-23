import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { QuizProvider } from './contexts/QuizContext'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import Loading from './components/Loading'
import ErrorFallback from './components/ErrorFallback'

function App() {
	const baseUrl = import.meta.env.BASE_URL

	return (
		<BrowserRouter basename={baseUrl}>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<Suspense fallback={<Loading></Loading>}>
					<QuizProvider>
						<AppRoutes />
					</QuizProvider>
				</Suspense>
			</ErrorBoundary>
		</BrowserRouter>
	)
}

export default App
