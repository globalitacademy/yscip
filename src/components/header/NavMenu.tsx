
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, GraduationCap, BookOpen, ClipboardList, Users, Building, FileText } from 'lucide-react';
import { User } from '@/contexts/auth/types';

interface NavMenuProps {
  user: User | null;
}

const NavMenu: React.FC<NavMenuProps> = ({ user }) => {
  if (!user) return null;
  
  switch (user.role) {
    case 'admin':
      return (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <LayoutDashboard size={16} />
              <span className="hidden md:inline">Կառավարման վահանակ</span>
            </Button>
          </Link>
          <Link to="/users">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <Users size={16} />
              <span className="hidden md:inline">Օգտատերեր</span>
            </Button>
          </Link>
          <Link to="/organizations">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <Building size={16} />
              <span className="hidden md:inline">Կազմակերպություններ</span>
            </Button>
          </Link>
        </div>
      );
    
    case 'lecturer':
    case 'instructor':
      return (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
          <Link to="/courses">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <BookOpen size={16} />
              <span className="hidden md:inline">Կուրսեր</span>
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <ClipboardList size={16} />
              <span className="hidden md:inline">Առաջադրանքներ</span>
            </Button>
          </Link>
          <Link to="/groups">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <Users size={16} />
              <span className="hidden md:inline">Խմբեր</span>
            </Button>
          </Link>
        </div>
      );
    
    case 'project_manager':
    case 'supervisor':
      return (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
          <Link to="/projects/manage">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <LayoutDashboard size={16} />
              <span className="hidden md:inline">Նախագծեր</span>
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <ClipboardList size={16} />
              <span className="hidden md:inline">Առաջադրանքներ</span>
            </Button>
          </Link>
          <Link to="/gantt">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <FileText size={16} />
              <span className="hidden md:inline">Ժամանակացույց</span>
            </Button>
          </Link>
        </div>
      );
    
    case 'employer':
      return (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
          <Link to="/projects/my">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <ClipboardList size={16} />
              <span className="hidden md:inline">Իմ նախագծերը</span>
            </Button>
          </Link>
          <Link to="/projects/submit">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <FileText size={16} />
              <span className="hidden md:inline">Նախագծի առաջարկ</span>
            </Button>
          </Link>
        </div>
      );
    
    case 'student':
      return (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
          <Link to="/projects">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <ClipboardList size={16} />
              <span className="hidden md:inline">Նախագծեր</span>
            </Button>
          </Link>
          <Link to="/portfolio">
            <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
              <FileText size={16} />
              <span className="hidden md:inline">Պորտֆոլիո</span>
            </Button>
          </Link>
        </div>
      );
    
    default:
      return null;
  }
};

export default NavMenu;
