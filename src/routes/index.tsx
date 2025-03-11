
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Index from '@/pages/Index';
import ProjectDetails from '@/pages/ProjectDetails';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import VerifyEmail from '@/pages/VerifyEmail';
import AdminDashboard from '@/pages/AdminDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import ProjectManagerDashboard from '@/pages/ProjectManagerDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import EmployerDashboard from '@/pages/EmployerDashboard';
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
import ApprovalPending from '@/components/ApprovalPending';
import GanttPage from '@/pages/GanttPage';

import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedRedirect } from './RoleBasedRedirect';

const AppRoutes = () => {
  const { loading, error } = useAuth();
  
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
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<RoleBasedRedirect />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/approval-pending" element={<ApprovalPending />} />
      
      {/* Role-specific dashboards */}
      <Route path="/teacher-dashboard" element={
        <ProtectedRoute allowedRoles={['lecturer', 'instructor']}>
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      <Route path="/project-manager-dashboard" element={
        <ProtectedRoute allowedRoles={['project_manager', 'supervisor']}>
          <ProjectManagerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student-dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/employer-dashboard" element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerDashboard />
        </ProtectedRoute>
      } />
      
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
        <ProtectedRoute allowedRoles={['admin', 'lecturer', 'instructor', 'project_manager', 'supervisor', 'employer', 'student']}>
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
          <GanttPage />
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
          <EmployerDashboard />
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
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
