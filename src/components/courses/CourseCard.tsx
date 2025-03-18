
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from './types';
import { useNavigate } from 'react-router-dom';
import { Code, Coffee, FileCode } from 'lucide-react';
import { PythonLogo } from './CourseIcons';

interface CourseCardProps {
  course: Course;
  isAdmin?: boolean;
  canEdit?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isAdmin, 
  canEdit, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  
  // Function to get icon based on course icon_name or title
  const getIcon = () => {
    if (course.icon_name) {
      if (course.icon_name.toLowerCase() === 'code') {
        return <Code className="h-16 w-16" />;
      } else if (course.icon_name.toLowerCase() === 'filecode') {
        return <FileCode className="h-16 w-16" />;
      } else if (course.icon_name.toLowerCase() === 'coffee') {
        return <Coffee className="h-16 w-16" />;
      }
    }
    
    // Fallback based on title
    const title = course.title.toLowerCase();
    
    if (title.includes('web') || title.includes('front') || title.includes('html')) {
      return <Code className="h-16 w-16" />;
    } else if (title.includes('python') || title.includes('ml') || title.includes('ai')) {
      return <PythonLogo className="h-16 w-16" />;
    } else if (title.includes('java') && !title.includes('javascript')) {
      return <Coffee className="h-16 w-16" />;
    } else if (title.includes('javascript') || title.includes('js')) {
      return <FileCode className="h-16 w-16" />;
    }
    
    // Default icon
    return <Code className="h-16 w-16" />;
  };
  
  const handleViewDetails = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex-grow flex flex-col items-center text-center p-6">
        {getIcon()}
        
        <h3 className="mt-4 text-xl font-semibold text-amber-500">{course.title}</h3>
        <p className="text-sm uppercase text-gray-600 mt-1">{course.subtitle || 'ԴԱՍԸՆԹԱՑ'}</p>
        
        <Button 
          variant="outline" 
          className="mt-6 rounded-full border-gray-300 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 transition-colors"
          onClick={handleViewDetails}
        >
          {course.button_text || 'Դիտել'}
        </Button>
      </div>
      
      <CardFooter className="flex justify-between items-center p-4 border-t bg-gray-50">
        <div className="text-sm text-gray-600">{course.duration}</div>
        <div className="text-sm font-medium text-gray-800">{course.price}</div>
      </CardFooter>
      
      {isAdmin && canEdit && onEdit && onDelete && (
        <div className="hidden">
          {/* These are hidden controls for admin functionality */}
          <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
            Խմբագրել
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(course.id)}>
            Ջնջել
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CourseCard;
