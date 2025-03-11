
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
      <GraduationCap size={28} className="text-primary" />
      <div className="flex flex-col">
        <span className="text-xl font-bold text-primary">Դիպլոմային</span>
        <span className="text-sm text-muted-foreground -mt-1">Նախագծերի կառավարում</span>
      </div>
    </Link>
  );
};

export default Logo;
