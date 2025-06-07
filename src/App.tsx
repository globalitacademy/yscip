
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import { ThemeProvider } from "./components/ui/theme-provider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagementPage from "./pages/UserManagementPage";
import OrganizationManagementPage from "./pages/OrganizationManagementPage";
import SpecializationManagementPage from "./pages/SpecializationManagementPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetails from "./pages/CourseDetails";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminCourseDetail from "./pages/AdminCourseDetail";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import StudentProjectsPage from "./pages/StudentProjectsPage";
import ThemesPage from "./pages/ThemesPage";
import ThemeDetailPage from "./pages/ThemeDetailPage";
import ThemeLearningPage from "./pages/ThemeLearningPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectSubmissionPage from "./pages/ProjectSubmissionPage";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import ProjectProposalsPage from "./pages/ProjectProposalsPage";
import ReservationsPage from "./pages/ReservationsPage";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <ProjectProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/organizations" element={<OrganizationManagementPage />} />
                <Route path="/admin/specializations" element={<SpecializationManagementPage />} />
                <Route path="/admin/courses" element={<AdminCoursesPage />} />
                <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
                
                {/* Supervisor Routes */}
                <Route path="/supervisor" element={<SupervisorDashboard />} />
                
                {/* Course Routes */}
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:slug" element={<CourseDetails />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                
                {/* Project Routes */}
                <Route path="/projects" element={<StudentProjectsPage />} />
                <Route path="/project/:id" element={<ProjectDetailPage />} />
                <Route path="/project/:id/submit" element={<ProjectSubmissionPage />} />
                <Route path="/project-proposals" element={<ProjectProposalsPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                
                {/* Module Routes */}
                <Route path="/module/:id" element={<ModuleDetailPage />} />
                
                {/* Theme Routes */}
                <Route path="/themes" element={<ThemesPage />} />
                <Route path="/themes/:id" element={<ThemeDetailPage />} />
                <Route path="/themes/:id/learn" element={<ThemeLearningPage />} />
              </Routes>
            </ProjectProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
