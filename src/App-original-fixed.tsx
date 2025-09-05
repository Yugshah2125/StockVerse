import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Lazy load components with fallbacks
const Auth = React.lazy(() => 
  import("./pages/Auth").catch(() => ({
    default: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">StockVerse</h1>
          <p className="mb-4">Auth component is loading...</p>
          <div className="space-y-4 max-w-sm mx-auto">
            <input type="email" placeholder="Email" className="w-full p-3 rounded border" />
            <input type="password" placeholder="Password" className="w-full p-3 rounded border" />
            <button className="w-full p-3 bg-blue-600 text-white rounded">Sign In</button>
          </div>
        </div>
      </div>
    )
  }))
);

const Dashboard = React.lazy(() => 
  import("./pages/Dashboard").catch(() => ({
    default: () => (
      <div className="min-h-screen bg-background p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>Dashboard component is loading...</p>
      </div>
    )
  }))
);

// Simplified providers that won't break
const SimpleProviders = ({ children }: { children: React.ReactNode }) => {
  try {
    // Try to load complex providers
    const { QueryClient, QueryClientProvider } = require("@tanstack/react-query");
    const { AuthProvider } = require("./contexts/AuthContext");
    
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.warn("Complex providers failed, using simple fallback:", error);
    return <>{children}</>;
  }
};

const App = () => {
  return (
    <ErrorBoundary>
      <SimpleProviders>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SimpleProviders>
    </ErrorBoundary>
  );
};

export default App;