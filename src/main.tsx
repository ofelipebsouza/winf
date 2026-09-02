import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

type ErrorBoundaryState = { hasError: boolean; error: any };
type ErrorBoundaryProps = { children: React.ReactNode };

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare state: ErrorBoundaryState;
  declare props: React.PropsWithChildren<ErrorBoundaryProps>;

  constructor(p: ErrorBoundaryProps) {
    super(p);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#000', color: '#f00', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  let root = (window as any)._reactRoot;
  if (!root) {
    root = ReactDOM.createRoot(rootElement);
    (window as any)._reactRoot = root;
  }

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}