
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoursePageContext } from '@/contexts/CoursePageContext';

const CourseHeader: React.FC = () => {
  const navigate = useNavigate();
  const { course } = useCoursePageContext();
  
  if (!course) return null;
  
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="pl-0 hover:bg-transparent"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Վերադառնալ
      </Button>
      
      <h1 className="text-3xl font-bold mt-4 mb-2">{course.title}</h1>
      <p className="text-lg text-muted-foreground">{course.subtitle}</p>
    </div>
  );
};

export default CourseHeader;
