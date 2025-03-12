
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ui/protected-route';

// Lazy load pages for better performance
const Login = lazy(() => import('@/pages/Login'));
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ProjectDetails = lazy(() => import('@/pages/ProjectDetails'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const TeacherDashboard = lazy(() => import('@/pages/TeacherDashboard'));
const ProjectManagerDashboard = lazy(() => import('@/pages/ProjectManagerDashboard'));
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const EmployerDashboard = lazy(() => import('@/pages/EmployerDashboard'));
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'));
const OrganizationsPage = lazy(() => import('@/pages/OrganizationsPage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const SpecializationsPage = lazy(() => import('@/pages/SpecializationsPage'));
const GroupsPage = lazy(() => import('@/pages/GroupsPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const ProjectManagementPage = lazy(() => import('@/pages/ProjectManagementPage'));
const StudentProjectsPage = lazy(() => import('@/pages/StudentProjectsPage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const ProjectSubmissionPage = lazy(() => import('@/pages/ProjectSubmissionPage'));
const PendingApprovals = lazy(() => import('@/pages/PendingApprovals'));
const GanttPage = lazy(() => import('@/pages/GanttPage'));

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <span className="ml-3">Բեռնում...</span>
  </div>
);

const AppRoutes = [
  {
    path: '/',
    element: <Suspense fallback={<LoadingFallback />}><Index /></Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<LoadingFallback />}><Login /></Suspense>,
  },
  {
    path: '/project/:id',
    element: <Suspense fallback={<LoadingFallback />}><ProjectDetails /></Suspense>,
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/users',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagementPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/pending-approvals',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin']}>
          <PendingApprovals />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/organizations',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin']}>
          <OrganizationsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/specializations',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin']}>
          <SpecializationsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  // Teacher routes
  {
    path: '/teacher-dashboard',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['lecturer', 'instructor']}>
          <TeacherDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/courses',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['lecturer', 'instructor']}>
          <CoursesPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/courses/manage',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin', 'lecturer', 'instructor']}>
          <CoursesPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/groups',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin', 'lecturer', 'instructor']}>
          <GroupsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  // Project Manager routes
  {
    path: '/project-manager-dashboard',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['project_manager', 'supervisor']}>
          <ProjectManagerDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/projects/manage',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin', 'project_manager', 'supervisor']}>
          <ProjectManagementPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/gantt',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['project_manager', 'supervisor']}>
          <GanttPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  // Student routes
  {
    path: '/student-dashboard',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/projects',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['student']}>
          <StudentProjectsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/portfolio',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['student']}>
          <PortfolioPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  // Employer routes
  {
    path: '/employer-dashboard',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/projects/submit',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['employer']}>
          <ProjectSubmissionPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/projects/my',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  // Common routes for all authenticated users
  {
    path: '/tasks',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin', 'lecturer', 'instructor', 'project_manager', 'supervisor']}>
          <TasksPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/reports',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin']}>
          <ReportsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/notifications',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/settings',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={['admin']}>
          <SettingsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  // Redirect /dashboard to role-specific dashboard
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Navigate to="/" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>,
  }
];

export default AppRoutes;
