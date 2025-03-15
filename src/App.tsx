import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import AdminDashboard from './pages/AdminDashboard';
import UserManagementPage from './pages/UserManagementPage';
import CoursesPage from './pages/CoursesPage';
import GroupsPage from './pages/GroupsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import SpecializationsPage from './pages/SpecializationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import PendingApprovals from './pages/PendingApprovals';
import ProjectManagementPage from './pages/ProjectManagementPage';
import ProjectProposalsPage from './pages/ProjectProposalsPage';
import MyProjectsPage from './pages/MyProjectsPage';
import SupervisedStudentsPage from './pages/SupervisedStudentsPage';
import StudentProjectsPage from './pages/StudentProjectsPage';
import TasksPage from './pages/TasksPage';
import PortfolioPage from './pages/PortfolioPage';
import NotFound from './pages/NotFound';
import ProjectSubmissionPage from './pages/ProjectSubmissionPage';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Admin and instructor routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/specializations" element={<SpecializationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/pending-approvals" element={<PendingApprovals />} />
          
          {/* Project related routes */}
          <Route path="/projects" element={<ProjectManagementPage />} />
          <Route path="/projects/manage" element={<ProjectSubmissionPage />} />
          <Route path="/project-proposals" element={<ProjectProposalsPage />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/supervised-students" element={<SupervisedStudentsPage />} />
          <Route path="/students" element={<StudentProjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/portfolios" element={<PortfolioPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
