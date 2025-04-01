
import React, { useState } from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, Pencil } from 'lucide-react';
import CourseApplicationForm from './CourseApplicationForm';

interface CourseBannerProps {
  course: ProfessionalCourse;
  canEdit?: boolean;
  handleApply: () => void;
}

const CourseBanner: React.FC<CourseBannerProps> = ({ 
  course, 
  canEdit = false,
  handleApply
}) => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  const openApplicationForm = () => {
    setIsApplicationFormOpen(true);
  };

  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Light blue background */}
      <div className="absolute inset-0 bg-sky-50">
        {course.imageUrl && (
          <>
            <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-blue-500/30 to-sky-50/95"></div>
            </div>
          </>
        )}
      </div>
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        <Link to="/courses" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors mb-5">
          <ArrowLeft size={16} className="mr-2" /> Վերադառնալ դասընթացների ցանկին
        </Link>
        
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
              onClick={openApplicationForm}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Դիմել դասընթացին
            </Button>
            
            {canEdit && (
              <Link to={`/admin/courses/${course.id}`}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Խմբագրել
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Course Application Form Dialog */}
      <CourseApplicationForm 
        course={course}
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
      />
    </div>
  );
};

export default CourseBanner;
