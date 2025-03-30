
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';

interface CourseDetailHeaderProps {
  course: ProfessionalCourse;
}

const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({ course }) => {
  return (
    <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            {course.imageUrl ? (
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className={`w-40 h-40 rounded-full flex items-center justify-center ${course.color} bg-white border-4 border-white shadow-lg`}>
                {course.icon}
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-lg mb-4">{course.subtitle}</p>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <span className="font-semibold">Տևողություն:</span> {course.duration}
              </div>
              <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <span className="font-semibold">Հեղինակ:</span> {course.createdBy}
              </div>
              {course.institution && (
                <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <span className="font-semibold">Հաստատություն:</span> {course.institution}
                </div>
              )}
              {course.price && (
                <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <span className="font-semibold">Գին:</span> {course.price}
                </div>
              )}
            </div>
            
            <Button size="lg">
              Գրանցվել դասընթացին
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader;
