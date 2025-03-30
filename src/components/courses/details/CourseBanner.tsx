
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Globe, Share2, User, Clock, Book } from 'lucide-react';
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
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-100 to-violet-100 mb-8">
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
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            {course.imageUrl ? (
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-full" />
            ) : (
              course.icon || <Book className="w-12 h-12 text-primary" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2">
              {course.is_public && (
                <Badge className="mb-2 bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                  <Globe className="w-3 h-3 mr-1" /> Հրապարակված
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-gray-600 mt-2">{course.subtitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center my-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-indigo-600 mr-2" />
                <span>{course.createdBy || 'Անանուն'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                <span>{course.duration}</span>
              </div>
              {course.institution && (
                <div className="flex items-center">
                  <Book className="w-5 h-5 text-indigo-600 mr-2" />
                  <span>{course.institution}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <Button 
                onClick={handleApply}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Դիմել դասընթացին
              </Button>
              
              {canEdit && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleEditCourse}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Խմբագրել
                </Button>
              )}
              
              <Button variant="outline" size="icon">
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
