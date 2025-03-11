
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ClipboardList, Users } from 'lucide-react';

const TeacherNav = () => {
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
};

export default TeacherNav;
