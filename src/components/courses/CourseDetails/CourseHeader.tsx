
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CourseHeaderProps {
  handleGoBack: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ handleGoBack }) => {
  const { user } = useAuth();
  const isAdminUser = user && ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user.role);
  
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        className="pl-0 hover:bg-transparent hover:text-primary flex items-center"
        onClick={handleGoBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {isAdminUser ? 'Վերադառնալ դասընթացների կառավարում' : 'Վերադառնալ դասընթացներ'}
      </Button>
    </div>
  );
};

export default CourseHeader;
