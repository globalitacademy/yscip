
import React from 'react';
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetails from './pages/ProjectDetails';
import ProjectEditPage from './pages/ProjectEditPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// For now, we'll create basic routes until all pages are ready
export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/projects/edit/:id" element={<ProjectEditPage />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Admin routes */}
      <Route path="/admin/projects" element={<AdminProjectsPage />} />
      <Route path="/admin/project-management" element={<ProjectManagementPage />} />
      <Route path="/admin/projects/edit/:id" element={<ProjectEditPage />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </RouterRoutes>
  );
};

export default Routes;
