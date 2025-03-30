
import React, { useState } from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface CourseOutcomesTabProps {
  course: ProfessionalCourse;
}

const CourseOutcomesTab: React.FC<CourseOutcomesTabProps> = ({ course }) => {
  const [showAllOutcomes, setShowAllOutcomes] = useState(false);
  
  if (!course.outcomes || course.outcomes.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <p className="text-gray-500">Ակնկալվող արդյունքների ցանկը հասանելի չէ</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {(showAllOutcomes ? course.outcomes : course.outcomes.slice(0, 6)).map((outcome, index) => (
          <div key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <span>{outcome}</span>
          </div>
        ))}
      </div>
      
      {course.outcomes.length > 6 && (
        <Button 
          variant="ghost" 
          onClick={() => setShowAllOutcomes(!showAllOutcomes)}
          className="flex items-center mx-auto"
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
  );
};

export default CourseOutcomesTab;
