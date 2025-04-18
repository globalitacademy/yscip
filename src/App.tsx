import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import AuthProvider from './contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';

// Import Pages
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ProjectsPage from './pages/ProjectsPage'; 

// New Pages
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import ProgrammingResources from './pages/ProgrammingResources';
import DesignInspiration from './pages/DesignInspiration';
import LearningPaths from './pages/LearningPaths';
import News from './pages/News';

// Admin Pages
import UserManagementPage from './pages/UserManagementPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import SpecializationsPage from './pages/SpecializationsPage';
import GroupsPage from './pages/GroupsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import CourseCreationPage from './pages/CourseCreationPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AllCoursesPage from './pages/AllCoursesPage';
import CourseApplicationsPage from './pages/CourseApplicationsPage';
import ModulesPage from './pages/ModulesPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import ProjectEditPage from './pages/ProjectEditPage';
import StudentProjectsPage from './pages/StudentProjectsPage';
import SupervisedStudentsPage from './pages/SupervisedStudentsPage';
import ProjectProposalsPage from './pages/ProjectProposalsPage';
import PendingApprovals from './pages/PendingApprovals';
import MyProjectsPage from './pages/MyProjectsPage';
import TasksPage from './pages/TasksPage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetails from './pages/ProjectDetails';
import ProjectSubmissionPage from './pages/ProjectSubmissionPage';
import CourseDetails from './pages/CourseDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminRedirectPage from './pages/AdminRedirectPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Module Detail Route */}
            <Route path="/module/:id" element={<ModuleDetailPage />} />
            
            {/* Projects Page Route */}
            <Route path="/projects" element={<ProjectsPage />} />

            {/* New Page Routes */}
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/programming-resources" element={<ProgrammingResources />} />
            <Route path="/design-inspiration" element={<DesignInspiration />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
            <Route path="/news" element={<News />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRedirectPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/admin-projects" element={<AdminProjectsPage />} />
            <Route path="/admin/specializations" element={<SpecializationsPage />} />
            <Route path="/admin/groups" element={<GroupsPage />} />
            <Route path="/admin/organizations" element={<OrganizationsPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
            <Route path="/admin/database" element={<SystemSettingsPage />} />
            
            {/* Course Routes */}
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/courses/create" element={<CourseCreationPage />} />
            
            {/* Course detail routes - handle both /admin/course/:id and /admin/courses/:id */}
            <Route path="/admin/course/:id" element={<CourseDetailPage />} />
            <Route path="/admin/course/:id/edit" element={<CourseDetailPage />} />
            <Route path="/admin/courses/:id" element={<CourseDetailPage />} />
            <Route path="/admin/courses/:id/edit" element={<CourseDetailPage />} />
            
            <Route path="/admin/all-courses" element={<AllCoursesPage />} />
            <Route path="/admin/course-applications" element={<CourseApplicationsPage />} />
            <Route path="/admin/modules" element={<ModulesPage />} />
            
            {/* Project Routes */}
            <Route path="/admin/projects" element={<ProjectManagementPage />} />
            <Route path="/admin/projects/edit/:id" element={<ProjectEditPage />} />
            <Route path="/admin/student-projects" element={<StudentProjectsPage />} />
            <Route path="/admin/supervised-students" element={<SupervisedStudentsPage />} />
            <Route path="/admin/project-proposals" element={<ProjectProposalsPage />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovals />} />
            <Route path="/admin/my-projects" element={<MyProjectsPage />} />
            
            {/* Task Management */}
            <Route path="/admin/tasks" element={<TasksPage />} />
            
            {/* Portfolio */}
            <Route path="/admin/portfolio" element={<PortfolioPage />} />
            
            {/* Project Details */}
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/project/:id/submit" element={<ProjectSubmissionPage />} />
            <Route path="/projects/edit/:id" element={<ProjectEditPage />} />
            
            {/* Course Details - Ավելացնենք և կարգավորենք դասընթացների ուղիները */}
            <Route path="/course/:slug" element={<CourseDetails />} />
            <Route path="/courses" element={<AllCoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetails />} />
            <Route path="/course/id/:id" element={<CourseDetails />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Toaster component for notifications */}
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
