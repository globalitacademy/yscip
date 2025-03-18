
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CourseHeaderProps {
  handleGoBack: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ handleGoBack }) => {
  return (
    <Button 
      variant="ghost" 
      className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
      onClick={handleGoBack}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Վերադառնալ
    </Button>
  );
};

export default CourseHeader;
