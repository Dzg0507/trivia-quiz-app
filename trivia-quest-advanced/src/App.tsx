import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { LoadingProvider } from './context/LoadingContext.tsx';
import QuizProgressProvider from './context/QuizProgressContext.tsx';
import ThemeProvider from './context/ThemeContext.tsx'; // Import ThemeProvider
import ErrorBoundary from './components/common/ErrorBoundary.tsx';
import Navbar from './components/Navbar.tsx';
import BackgroundAnimation from './components/common/BackgroundAnimation.tsx';
import NotificationToastContainer from './components/common/NotificationToast.tsx';
import GlobalLoadingIndicator from './components/common/GlobalLoadingIndicator.tsx';
import { AnimatePresence, motion } from 'framer-motion';
import './app.css';
import { appRoutes } from './config/routes.tsx';

interface Route {
  path: string;
  element: React.ReactNode;
  protected: boolean;
  name: string;
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QuizProgressProvider>
      <div className="min-h-screen relative flex flex-col bg-gradient">
        <BackgroundAnimation />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <NotificationToastContainer />
        <GlobalLoadingIndicator />
      </div>
    </QuizProgressProvider>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const RouteRenderer = ({ routes }: { routes: Route[] }) => {
  const location = useLocation();

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-trivia-neon"></div></div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {routes.map((route: Route, index: number) => (
            <Route
              key={index}
              path={route.path}
              element={
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {route.protected ? <PrivateRoute>{route.element}</PrivateRoute> : route.element}
                </motion.div>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

function AppContent() {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/'];

  if (noLayoutRoutes.includes(location.pathname)) {
    return <RouteRenderer routes={appRoutes} />;
  }

  return (
    <MainLayout>
      <RouteRenderer routes={appRoutes} />
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ErrorBoundary>
            <LoadingProvider>
              <ThemeProvider> {/* Add ThemeProvider here */}
                <AppContent />
              </ThemeProvider>
            </LoadingProvider>
          </ErrorBoundary>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
