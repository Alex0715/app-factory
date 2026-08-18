import React from 'react';
import { crashReporter } from '@core/crash';
import { ErrorView } from './ErrorView';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Global error boundary. Catches render-time exceptions anywhere below it so
 * a bug in one screen never crashes the whole app - renders ErrorView with a
 * "Try again" action that resets the boundary instead.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    crashReporter.recordError(error, { componentStack: info.componentStack ?? undefined });
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <ErrorView message="The app hit an unexpected problem. You can try again." onRetry={this.reset} />
      );
    }
    return this.props.children;
  }
}
