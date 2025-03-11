
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
  user, 
  isApproved 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('RedirectHandler: User authenticated, redirecting based on role:', user.role);
      
      // Special handling for admin role - always redirect regardless of approval status
      if (user.role === 'admin') {
        console.log('RedirectHandler: Admin user detected, redirecting to admin dashboard');
        navigate('/admin');
        return;
      }
      
      // Handle approval check for non-admin, non-student roles
      if (!isApproved && user.role !== 'student') {
        console.log('RedirectHandler: User not approved, navigating to approval pending');
        navigate('/approval-pending');
        return;
      }
      
      // Role-based redirects
      switch (user.role) {
        case 'admin':
          console.log('RedirectHandler: Redirecting to admin dashboard');
          navigate('/admin');
          break;
        case 'lecturer':
        case 'instructor':
          navigate('/courses');
          break;
        case 'project_manager':
        case 'supervisor':
          navigate('/projects/manage');
          break;
        case 'employer':
          navigate('/projects/my');
          break;
        case 'student':
          navigate('/projects');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, isApproved, navigate]);

  return null;
};
