
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Building, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">Ադմինիստրատորի վահանակ</h1>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={() => navigate('/users')} className="text-xs md:text-sm">
          <Users className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Օգտատերեր</span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/organizations')} className="text-xs md:text-sm">
          <Building className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Կազմակերպություններ</span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/courses/manage')} className="text-xs md:text-sm">
          <BookOpen className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Կուրսեր</span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/specializations')} className="text-xs md:text-sm">
          <GraduationCap className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Մասնագիտություններ</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
