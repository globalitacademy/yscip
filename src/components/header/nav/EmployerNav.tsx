
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList, FileText } from 'lucide-react';

const EmployerNav = () => {
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
};

export default EmployerNav;
