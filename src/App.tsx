
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from "sonner";
import Index from '@/pages/Index';
import ProjectDetails from '@/pages/ProjectDetails';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import UserManagementPage from '@/pages/UserManagementPage';
import OrganizationsPage from '@/pages/OrganizationsPage';
import AuthProvider, { useAuth } from '@/contexts/AuthContext';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/organizations" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <OrganizationsPage />
        </ProtectedRoute>
      } />
      
      {/* Lecturer routes */}
      <Route path="/tasks" element={
        <ProtectedRoute allowedRoles={['lecturer', 'instructor']}>
          <div>Tasks Management (Coming Soon)</div>
        </ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute allowedRoles={['lecturer', 'instructor']}>
          <div>Courses Management (Coming Soon)</div>
        </ProtectedRoute>
      } />
      
      {/* Project Manager routes */}
      <Route path="/projects/manage" element={
        <ProtectedRoute allowedRoles={['project_manager', 'supervisor']}>
          <div>Projects Management (Coming Soon)</div>
        </ProtectedRoute>
      } />
      <Route path="/gantt" element={
        <ProtectedRoute allowedRoles={['project_manager', 'supervisor']}>
          <div>Gantt Chart (Coming Soon)</div>
        </ProtectedRoute>
      } />
      
      {/* Employer routes */}
      <Route path="/projects/submit" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <div>Submit Project Proposal (Coming Soon)</div>
        </ProtectedRoute>
      } />
      <Route path="/projects/my" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <div>My Projects (Coming Soon)</div>
        </ProtectedRoute>
      } />
      
      {/* Student routes */}
      <Route path="/projects" element={
        <ProtectedRoute allowedRoles={['student']}>
          <div>Browse Projects (Coming Soon)</div>
        </ProtectedRoute>
      } />
      <Route path="/portfolio" element={
        <ProtectedRoute allowedRoles={['student']}>
          <div>My Portfolio (Coming Soon)</div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster />
        <SonnerToaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
