
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isAuthenticated, loading, error } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">Բեռնում...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-destructive/10 p-6 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Նույնականացման սխալ</h2>
          <p className="mb-4">{error.message}</p>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => window.location.href = '/login'}
          >
            Վերադառնալ մուտքի էջ
          </button>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Հեռացնենք հաստատման ստուգումը
  // Ուղղակի ստուգենք դերը (role)
  
  if (!allowedRoles.includes(user.role)) {
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
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
