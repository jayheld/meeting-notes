'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error
  retry: () => void
}

function DefaultErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-64 p-grid-6">
      <Card className="max-w-md retro-border mac-window">
        <CardHeader>
          <CardTitle className="flex items-center gap-grid-2 text-destructive">
            <div className="w-grid-3 h-grid-3 bg-destructive retro-border flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-destructive-foreground" />
            </div>
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-grid-3">
          <p className="text-body font-body text-muted-foreground">
            An unexpected error occurred while loading this component.
          </p>
          
          <details className="text-caption font-mono">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-grid-1 p-grid-2 bg-muted border border-border text-foreground whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
          
          <div className="flex gap-grid-2">
            <Button onClick={retry} className="gap-grid-1">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for error handling in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Error caught by hook:', error, errorInfo)
    // In a real app, you might want to send this to an error reporting service
  }
}

// Simple error fallback for inline errors
export function InlineErrorFallback({ 
  error, 
  retry, 
  className 
}: ErrorFallbackProps & { className?: string }) {
  return (
    <div className={`flex items-center gap-grid-2 p-grid-3 bg-destructive/10 border border-destructive/20 text-destructive ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-body font-body font-medium">Error loading content</p>
        <p className="text-caption font-body opacity-80 truncate">{error.message}</p>
      </div>
      <Button size="sm" variant="outline" onClick={retry}>
        <RefreshCw className="w-3 h-3" />
      </Button>
    </div>
  )
}
