
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Eye, Pencil, Trash, Building, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ProfessionalCourseCardProps {
  course: ProfessionalCourse;
  onEdit?: (course: ProfessionalCourse) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  canEdit?: boolean;
  onClick?: () => void;
}

const ProfessionalCourseCard: React.FC<ProfessionalCourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  isAdmin = false,
  canEdit = false,
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation
    if (onDelete && course.id) {
      onDelete(course.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation
    if (onEdit) {
      onEdit(course);
    }
  };
  
  const handleViewClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate programmatically to handle dynamic slug/id routing
      const path = course.slug ? `/courses/${course.slug}` : `/courses/${course.id}`;
      navigate(path);
    }
  };

  return (
    <Card className="flex flex-col w-full hover:shadow-md transition-shadow relative">
      {course.organizationLogo ? (
        <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
          <img 
            src={course.organizationLogo} 
            alt={course.institution}
            className="w-6 h-6 mr-1 object-contain rounded-full"
          />
          <span>{course.institution}</span>
        </div>
      ) : (
        <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
          <Building size={12} className="mr-1" />
          <span>{course.institution}</span>
        </div>
      )}

      {(isAdmin || canEdit) && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full" 
            onClick={handleEdit}
          >
            <Pencil size={12} />
          </Button>
          <Button
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full" 
            onClick={handleDelete}
          >
            <Trash size={12} />
          </Button>
        </div>
      )}

      <CardHeader className="pb-2 text-center pt-12 relative">
        {course.imageUrl ? (
          <div className="w-full h-32 mb-4 overflow-hidden rounded-md">
            <img 
              src={course.imageUrl} 
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const iconElement = document.getElementById(`course-icon-${course.id}`);
                if (iconElement) iconElement.style.display = 'block';
              }}
            />
          </div>
        ) : (
          <div id={`course-icon-${course.id}`} className={`mb-4 ${course.color} mx-auto`}>
            {course.icon}
          </div>
        )}
        <h3 className="font-bold text-xl">{course.title}</h3>
        <p className="text-sm text-muted-foreground">{course.subtitle}</p>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <User size={16} />
          <span>Դասախոս՝ {course.createdBy}</span>
        </div>
        
        <div className="flex justify-between w-full text-sm mt-auto">
          <span>{course.duration}</span>
          <span className="font-semibold">{course.price}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          variant="outline"
          className="w-full"
          onClick={handleViewClick}
        >
          <Eye className="h-4 w-4 mr-2" /> {course.buttonText || "Մանրամասն"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCourseCard;
