import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BackgroundAnimation from './components/common/BackgroundAnimation';
import './App.css';
import { appRoutes } from './config/routes';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <BackgroundAnimation />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const RouteRenderer = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {appRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                {route.protected ? <PrivateRoute>{route.element}</PrivateRoute> : route.element}
              </motion.div>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function AppContent() {
  return (
    <MainLayout>
      <RouteRenderer />
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;