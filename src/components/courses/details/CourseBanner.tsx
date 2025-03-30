
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
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
    <div className="relative mb-12">
      {/* Creative background design */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(109,73,209,0.1)_0%,rgba(109,73,209,0)_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(225,29,72,0.08)_0%,rgba(225,29,72,0)_50%)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <Link to="/courses" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" /> Վերադառնալ դասընթացների ցանկին
        </Link>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <FadeIn delay="delay-100">
            <div className="shrink-0 relative">
              {course.imageUrl ? (
                <div className="relative group">
                  <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-xl object-cover border-2 border-white shadow-lg transform transition duration-500 group-hover:scale-105"
                  />
                </div>
              ) : course.icon ? (
                <div className="relative group">
                  <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                  <div className={cn(
                    "relative w-32 h-32 sm:w-48 sm:h-48 rounded-xl flex items-center justify-center border-2 border-white shadow-lg transform transition duration-500 group-hover:scale-105",
                    course.color || "bg-indigo-100"
                  )}>
                    {course.icon}
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-xl flex items-center justify-center bg-indigo-100 border-2 border-white shadow-lg transform transition duration-500 group-hover:scale-105">
                    <span className="text-5xl font-bold text-indigo-500">
                      {course.title ? course.title.charAt(0) : "C"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
          
          <div className="flex-1 text-center md:text-left">
            <SlideUp delay="delay-200">
              <div className="space-y-3 mb-6">
                {course.institution && (
                  <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-full">
                    {course.institution}
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">{course.title}</h1>
                {course.subtitle && (
                  <p className="text-lg text-gray-600 font-light">{course.subtitle}</p>
                )}
              </div>
            </SlideUp>
            
            <SlideUp delay="delay-300">
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                {course.duration && (
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm flex items-center border border-indigo-100 hover:border-indigo-200 transition-colors">
                    <span className="font-medium text-indigo-700">Տևողություն:</span>
                    <span className="ml-2">{course.duration}</span>
                  </div>
                )}
                
                {course.createdBy && (
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm flex items-center border border-indigo-100 hover:border-indigo-200 transition-colors">
                    <span className="font-medium text-indigo-700">Հեղինակ:</span>
                    <span className="ml-2">{course.createdBy}</span>
                  </div>
                )}
                
                {course.price && (
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm flex items-center border border-indigo-100 hover:border-indigo-200 transition-colors">
                    <span className="font-medium text-indigo-700">Գին:</span>
                    <span className="ml-2">{course.price}</span>
                  </div>
                )}
              </div>
            </SlideUp>
            
            <SlideUp delay="delay-400">
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button
                  onClick={handleApply}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-8 shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
                >
                  Գրանցվել դասընթացին
                </Button>
                
                {canEdit && (
                  <Link to={`/admin/courses/${course.id}`}>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full px-8 border-indigo-200 hover:border-indigo-300 flex items-center gap-2 backdrop-blur-sm bg-white/60 transform transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <Pencil size={16} />
                      Խմբագրել
                    </Button>
                  </Link>
                )}
              </div>
            </SlideUp>
          </div>
          
          {course.organizationLogo && (
            <FadeIn delay="delay-500" className="shrink-0 hidden lg:block">
              <div className="relative p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-indigo-100">
                <img 
                  src={course.organizationLogo} 
                  alt="Organization Logo" 
                  className="h-20 object-contain"
                />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;

