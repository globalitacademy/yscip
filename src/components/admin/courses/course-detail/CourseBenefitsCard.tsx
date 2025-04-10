
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle, GraduationCap, UserCircle } from 'lucide-react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { useTheme } from '@/hooks/use-theme';

interface CourseBenefitsCardProps {
  course?: ProfessionalCourse;
  onApply?: () => void;
}

const CourseBenefitsCard: React.FC<CourseBenefitsCardProps> = ({ course, onApply }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <Card className={`border-0 shadow-lg rounded-xl overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-indigo-950/50 to-purple-950/50' 
        : 'bg-gradient-to-br from-indigo-50 to-purple-50'
    }`}>
      <div className="bg-indigo-600 h-2 w-full"></div>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <div className={`${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-2 rounded-full`}>
            <GraduationCap className={`h-5 w-5 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : ''}`}>
            Ինչու՞ ընտրել այս դասընթացը
          </h3>
        </div>
        
        {course?.createdBy && (
          <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-800/50 bg-opacity-70' 
              : 'bg-white bg-opacity-70'
          }`}>
            <UserCircle className={`h-8 w-8 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-500'}`} />
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {course.createdBy}
              </p>
              {course.instructor && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {course.instructor}
                </p>
              )}
            </div>
          </div>
        )}
        
        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3">
            <div className={`shrink-0 mt-1 rounded-full p-1.5 ${
              isDarkMode ? 'bg-green-900/60' : 'bg-green-100'
            }`}>
              <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
            </div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Փորձառու դասավանդողներ</span>
          </li>
          <li className="flex items-start gap-3">
            <div className={`shrink-0 mt-1 rounded-full p-1.5 ${
              isDarkMode ? 'bg-green-900/60' : 'bg-green-100'
            }`}>
              <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
            </div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Գործնական հմտություններ</span>
          </li>
          <li className="flex items-start gap-3">
            <div className={`shrink-0 mt-1 rounded-full p-1.5 ${
              isDarkMode ? 'bg-green-900/60' : 'bg-green-100'
            }`}>
              <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
            </div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Խմբային աշխատանք</span>
          </li>
          <li className="flex items-start gap-3">
            <div className={`shrink-0 mt-1 rounded-full p-1.5 ${
              isDarkMode ? 'bg-green-900/60' : 'bg-green-100'
            }`}>
              <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
            </div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Ավարտական հավաստագիր</span>
          </li>
        </ul>
        
        <Button 
          className="w-full rounded-full shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all" 
          size="lg"
          onClick={onApply}
        >
          {course?.buttonText || 'Գրանցվել դասընթացին'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseBenefitsCard;
