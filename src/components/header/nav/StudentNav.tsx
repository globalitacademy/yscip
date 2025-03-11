
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList, FileText } from 'lucide-react';

const StudentNav = () => {
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
};

export default StudentNav;
