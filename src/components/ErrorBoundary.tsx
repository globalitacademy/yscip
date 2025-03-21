
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Ինչ-որ բան սխալ է ստացվել</h2>
          <p className="mb-4 text-muted-foreground">Ներողություն ենք խնդրում, հայտնաբերվել է սխալ։</p>
          <div className="my-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mr-2"
            >
              Թարմացնել էջը
            </Button>
            <Button 
              onClick={this.resetError}
              variant="default"
            >
              Փորձել կրկին
            </Button>
          </div>
          {this.state.error && (
            <div className="mt-4 p-4 bg-muted rounded text-left overflow-auto max-h-48">
              <p className="font-mono text-sm">{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
