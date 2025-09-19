import React, { ErrorInfo, ReactNode } from 'react';
import { logError } from '../../utils/errorLogger';
import { withNotifications } from './withNotifications';
import { NotificationType } from '../../context/NotificationContextValue';

interface ErrorBoundaryProps {
  children: ReactNode;
  addNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error using our centralized logger
    logError(error, errorInfo, { component: 'ErrorBoundary' }, 'critical');

    // Display a user-friendly notification
    this.props.addNotification(
      'An unexpected error occurred. Please refresh the page.',
      'critical',
      0 // Make it persistent until user refreshes
    );

    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full bg-red-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-white/80 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn bg-white/80 text-black hover:bg-white"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && (
              <details className="mt-4 text-white/80">
                <summary className="cursor-pointer">Error Details (Dev Mode)</summary>
                <pre className="mt-2 text-xs bg-black/50 p-2 rounded overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundaryWithNotifications = withNotifications(ErrorBoundary);
export default ErrorBoundaryWithNotifications;
