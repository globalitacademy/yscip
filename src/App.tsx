
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetails from './pages/ProjectDetails'
import ProjectEditPage from './pages/ProjectEditPage'
import ProjectCreatePage from './pages/ProjectCreatePage'
import AdminProjectsPage from './pages/AdminProjectsPage'
import ProjectManagementPage from './pages/ProjectManagementPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/projects/edit/:id" element={<ProjectEditPage />} />
      <Route path="/projects/create" element={<ProjectCreatePage />} />
      <Route path="/admin/projects" element={<AdminProjectsPage />} />
      <Route path="/admin/project-management" element={<ProjectManagementPage />} />
    </Routes>
  )
}

export default App
