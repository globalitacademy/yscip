
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import AdminIndex from './pages/AdminIndex';
import ProjectManagementPage from './pages/ProjectManagementPage';
import CoursesPage from './pages/CoursesPage';
import CourseCreationPage from './pages/CourseCreationPage';
import UserManagementPage from './pages/UserManagementPage';
import CourseManagementPage from './pages/CourseManagementPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import CourseDetailPage from './pages/CourseDetailPage';
import AllCoursesPage from './pages/AllCoursesPage';
import CourseDetails from './pages/CourseDetails';
import ProjectDetails from './pages/ProjectDetails';
import CourseApplicationsPage from './pages/CourseApplicationsPage';
import ProjectEditPage from './pages/ProjectEditPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import SpecializationsPage from './pages/SpecializationsPage';

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Router>
          <Routes>
            {/* Main Homepage Route */}
            <Route path="/" element={<Index />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/admin-projects" element={<AdminProjectsPage />} />
            <Route path="/admin/projects" element={<ProjectManagementPage />} />
            <Route path="/admin/courses" element={<CourseManagementPage />} />
            <Route path="/admin/all-courses" element={<AdminCoursesPage />} />
            <Route path="/admin/course-applications" element={<CourseApplicationsPage />} />
            <Route path="/admin/specializations" element={<SpecializationsPage />} />
            <Route path="/admin/settings" element={<SystemSettingsPage />} />
            
            {/* Project and Course Routes */}
            <Route path="/projects" element={<ProjectManagementPage />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/projects/edit/:id" element={<ProjectEditPage />} />
            <Route path="/courses" element={<AllCoursesPage />} />
            <Route path="/courses/admin" element={<CoursesPage />} />
            <Route path="/courses/create" element={<CourseCreationPage />} />
            
            {/* Course Details Routes */}
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
