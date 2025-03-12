
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">Բեռնում...</span>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // If no specific roles are required, or user's role is allowed
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  
  // Redirect to appropriate dashboard based on role
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'lecturer' || user.role === 'instructor') {
    return <Navigate to="/teacher-dashboard" replace />;
  } else if (user.role === 'project_manager' || user.role === 'supervisor') {
    return <Navigate to="/project-manager-dashboard" replace />;
  } else if (user.role === 'employer') {
    return <Navigate to="/employer-dashboard" replace />;
  } else if (user.role === 'student') {
    return <Navigate to="/student-dashboard" replace />;
  }
  
  // Default fallback
  return <Navigate to="/" replace />;
};
