---
name: "frontend-error-boundary"
description: "Implements React Error Boundaries to catch and handle component errors gracefully. Invoke when preventing app crashes, displaying fallback UIs for errors, or logging client-side errors."
---

# Frontend Error Boundary

## Basic Error Boundary

```tsx
// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to your logging endpoint
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

## Hook-based Error Boundary (React 18+)

```tsx
// src/hooks/useErrorBoundary.ts
import { useState, useCallback } from 'react';

export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const throwError = useCallback((err: Error) => {
    setError(err);
  }, []);

  if (error) {
    throw error;
  }

  return { resetError, throwError };
};
```

## Feature-Specific Error Boundary

```tsx
// src/components/MoodBoardErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class MoodBoardErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to load mood board
          </h3>
          <p className="text-red-600 mb-4">
            We couldn't display your dorm room design. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Usage Examples

### App-Level Boundary
```tsx
// src/main.tsx
import { ErrorBoundary } from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

### Route-Level Boundary
```tsx
// src/App.tsx
import { ErrorBoundary } from './components/ErrorBoundary';
import { MoodBoardErrorBoundary } from './components/MoodBoardErrorBoundary';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<VibeQuiz />} />
      <Route
        path="/results"
        element={
          <MoodBoardErrorBoundary>
            <ResultsPage />
          </MoodBoardErrorBoundary>
        }
      />
    </Routes>
  );
}
```

### Component-Level Boundary
```tsx
// src/pages/ResultsPage.tsx
import { MoodBoardErrorBoundary } from '../components/MoodBoardErrorBoundary';

export const ResultsPage = () => {
  return (
    <div className="container mx-auto">
      <h1>Your Dorm Vibe</h1>
      
      <MoodBoardErrorBoundary>
        <MoodBoard imageUrl={mediaContent.imageUrl} />
      </MoodBoardErrorBoundary>
      
      <MoodBoardErrorBoundary>
        <AudioPlayer src={mediaContent.audioUrl} />
      </MoodBoardErrorBoundary>
    </div>
  );
};
```

## Async Error Handling

```tsx
// src/components/AsyncErrorBoundary.tsx
import { useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

export const AsyncErrorBoundary = ({ children, fallback }: Props) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return fallback;
  }

  return children;
};
```

## Best Practices
- Place boundaries at strategic points (routes, major features)
- Provide user-friendly fallback UIs
- Log errors to your monitoring service
- Allow users to retry failed components
- Don't catch errors in development (let them bubble up)
