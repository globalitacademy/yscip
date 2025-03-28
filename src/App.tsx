import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import ProjectManagementPage from './pages/ProjectManagementPage';
import CoursesPage from './pages/CoursesPage';
import CourseCreationPage from './pages/CourseCreationPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/projects" element={<ProjectManagementPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/create" element={<CourseCreationPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
