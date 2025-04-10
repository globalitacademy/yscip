
import React from 'react';
import { ProfessionalCourse, CourseInstructor } from '../types/ProfessionalCourse';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Edit, Clock, Users } from 'lucide-react';
import CourseHeader from './CourseHeader';

interface CourseBannerProps {
  course: ProfessionalCourse;
  canEdit?: boolean;
  handleApply: () => void;
  handleEdit?: () => void; 
  onCourseUpdate?: (updatedCourse: ProfessionalCourse) => void;
  instructors?: CourseInstructor[];
}

const CourseBanner: React.FC<CourseBannerProps> = ({ 
  course, 
  canEdit = false,
  handleApply,
  handleEdit,
  onCourseUpdate,
  instructors = []
}) => {
  const { theme } = useTheme();
  const hasImageUrl = !!course.imageUrl;
  
  const bannerStyle = hasImageUrl 
    ? { backgroundImage: `url(${course.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: theme === 'dark' ? '#1f2937' : '#f8fafc' };
  
  const overlayStyle = hasImageUrl
    ? { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
    : {};

  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden mb-8"
      style={bannerStyle}
    >
      <div className="absolute inset-0" style={overlayStyle}></div>
      
      <div className="relative z-10 p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-grow">
            <CourseHeader 
              course={course}
              canEdit={false} 
            />
            
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {course.duration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-white" />
                  <span className="text-white text-sm">{course.duration}</span>
                </div>
              )}
              
              {instructors && instructors.length > 0 && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-white" />
                  <span className="text-white text-sm">{instructors.length} դասախոս</span>
                </div>
              )}
              
              {course.format && (
                <Badge variant="outline" className="text-white border-white">
                  {course.format === 'online' ? 'Առցանց' : 
                   course.format === 'classroom' ? 'Լսարանային' : 
                   course.format === 'hybrid' ? 'Հիբրիդային' : 'Հեռավար'}
                </Badge>
              )}
              
              {course.language && (
                <Badge variant="outline" className="text-white border-white">
                  {course.language === 'armenian' ? 'Հայերեն' :
                   course.language === 'english' ? 'Անգլերեն' : 'Ռուսերեն'}
                </Badge>
              )}
              
              {course.category && (
                <Badge variant="outline" className="text-white border-white">
                  {course.category}
                </Badge>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <Button 
              onClick={handleApply} 
              size="lg"
              className={`${course.color?.replace('text', 'bg')} text-white hover:opacity-90`}
            >
              {course.buttonText || 'Գրանցվել'}
            </Button>
            
            {canEdit && handleEdit && (
              <Button 
                variant="outline" 
                onClick={handleEdit}
                className="flex items-center gap-2 border-white text-white hover:text-white hover:bg-white/20"
              >
                <Edit size={16} />
                Խմբագրել
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;
