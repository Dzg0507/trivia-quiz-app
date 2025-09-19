import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Assuming useAuth hook exists

interface ProtectedRouteProps {
  children: React.ReactNode;
  isProtected: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isProtected }) => {
  const { currentUser } = useAuth();

  if (isProtected && !currentUser) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
