
import React, { useState } from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface CourseOutcomesTabProps {
  course: ProfessionalCourse;
}

const CourseOutcomesTab: React.FC<CourseOutcomesTabProps> = ({ course }) => {
  const [showAllOutcomes, setShowAllOutcomes] = useState(false);
  const { theme } = useTheme();
  
  if (!course.outcomes || course.outcomes.length === 0) {
    return (
      <div className={`text-center py-16 border rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
        <Sparkles className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-4`} />
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
          Ակնկալվող արդյունքների ցանկը հասանելի չէ
        </p>
        <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm mt-2`}>
          Արդյունքների ցանկն ավելացվելուն պես կհայտնվի այստեղ
        </p>
      </div>
    );
  }
  
  const displayOutcomes = showAllOutcomes ? course.outcomes : course.outcomes.slice(0, 6);
  
  return (
    <div className="space-y-8">
      <div className={`${theme === 'dark' 
        ? 'bg-gradient-to-r from-indigo-950/50 to-purple-950/50' 
        : 'bg-gradient-to-r from-indigo-50 to-purple-50'} 
        p-6 rounded-xl shadow-sm`}
      >
        <h2 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          <Sparkles className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
          Ինչ կսովորեք այս դասընթացում
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {displayOutcomes.map((outcome, index) => (
            <div key={index} className={`flex items-start ${theme === 'dark' 
              ? 'bg-gray-800/70 p-3 rounded-lg shadow-sm' 
              : 'bg-white p-3 rounded-lg shadow-sm'}`}
            >
              <div className={`shrink-0 mt-0.5 mr-3 ${theme === 'dark' 
                ? 'bg-green-900/40 rounded-full p-1' 
                : 'bg-green-100 rounded-full p-1'}`}
              >
                <CheckCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{outcome}</span>
            </div>
          ))}
        </div>
        
        {course.outcomes.length > 6 && (
          <Button 
            variant="outline" 
            onClick={() => setShowAllOutcomes(!showAllOutcomes)}
            className={`flex items-center mx-auto mt-6 ${theme === 'dark' 
              ? 'border-indigo-700/50 text-indigo-400 hover:bg-indigo-900/30' 
              : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`}
          >
            {showAllOutcomes ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Ցույց տալ ավելի քիչ
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Ցույց տալ բոլորը ({course.outcomes.length})
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseOutcomesTab;
