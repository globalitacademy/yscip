
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import VerifyEmail from '@/pages/VerifyEmail';
import ProjectDetails from '@/pages/ProjectDetails';
import AdminDashboard from '@/pages/AdminDashboard';
import UserManagementPage from '@/pages/UserManagementPage';
import GroupsPage from '@/pages/GroupsPage';
import SpecializationsPage from '@/pages/SpecializationsPage';
import OrganizationsPage from '@/pages/OrganizationsPage';
import ProjectManagementPage from '@/pages/ProjectManagementPage';
import CoursesPage from '@/pages/CoursesPage';
import ProjectProposalsPage from '@/pages/ProjectProposalsPage';
import PendingApprovals from '@/pages/PendingApprovals';
import SupervisedStudentsPage from '@/pages/SupervisedStudentsPage';
import StudentProjectsPage from '@/pages/StudentProjectsPage';
import MyProjectsPage from '@/pages/MyProjectsPage';
import TasksPage from '@/pages/TasksPage';
import PortfolioPage from '@/pages/PortfolioPage';
import SettingsPage from '@/pages/SettingsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ReportsPage from '@/pages/ReportsPage';
import ProjectSubmissionPage from '@/pages/ProjectSubmissionPage';
import NotFound from '@/pages/NotFound';
import ModulesPage from './pages/ModulesPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider projectId={null} initialProject={null}>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            
            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Student specific redirects */}
            <Route path="/projects/manage" element={<Navigate to="/admin/my-projects" replace />} />
            <Route path="/my-projects" element={<Navigate to="/admin/my-projects" replace />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/groups" element={<GroupsPage />} />
            <Route path="/admin/specializations" element={<SpecializationsPage />} />
            <Route path="/admin/organizations" element={<OrganizationsPage />} />
            <Route path="/admin/projects" element={<ProjectManagementPage />} />
            <Route path="/admin/courses" element={<CoursesPage />} />
            <Route path="/admin/modules" element={<ModulesPage />} />
            <Route path="/admin/project-proposals" element={<ProjectProposalsPage />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovals />} />
            <Route path="/admin/supervised-students" element={<SupervisedStudentsPage />} />
            <Route path="/admin/student-projects" element={<StudentProjectsPage />} />
            <Route path="/admin/my-projects" element={<MyProjectsPage />} />
            <Route path="/admin/tasks" element={<TasksPage />} />
            <Route path="/admin/portfolio" element={<PortfolioPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/project-submission/:id" element={<ProjectSubmissionPage />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
