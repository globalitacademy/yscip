
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CourseDetailHeaderProps {
  course: ProfessionalCourse;
}

const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({ course }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            {course.imageUrl ? (
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-lg border-2 border-white"
              />
            ) : course.icon ? (
              <div className={cn(
                "w-32 h-32 sm:w-40 sm:h-40 rounded-2xl flex items-center justify-center bg-white border-2 border-white shadow-lg",
                course.color || "bg-indigo-100"
              )}>
                {course.icon}
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl flex items-center justify-center bg-indigo-100 border-2 border-white shadow-lg">
                <span className="text-4xl font-bold text-indigo-500">
                  {course.title ? course.title.charAt(0) : "C"}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="space-y-1 mb-4">
              {course.institution && (
                <div className="text-sm font-medium text-indigo-600">{course.institution}</div>
              )}
              <h2 className="text-2xl md:text-3xl font-bold">{course.title}</h2>
              {course.subtitle && (
                <p className="text-lg text-gray-600">{course.subtitle}</p>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              {course.duration && (
                <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
                  <span className="font-medium text-indigo-700">Տևողություն:</span>
                  <span className="ml-2">{course.duration}</span>
                </div>
              )}
              
              {course.createdBy && (
                <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
                  <span className="font-medium text-indigo-700">Հեղինակ:</span>
                  <span className="ml-2">{course.createdBy}</span>
                </div>
              )}
              
              {course.price && (
                <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
                  <span className="font-medium text-indigo-700">Գին:</span>
                  <span className="ml-2">{course.price}</span>
                </div>
              )}
            </div>
            
            <Button 
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8"
            >
              Գրանցվել դասընթացին
            </Button>
          </div>
          
          {course.organizationLogo && (
            <div className="shrink-0 hidden lg:block">
              <img 
                src={course.organizationLogo} 
                alt="Organization Logo" 
                className="h-16 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader;
