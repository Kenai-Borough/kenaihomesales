import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Kenai Home Sales UI error', error, info);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6 text-white">
          <div className="max-w-xl rounded-[32px] border border-white/10 bg-slate-950/95 p-8 text-center shadow-2xl shadow-slate-950/50">
            <p className="section-eyebrow">Recovery mode</p>
            <h1 className="mt-4 text-3xl font-semibold">Something interrupted the home search.</h1>
            <p className="mt-4 text-sm text-slate-300">Refresh the experience or return home to browse current Kenai Peninsula homes.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="btn-primary" onClick={() => window.location.reload()} type="button">Reload site</button>
              <a className="btn-secondary" href="/">Return home</a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
