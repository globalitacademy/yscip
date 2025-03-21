
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Eye, Pencil, Trash, Building, Book } from 'lucide-react';
import { convertIconNameToComponent } from './utils/courseUtils';

interface ProfessionalCourseCardProps {
  course: ProfessionalCourse;
  onEdit?: (course: ProfessionalCourse) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  canEdit?: boolean;
}

const ProfessionalCourseCard: React.FC<ProfessionalCourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  isAdmin = false,
  canEdit = false
}) => {
  // Determine if we should show the icon based on preferIcon or if no image is available
  const showIcon = course.preferIcon || !course.imageUrl;

  // Safely render icon or fallback
  const renderIcon = () => {
    if (course.icon) {
      return course.icon;
    }
    
    if (course.iconName) {
      return convertIconNameToComponent(course.iconName);
    }
    
    return <Book className="w-16 h-16" />;
  };

  return (
    <Card className="h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
      {course.organizationLogo && (
        <div className="absolute top-4 right-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
          <img 
            src={course.organizationLogo} 
            alt={course.institution}
            className="w-4 h-4 mr-1 object-contain rounded-full"
          />
          <span className="text-xs">{course.institution}</span>
        </div>
      )}
      
      <div className="p-6 pt-8 flex flex-col items-center text-center h-full">
        {!showIcon && course.imageUrl ? (
          <img 
            src={course.imageUrl} 
            alt={course.title}
            className="w-14 h-14 mb-4 object-contain"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = 'none';
              document.getElementById(`course-icon-${course.id}`)?.style.setProperty('display', 'block');
            }}
          />
        ) : (
          <div id={`course-icon-${course.id}`} className={`${course.color} mb-4`}>
            {renderIcon()}
          </div>
        )}
        <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">{course.subtitle}</div>
        <h3 className="text-lg font-semibold mb-3 line-clamp-2">{course.title}</h3>
        
        <div className="space-y-2 mb-4 text-sm">
          <div className="text-gray-600">Տևողություն: {course.duration}</div>
          <div className="text-gray-600">Արժեք: {course.price}</div>
          {!course.organizationLogo && (
            <div className="text-gray-600">Հաստատություն: {course.institution}</div>
          )}
        </div>
        
        <div className="mt-auto pt-3 flex justify-center space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1.5" /> {course.buttonText}
          </Button>
          
          {(isAdmin || canEdit) && (
            <>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => onEdit && onEdit(course)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => onDelete && onDelete(course.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfessionalCourseCard;
