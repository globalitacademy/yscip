import React from 'react';
import { User } from '@/types/auth.types';
import AdminNav from './nav/AdminNav';
import TeacherNav from './nav/TeacherNav';
import ProjectManagerNav from './nav/ProjectManagerNav';
import EmployerNav from './nav/EmployerNav';
import StudentNav from './nav/StudentNav';

interface NavMenuProps {
  user: User | null;
}

const NavMenu: React.FC<NavMenuProps> = ({ user }) => {
  if (!user) return null;
  
  switch (user.role) {
    case 'admin':
      return <AdminNav />;
    
    case 'lecturer':
    case 'instructor':
      return <TeacherNav />;
    
    case 'project_manager':
    case 'supervisor':
      return <ProjectManagerNav />;
    
    case 'employer':
      return <EmployerNav />;
    
    case 'student':
      return <StudentNav />;
    
    default:
      return null;
  }
};

export default NavMenu;
