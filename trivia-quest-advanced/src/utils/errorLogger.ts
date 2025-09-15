export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

interface ErrorLog {
  timestamp: string;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  componentStack?: string | null;
  context?: Record<string, unknown>;
}

export const logError = (error: Error, errorInfo?: React.ErrorInfo, context?: Record<string, unknown>, severity: ErrorSeverity = 'error') => {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    severity,
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    context,
  };

  console.groupCollapsed(`[${errorLog.severity.toUpperCase()}] Error: ${errorLog.message}`);
  console.error('Error Object:', error);
  if (errorInfo) {
    console.error('Component Stack:', errorInfo.componentStack);
  }
  if (context) {
    console.error('Context:', context);
  }
  console.groupEnd();

  // In a real application, you would send this errorLog object to a centralized logging service
  // e.g., Sentry, LogRocket, or a custom backend endpoint.
  // For now, we'll just log to console.
  // console.log('Sending to analytics/logging service:', errorLog);
};
