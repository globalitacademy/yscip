
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
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow duration-300 card-hover border border-border/40 bg-card/80 backdrop-blur-sm">
      <div className="flex-grow flex flex-col items-center text-center p-6">
        {course.institution && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-medium text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
              {course.institution}
            </span>
          </div>
        )}
        
        <div className="p-4 rounded-full bg-primary/5 text-primary mb-4">
          {getIcon()}
        </div>
        
        <h3 className="mt-2 text-xl font-semibold text-primary">{course.title}</h3>
        {course.createdBy && (
          <p className="text-sm text-muted-foreground mt-1">
            {course.createdBy}
          </p>
        )}
        <p className="text-sm uppercase text-muted-foreground mt-1">{course.subtitle || 'ԴԱՍԸՆԹԱՑ'}</p>
        
        <Button 
          variant="outline" 
          className="mt-6 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
          onClick={handleViewDetails}
        >
          {course.button_text || 'Դիտել'}
        </Button>
      </div>
      
      <CardFooter className="flex justify-between items-center p-4 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">{course.duration}</div>
        <div className="text-sm font-medium text-foreground">{course.price}</div>
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
