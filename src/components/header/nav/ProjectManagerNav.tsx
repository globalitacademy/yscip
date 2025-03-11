
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ClipboardList, FileText } from 'lucide-react';

const ProjectManagerNav = () => {
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
};

export default ProjectManagerNav;
