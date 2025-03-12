
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from "sonner";
import Index from '@/pages/Index';
import ProjectDetails from '@/pages/ProjectDetails';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import VerifyEmail from '@/pages/VerifyEmail';
import AdminDashboard from '@/pages/AdminDashboard';
import UserManagementPage from '@/pages/UserManagementPage';
import OrganizationsPage from '@/pages/OrganizationsPage';
import CoursesPage from '@/pages/CoursesPage';
import SpecializationsPage from '@/pages/SpecializationsPage';
import GroupsPage from '@/pages/GroupsPage';
import TasksPage from '@/pages/TasksPage';
import ReportsPage from '@/pages/ReportsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SettingsPage from '@/pages/SettingsPage';
import ProjectManagementPage from '@/pages/ProjectManagementPage';
import StudentProjectsPage from '@/pages/StudentProjectsPage';
import PortfolioPage from '@/pages/PortfolioPage';
import ProjectSubmissionPage from '@/pages/ProjectSubmissionPage';
import PendingApprovals from '@/pages/PendingApprovals';
import SupervisedStudentsPage from "@/pages/SupervisedStudentsPage";
import ProjectProposalsPage from '@/pages/ProjectProposalsPage';
import MyProjectsPage from '@/pages/MyProjectsPage';
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
      <Route path="/verify-email" element={<VerifyEmail />} />
      
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
      <Route path="/pending-approvals" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PendingApprovals />
        </ProtectedRoute>
      } />
      <Route path="/organizations" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <OrganizationsPage />
        </ProtectedRoute>
      } />
      <Route path="/specializations" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <SpecializationsPage />
        </ProtectedRoute>
      } />
      <Route path="/courses/manage" element={
        <ProtectedRoute allowedRoles={['admin', 'lecturer', 'instructor']}>
          <CoursesPage />
        </ProtectedRoute>
      } />
      <Route path="/groups" element={
        <ProtectedRoute allowedRoles={['admin', 'lecturer', 'instructor']}>
          <GroupsPage />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <SettingsPage />
        </ProtectedRoute>
      } />
      
      {/* Lecturer routes */}
      <Route path="/tasks" element={
        <ProtectedRoute allowedRoles={['admin', 'lecturer', 'instructor', 'project_manager', 'supervisor']}>
          <TasksPage />
        </ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute allowedRoles={['lecturer', 'instructor']}>
          <CoursesPage />
        </ProtectedRoute>
      } />
      
      {/* Project Manager routes */}
      <Route path="/projects/manage" element={
        <ProtectedRoute allowedRoles={['admin', 'project_manager', 'supervisor']}>
          <ProjectManagementPage />
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
          <ProjectSubmissionPage />
        </ProtectedRoute>
      } />
      <Route path="/projects/my" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <div>My Projects (Coming Soon)</div>
        </ProtectedRoute>
      } />
      <Route path="/project-proposals" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <ProjectProposalsPage />
        </ProtectedRoute>
      } />
      <Route path="/my-projects" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <MyProjectsPage />
        </ProtectedRoute>
      } />
      
      {/* Student routes */}
      <Route path="/projects" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentProjectsPage />
        </ProtectedRoute>
      } />
      <Route path="/portfolio" element={
        <ProtectedRoute allowedRoles={['student']}>
          <PortfolioPage />
        </ProtectedRoute>
      } />
      
      {/* Supervised Students routes */}
      <Route path="/supervised-students" element={<SupervisedStudentsPage />} />
      
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
