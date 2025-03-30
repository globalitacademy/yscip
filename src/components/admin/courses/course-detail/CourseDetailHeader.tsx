
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, BookOpen } from 'lucide-react';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';

interface CourseDetailHeaderProps {
  course: ProfessionalCourse;
}

const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({ course }) => {
  return (
    <div className="relative overflow-hidden mb-12">
      {/* Simple gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <div className="text-left space-y-6">
            <FadeIn delay="delay-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="px-3 py-1 border border-gray-300 rounded-full text-sm font-semibold">
                  {course.institution || 'Ծրագրավորման ​​դասընթաց'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={14} className="mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </FadeIn>
            
            <SlideUp delay="delay-200">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-xl text-gray-600 mt-3">{course.subtitle}</p>
              )}
            </SlideUp>
            
            <SlideUp delay="delay-300">
              <div className="flex flex-wrap gap-3 my-6">
                {course.category && (
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium">
                    {course.category}
                  </span>
                )}
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium">
                  {course.price}
                </span>
              </div>
            </SlideUp>
            
            <SlideUp delay="delay-400">
              <div className="flex flex-wrap gap-3 pt-4">
                <Button 
                  size="lg"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-full px-8 shadow-lg"
                >
                  Գրանցվել դասընթացին
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full border-gray-300 hover:bg-gray-50"
                >
                  Ծրագրի մանրամասներ
                </Button>
              </div>
            </SlideUp>
          </div>
          
          {/* Right content - illustration */}
          <div className="hidden lg:flex justify-end items-center relative">
            {course.imageUrl ? (
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="max-w-md rounded-2xl shadow-lg z-10 relative"
              />
            ) : (
              <div className="relative">
                <div className="absolute -top-12 -right-8 w-24 h-24 bg-indigo-100 rounded-xl flex items-center justify-center rotate-12">
                  <span className="text-4xl font-bold text-indigo-500">{'</>'}</span>
                </div>
                <img 
                  src="/public/lovable-uploads/a6d988b3-bf40-44b7-84c1-e3366361d005.png" 
                  alt="Developer illustration"
                  className="max-w-sm rounded-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader;
