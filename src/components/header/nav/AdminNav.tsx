
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Building } from 'lucide-react';

const AdminNav = () => {
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
};

export default AdminNav;
