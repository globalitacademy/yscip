
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
import SupervisedStudentsPage from './pages/SupervisedStudentsPage'
import StudentProjectsPage from './pages/StudentProjectsPage'
import ProgramsPage from './pages/ProgramsPage'
import CoursesPage from './pages/CoursesPage'
import EducationalModulesPage from './pages/EducationalModulesPage'
import PendingApprovalsPage from './pages/PendingApprovalsPage'
import SupervisorTasksPage from './pages/SupervisorTasksPage'
import StudentProgressPage from './pages/StudentProgressPage'
import LecturerStudentProjectsPage from './pages/LecturerStudentProjectsPage'
import LecturerProgramsPage from './pages/LecturerProgramsPage'
import LecturerCoursesPage from './pages/LecturerCoursesPage'
import LecturerEducationalModulesPage from './pages/LecturerEducationalModulesPage'
import LecturerTasksPage from './pages/LecturerTasksPage'
import AdminProjectsPage from './pages/AdminProjectsPage'
import ProjectManagementPage from './pages/ProjectManagementPage'
import ProjectDetails from './pages/ProjectDetails'

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
            <Route path="/project/:id" element={<ProjectDetails />} />
            
            {/* Student Routes */}
            <Route path="/admin/my-projects" element={<MyProjectsPage />} />
            <Route path="/admin/tasks" element={<TasksPage />} />
            <Route path="/admin/portfolio" element={<PortfolioPage />} />
            
            {/* Supervisor Routes */}
            <Route path="/admin/supervised-students" element={<SupervisedStudentsPage />} />
            <Route path="/admin/student-projects" element={<StudentProjectsPage />} />
            <Route path="/admin/programs" element={<ProgramsPage />} />
            <Route path="/admin/courses" element={<CoursesPage />} />
            <Route path="/admin/educational-modules" element={<EducationalModulesPage />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovalsPage />} />
            <Route path="/admin/supervisor-tasks" element={<SupervisorTasksPage />} />
            <Route path="/admin/student-progress" element={<StudentProgressPage />} />
            
            {/* Lecturer Routes */}
            <Route path="/admin/lecturer-student-projects" element={<LecturerStudentProjectsPage />} />
            <Route path="/admin/lecturer-programs" element={<LecturerProgramsPage />} />
            <Route path="/admin/lecturer-courses" element={<LecturerCoursesPage />} />
            <Route path="/admin/lecturer-educational-modules" element={<LecturerEducationalModulesPage />} />
            <Route path="/admin/lecturer-tasks" element={<LecturerTasksPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/admin-projects" element={<AdminProjectsPage />} />
            <Route path="/admin/project-management" element={<ProjectManagementPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
