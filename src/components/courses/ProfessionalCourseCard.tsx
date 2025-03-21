
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Eye, Pencil, Trash, Building, Book, Clock, User, Banknote } from 'lucide-react';
import { convertIconNameToComponent } from './utils/courseUtils';
import { Link } from 'react-router-dom';

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
      {/* Always show organization/institution information in a consistent way */}
      <div className="absolute top-4 right-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
        {course.organizationLogo ? (
          <img 
            src={course.organizationLogo} 
            alt={course.institution}
            className="w-4 h-4 mr-1 object-contain rounded-full"
          />
        ) : (
          <Building className="w-3 h-3 mr-1" />
        )}
        <span className="text-xs">{course.institution}</span>
      </div>
      
      <div className="p-6 pt-12 h-full flex flex-col">
        <div className="flex items-start mb-5">
          {!showIcon && course.imageUrl ? (
            <img 
              src={course.imageUrl} 
              alt={course.title}
              className="w-20 h-20 object-contain mr-4"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                document.getElementById(`course-icon-${course.id}`)?.style.setProperty('display', 'block');
              }}
            />
          ) : (
            <div id={`course-icon-${course.id}`} className={`${course.color} mr-4`}>
              {renderIcon()}
            </div>
          )}
          
          <div className="text-left">
            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{course.subtitle}</div>
            <h3 className="text-lg font-semibold mb-3 line-clamp-2">{course.title}</h3>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <User className="h-4 w-4 mr-1.5 text-gray-500" />
              <span>Դասախոս՝ {course.instructor || "Անուն Ազգանուն"}</span>
            </div>
            
            <div className="flex space-x-4 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                <span>Տևողություն: {course.duration}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Banknote className="h-4 w-4 mr-1.5 text-gray-500" />
                <span>Արժեք: {course.price}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-4 flex justify-start space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/course/${course.id}`}>
              <Eye className="h-4 w-4 mr-1.5" /> {course.buttonText}
            </Link>
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
