import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import ProjectManagementPage from './pages/ProjectManagementPage';
import CoursesPage from './pages/CoursesPage';
import CourseCreationPage from './pages/CourseCreationPage';
import UserManagementPage from './pages/UserManagementPage';
import CourseManagementPage from './pages/CourseManagementPage';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import CourseDetailPage from './pages/CourseDetailPage';

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
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/admin-projects" element={<ProjectManagementPage />} />
            <Route path="/admin/courses" element={<CourseManagementPage />} />
            
            {/* Project and Course Routes */}
            <Route path="/projects" element={<ProjectManagementPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/create" element={<CourseCreationPage />} />
            
            {/* Course Details Route */}
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
