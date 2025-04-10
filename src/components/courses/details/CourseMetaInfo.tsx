
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Tag, 
  Globe, 
  Users, 
  BarChart3, 
  Building 
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface CourseMetaInfoProps {
  course: ProfessionalCourse;
}

const CourseMetaInfo: React.FC<CourseMetaInfoProps> = ({ course }) => {
  const { theme } = useTheme();
  
  // Format dates if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Նշված չէ';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('hy-AM', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } catch (e) {
      return 'Անվավեր ամսաթիվ';
    }
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div className="flex items-start gap-3">
            <Tag className={`h-5 w-5 mt-0.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Կատեգորիա</p>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {course.category || 'Նշված չէ'}
              </p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-start gap-3">
            <Calendar className={`h-5 w-5 mt-0.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Ստեղծվել է</p>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {formatDate(course.createdAt)}
              </p>
            </div>
          </div>

          {/* Updated Date */}
          <div className="flex items-start gap-3">
            <Clock className={`h-5 w-5 mt-0.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Թարմացվել է</p>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {formatDate(course.updatedAt)}
              </p>
            </div>
          </div>

          {/* Institution */}
          {course.institution && (
            <div className="flex items-start gap-3">
              <Building className={`h-5 w-5 mt-0.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Հաստատություն</p>
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {course.institution}
                  </p>
                  {course.organizationLogo && (
                    <img 
                      src={course.organizationLogo} 
                      alt={course.institution} 
                      className="h-6" 
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Display URL */}
          {course.slug && (
            <div className="flex items-start gap-3">
              <Globe className={`h-5 w-5 mt-0.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Հղում</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {course.slug}
                </p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-start gap-3 col-span-1">
            <div className="w-5 flex justify-center mt-0.5">
              <div className={`w-3 h-3 rounded-full ${course.is_public 
                ? 'bg-green-500' 
                : 'bg-amber-500'}`} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Կարգավիճակ</p>
              <Badge variant={course.is_public ? "success" : "warning"} className="mt-1">
                {course.is_public ? 'Հրապարակված' : 'Չհրապարակված'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseMetaInfo;
