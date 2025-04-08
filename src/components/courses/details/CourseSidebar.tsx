import React, { useState } from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink, Calendar, Book, Users, Award, Download } from 'lucide-react';
import CourseApplicationForm from './CourseApplicationForm';
interface CourseSidebarProps {
  course: ProfessionalCourse;
  handleApply: () => void;
}
const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  handleApply
}) => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const openApplicationForm = () => {
    setIsApplicationFormOpen(true);
  };
  return <div className="bg-white border rounded-xl shadow-lg overflow-hidden sticky top-8">
      {course.imageUrl && <div className="h-48 w-full">
          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
        </div>}
      
      <div className="p-6 bg-slate-800">
        {course.price && <div className="mb-6 text-center">
            <p className="text-3xl font-bold text-indigo-700">{course.price}</p>
            <p className="text-sm text-gray-500">Միայն սահմանափակ ժամանակով</p>
          </div>}
        
        <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
              Տևողություն
            </span>
            <span className="font-medium">{course.duration}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center text-gray-600">
              <Book className="h-4 w-4 mr-2 text-indigo-600" />
              Դասերի քանակ
            </span>
            <span className="font-medium">{course.lessons ? course.lessons.length : 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-indigo-600" />
              Դասախոս
            </span>
            <span className="font-medium">{course.createdBy || 'Անանուն'}</span>
          </div>
          {course.institution && <div className="flex justify-between items-center">
              <span className="flex items-center text-gray-600">
                <Award className="h-4 w-4 mr-2 text-indigo-600" />
                Հաստատություն
              </span>
              <span className="font-medium">{course.institution}</span>
            </div>}
        </div>
        
        <Button onClick={openApplicationForm} className="w-full mb-3 bg-indigo-600 hover:bg-indigo-700 rounded-full py-6 shadow-md transition-all transform hover:translate-y-[-2px]">
          Դիմել դասընթացին
        </Button>
        
        <Button asChild variant="outline" className="w-full rounded-full">
          <a href="#" className="flex items-center justify-center">
            <Download className="mr-2 h-4 w-4" /> Ներբեռնել ծրագիրը
          </a>
        </Button>
        
        <div className="mt-8 border-t pt-6">
          <h3 className="font-semibold mb-4 text-gray-900">Դասընթացի առավելությունները</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 mt-0.5 mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-700">Անհատական ուշադրություն</span>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 mt-0.5 mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-700">Պրակտիկ հմտություններ</span>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 mt-0.5 mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-700">Ավարտական փաստաթուղթ</span>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 mt-0.5 mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-700">Շարունակական աջակցություն</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Application Form Dialog */}
      <CourseApplicationForm course={course} isOpen={isApplicationFormOpen} onClose={() => setIsApplicationFormOpen(false)} />
    </div>;
};
export default CourseSidebar;