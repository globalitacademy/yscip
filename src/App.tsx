
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/hooks/use-theme"
import { Toaster } from "@/components/ui/sonner"
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import ModulesPage from './pages/ModulesPage'
import ModuleDetailPage from './pages/ModuleDetailPage'
import ThemesPage from './pages/ThemesPage'
import ThemeDetailPage from './pages/ThemeDetailPage'
import AuthProvider from './contexts/AuthContext'
import StudentDashboard from './pages/StudentDashboard'
import EmployerDashboard from './pages/EmployerDashboard' 
import LecturerDashboard from './pages/LecturerDashboard'
import SupervisorDashboard from './pages/SupervisorDashboard'
import MyProjectsPage from './pages/MyProjectsPage'
import TasksPage from './pages/TasksPage'
import PortfolioPage from './pages/PortfolioPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
            <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/module/:id" element={<ModuleDetailPage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/theme/:id" element={<ThemeDetailPage />} />
            <Route path="/admin/my-projects" element={<MyProjectsPage />} />
            <Route path="/admin/tasks" element={<TasksPage />} />
            <Route path="/admin/portfolio" element={<PortfolioPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
