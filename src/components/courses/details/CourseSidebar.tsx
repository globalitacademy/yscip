
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface CourseSidebarProps {
  course: ProfessionalCourse;
  handleApply: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course, handleApply }) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden sticky top-8">
      {course.imageUrl && (
        <div className="h-40 w-full">
          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-6">
        {course.price && (
          <div className="mb-4">
            <p className="text-2xl font-bold">{course.price}</p>
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Տևողություն</span>
            <span className="font-medium">{course.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Դասերի քանակ</span>
            <span className="font-medium">{course.lessons ? course.lessons.length : 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Դասախոս</span>
            <span className="font-medium">{course.createdBy || 'Անանուն'}</span>
          </div>
          {course.institution && (
            <div className="flex justify-between">
              <span className="text-gray-600">Հաստատություն</span>
              <span className="font-medium">{course.institution}</span>
            </div>
          )}
        </div>
        
        <Button onClick={handleApply} className="w-full mb-3">
          Դիմել դասընթացին
        </Button>
        
        <Button asChild variant="outline" className="w-full">
          <a href="#" className="flex items-center justify-center">
            Ներբեռնել ծրագիրը <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        
        <div className="mt-6 border-t pt-6">
          <h3 className="font-medium mb-3">Առավելություններ</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Անհատական ուշադրություն</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Պրակտիկ հմտություններ</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Ավարտական փաստաթուղթ</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Աջակցություն</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
