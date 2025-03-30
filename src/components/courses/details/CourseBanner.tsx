
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';

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
    <div className="relative mb-12 overflow-hidden">
      {/* Main asymmetric background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[55%] bg-gradient-to-l from-red-500 to-red-600 rounded-l-[80px]"></div>
        <div className="absolute top-1/2 right-[40%] w-24 h-24 bg-red-400 rounded-full"></div>
        <div className="absolute bottom-1/4 right-[10%] w-16 h-16 bg-red-700 rounded-full opacity-60"></div>
        <div className="absolute top-[15%] right-[25%] w-40 h-40 rounded-full bg-yellow-400 opacity-20"></div>
        
        {/* Light effect */}
        <div className="absolute right-[20%] top-[20%] w-60 h-60 bg-yellow-300 rounded-full opacity-60 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <Link to="/courses" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-700 transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" /> Վերադառնալ դասընթացների ցանկին
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <div className="text-left space-y-6">
            <FadeIn delay="delay-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="px-3 py-1 border border-gray-300 rounded-full text-sm font-semibold">
                  {course.institution || 'Ծրագրավորման ​​դասընթաց'}
                </div>
                {course.startDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-1" />
                    <span>Սկիզբ: {course.startDate}</span>
                  </div>
                )}
              </div>
            </FadeIn>
            
            <SlideUp delay="delay-200">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-xl text-gray-600 mt-3">{course.subtitle}</p>
              )}
            </SlideUp>
            
            <SlideUp delay="delay-300">
              <div className="flex flex-wrap gap-3 my-6">
                {course.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium"
                  >
                    {tag}
                  </span>
                )) || 
                (course.skills?.length ? course.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium"
                  >
                    {skill}
                  </span>
                )) : (
                  <>
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium">
                      C#
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium">
                      SQL
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium">
                      ASP.NET
                    </span>
                  </>
                ))}
              </div>
            </SlideUp>
            
            <SlideUp delay="delay-400">
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  onClick={handleApply}
                  size="lg"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-full px-8 shadow-lg"
                >
                  Գրանցվել դասընթացին
                </Button>
                
                {canEdit && (
                  <Link to={`/admin/courses/${course.id}`}>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Խմբագրել
                    </Button>
                  </Link>
                )}
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

export default CourseBanner;
