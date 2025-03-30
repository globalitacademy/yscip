
import React, { useState } from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface CourseOutcomesTabProps {
  course: ProfessionalCourse;
}

const CourseOutcomesTab: React.FC<CourseOutcomesTabProps> = ({ course }) => {
  const [showAllOutcomes, setShowAllOutcomes] = useState(false);
  
  if (!course.outcomes || course.outcomes.length === 0) {
    return (
      <div className="text-center py-16 border rounded-xl bg-gray-50">
        <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">Ակնկալվող արդյունքների ցանկը հասանելի չէ</p>
        <p className="text-gray-400 text-sm mt-2">Արդյունքների ցանկն ավելացվելուն պես կհայտնվի այստեղ</p>
      </div>
    );
  }
  
  const displayOutcomes = showAllOutcomes ? course.outcomes : course.outcomes.slice(0, 6);
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
          Ինչ կսովորեք այս դասընթացում
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {displayOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-start bg-white p-3 rounded-lg shadow-sm">
              <div className="shrink-0 mt-0.5 mr-3 bg-green-100 rounded-full p-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-700">{outcome}</span>
            </div>
          ))}
        </div>
        
        {course.outcomes.length > 6 && (
          <Button 
            variant="outline" 
            onClick={() => setShowAllOutcomes(!showAllOutcomes)}
            className="flex items-center mx-auto mt-6 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
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
