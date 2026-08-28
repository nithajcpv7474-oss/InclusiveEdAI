import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AccessibilityControls from './components/AccessibilityControls';
import LandingPage from './pages/LandingPage';
import NewLessonPage from './pages/NewLessonPage';
import AccessibilityResultPage from './pages/AccessibilityResultPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Anonymous Route Wrapper (Redirects to dashboard if already logged in)
const AnonymousRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <AccessibilityProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen transition-colors duration-300">
              
              {/* Accessibility Skip Link */}
              <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-650 text-white p-3.5 rounded-2xl z-[99999] font-bold shadow-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
              >
                Skip to content
              </a>

              {/* Main Navigation Header */}
              <Header />

              {/* Main Page Area */}
              <main className="flex-1" id="main-content">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                
                <Route path="/login" element={
                  <AnonymousRoute>
                    <LoginPage />
                  </AnonymousRoute>
                } />
                
                <Route path="/signup" element={
                  <AnonymousRoute>
                    <SignupPage />
                  </AnonymousRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />

                <Route path="/new-lesson" element={
                  <ProtectedRoute>
                    <NewLessonPage />
                  </ProtectedRoute>
                } />

                <Route path="/result" element={
                  <ProtectedRoute>
                    <AccessibilityResultPage />
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>

            {/* Site Footer */}
            <Footer />

            {/* Floating Settings Widget */}
            <AccessibilityControls />
            
          </div>
        </BrowserRouter>
      </AuthProvider>
      </ToastProvider>
    </AccessibilityProvider>
  );
}

export default App;
