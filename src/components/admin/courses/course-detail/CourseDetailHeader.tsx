
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Clock } from 'lucide-react';

interface CourseDetailHeaderProps {
  course: ProfessionalCourse;
}

const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({ course }) => {
  return (
    <div className="relative overflow-hidden mb-8">
      {/* Background with course image and gradient overlay */}
      <div className="absolute inset-0 bg-sky-50">
        {course.imageUrl && (
          <>
            <img 
              src={course.imageUrl} 
              alt={course.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-sky-50/90"></div>
          </>
        )}
      </div>
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="space-y-5">
          {/* Course title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {course.title}
          </h1>
          
          {/* Course metadata */}
          <div className="flex flex-wrap gap-5 items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <User size={18} />
              <span className="text-sm md:text-base">Դասախոս՝ {course.instructor || 'Արամ Հակոբյան'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} />
              <span className="text-sm md:text-base">Տևողություն՝ {course.duration}</span>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Դիմել դասընթացին
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-300 hover:bg-gray-50"
            >
              Կարդալ մանրամասներ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader;
