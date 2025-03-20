
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from './types';
import { useNavigate } from 'react-router-dom';
import { Code, Coffee, FileCode, ArrowRight, User, Building } from 'lucide-react';
import { PythonLogo } from './CourseIcons';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  
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

  // Determine creator information
  const isCreatedByCurrentUser = course.createdBy === user?.id;
  const creatorName = isCreatedByCurrentUser ? 'Ձեր կողմից' : 'Ուսումնական Կենտրոն';
  const creatorAvatar = isCreatedByCurrentUser && user?.avatar 
    ? user.avatar 
    : 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor';
  const creatorType = isCreatedByCurrentUser ? 'user' : 'organization';

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-all duration-300 border border-border/40 bg-card/80 backdrop-blur-sm group relative">
      <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-xl" />
      
      <div className="flex-grow flex flex-col items-center text-center p-6 relative">
        {course.institution && (
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="text-xs font-medium bg-primary/5 border-primary/20">
              {course.institution}
            </Badge>
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-sm">
          <span className="text-xs font-medium">{creatorName}</span>
          <Avatar className="h-6 w-6 border border-border">
            <AvatarImage src={creatorAvatar} alt={creatorName} />
            <AvatarFallback>
              {creatorType === 'user' ? <User size={12} /> : <Building size={12} />}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="p-4 rounded-full bg-primary/5 text-primary mb-4 transition-transform group-hover:scale-105 duration-300">
          {getIcon()}
        </div>
        
        <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{course.title}</h3>
        
        <p className="text-sm uppercase text-muted-foreground mt-1 mb-4">{course.subtitle || 'ԴԱՍԸՆԹԱՑ'}</p>
        
        {course.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
        )}
        
        <div className="mt-auto w-full flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Դասախոս՝</span> Անուն Ազգանուն
          </div>
          <Button 
            variant="outline" 
            className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-1 group-hover:gap-2"
            onClick={handleViewDetails}
          >
            {course.button_text || 'Դիտել'} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardFooter className="flex justify-between items-center p-4 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">{course.duration}</div>
        {course.price && <div className="text-sm font-medium text-foreground">{course.price}</div>}
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
      
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />
    </Card>
  );
};

export default CourseCard;
