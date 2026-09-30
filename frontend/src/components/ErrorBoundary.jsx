import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6 font-medium">
              We encountered an unexpected error while loading this page.
            </p>
            <div className="bg-red-50 text-red-500 text-xs font-mono p-4 rounded-xl text-left overflow-x-auto mb-6">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
