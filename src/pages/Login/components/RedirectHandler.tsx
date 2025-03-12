
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DBUser, UserRole } from '@/types/database.types';

interface RedirectHandlerProps {
  isAuthenticated: boolean;
  user: DBUser | null;
  isApproved: boolean;
}

export const RedirectHandler: React.FC<RedirectHandlerProps> = ({ 
  isAuthenticated, 
  user
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('RedirectHandler: User authenticated, redirecting based on role:', user.role);
      
      // Redirect based on role without checking approval status
      switch (user.role) {
        case 'admin':
          console.log('RedirectHandler: Admin user detected, redirecting to admin dashboard');
          navigate('/admin');
          break;
        case 'lecturer':
        case 'instructor':
          console.log('RedirectHandler: Redirecting to courses page');
          navigate('/courses');
          break;
        case 'project_manager':
        case 'supervisor':
          console.log('RedirectHandler: Redirecting to project management');
          navigate('/projects/manage');
          break;
        case 'employer':
          console.log('RedirectHandler: Redirecting to employer projects');
          navigate('/projects/my');
          break;
        case 'student':
          console.log('RedirectHandler: Redirecting to student projects');
          navigate('/projects');
          break;
        default:
          console.log('RedirectHandler: Unknown role, redirecting to home');
          navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return null;
};
