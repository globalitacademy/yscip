
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Globe, Share2, User, Clock, Book, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseBannerProps {
  course: ProfessionalCourse;
  canEdit: boolean;
  handleApply: () => void;
}

const CourseBanner: React.FC<CourseBannerProps> = ({ course, canEdit, handleApply }) => {
  const navigate = useNavigate();
  
  const handleEditCourse = () => {
    if (course?.id) {
      navigate(`/course/${course.id}`);
    }
  };
  
  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 mb-8 shadow-xl">
      <div className="absolute inset-0 opacity-10">
        {course.imageUrl && (
          <img 
            src={course.imageUrl} 
            alt={course.title}
            className="w-full h-full object-cover" 
          />
        )}
      </div>
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white relative overflow-hidden">
            {course.imageUrl ? (
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              course.icon || <Book className="w-16 h-16 text-indigo-500" />
            )}
            {course.is_public && (
              <div className="absolute top-2 right-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <Globe className="w-3 h-3 text-green-600" />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4">
              {course.is_public && (
                <Badge className="mb-2 bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                  <Globe className="w-3 h-3 mr-1" /> Հրապարակված
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 mt-2">{course.subtitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center my-6">
              <div className="flex items-center bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <User className="w-5 h-5 text-indigo-600 mr-2" />
                <span>{course.createdBy || 'Անանուն'}</span>
              </div>
              <div className="flex items-center bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                <span>{course.duration}</span>
              </div>
              {course.institution && (
                <div className="flex items-center bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <Book className="w-5 h-5 text-indigo-600 mr-2" />
                  <span>{course.institution}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button 
                onClick={handleApply}
                size="lg"
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8 transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                Դիմել դասընթացին <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              {canEdit && (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-indigo-200 hover:bg-indigo-50 transition-all duration-300"
                  onClick={handleEditCourse}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Խմբագրել
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-indigo-50 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;
