
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, Pencil } from 'lucide-react';

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
  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Light blue background */}
      <div className="absolute inset-0 bg-sky-50"></div>
      
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
              onClick={handleApply}
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
    </div>
  );
};

export default CourseBanner;
