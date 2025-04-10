
import React from 'react';
import { ProfessionalCourse, CourseInstructor } from '../types/ProfessionalCourse';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from '@/hooks/use-theme';
import { User, AtSign, Briefcase } from 'lucide-react';

interface CourseInstructorsTabProps {
  course: ProfessionalCourse;
  instructors: CourseInstructor[];
}

const CourseInstructorsTab: React.FC<CourseInstructorsTabProps> = ({
  course,
  instructors
}) => {
  const { theme } = useTheme();

  if (!instructors || instructors.length === 0) {
    return (
      <div className="text-center py-8">
        <User className={`mx-auto h-12 w-12 mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Դասընթացի դասախոսների մանրամասն տվյալները առկա չեն
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {instructors.map((instructor) => (
        <div 
          key={instructor.id} 
          className={`${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'} 
            rounded-lg border p-6 shadow-sm`}
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 rounded-lg">
                <AvatarImage src={instructor.avatar_url || ''} alt={instructor.name} />
                <AvatarFallback className={`text-lg font-bold ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {instructor.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-3 flex-grow">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {instructor.name}
              </h3>
              
              {instructor.title && (
                <div className="flex items-center">
                  <Briefcase className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{instructor.title}</p>
                </div>
              )}
              
              {instructor.bio && (
                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {instructor.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseInstructorsTab;
