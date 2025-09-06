import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import "@/services/firebase"; // Force Firebase initialization
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import FantasyLeague from "./pages/FantasyLeague";
import TradingChallenge from "./pages/TradingChallenge";
import MiniGames from "./pages/MiniGames";
import Leaderboard from "./pages/Leaderboard";
import TransactionsReports from "./pages/TransactionsReports";
import FinancialEducation from "./pages/FinancialEducation";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <div className="lg:ml-72">
      {children}
    </div>
  </div>
);

const App = () => {
  console.log('App component rendering...');
  try {
    console.log('Initializing providers...');
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="stockverse-ui-theme">
          <AuthProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected App Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/portfolio" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Portfolio />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/fantasy-league" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <FantasyLeague />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/trading-challenge" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TradingChallenge />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/mini-games" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MiniGames />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Leaderboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/transactions" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TransactionsReports />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/education" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <FinancialEducation />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('App Error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0f172a', color: 'white'}}>
        <div className="text-center" style={{padding: '2rem'}}>
          <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Something went wrong</h1>
          <p style={{marginBottom: '1rem'}}>Error: {error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer'}}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default App;
