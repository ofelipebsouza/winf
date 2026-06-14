import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WinfProvider } from './contexts/WinfContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import { CortexProvider } from './contexts/CortexContext';
import './index.css';

class ErrorBoundary extends React.Component<any, any> {
  state: any;
  props: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
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
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

let root = (window as any)._reactRoot;
if (!root) {
  root = ReactDOM.createRoot(rootElement);
  (window as any)._reactRoot = root;
}

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <WinfProvider>
        <CortexProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </CortexProvider>
      </WinfProvider>
    </ThemeProvider>
  </React.StrictMode>
);