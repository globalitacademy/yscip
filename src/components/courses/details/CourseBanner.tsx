
import React, { useState, useEffect } from 'react';
import { ProfessionalCourse, CourseInstructor } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Users, Clock, Pencil, Building, Globe, Tag, CalendarDays } from 'lucide-react';
import CourseApplicationForm from './CourseApplicationForm';
import CourseEdit from './CourseEdit';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from '@/hooks/use-theme';
import { Badge } from '@/components/ui/badge';

interface CourseBannerProps {
  course: ProfessionalCourse;
  canEdit?: boolean;
  handleApply: () => void;
  onCourseUpdate?: (updatedCourse: ProfessionalCourse) => void;
  instructors?: CourseInstructor[];
}

const CourseBanner: React.FC<CourseBannerProps> = ({ 
  course, 
  canEdit = false,
  handleApply,
  onCourseUpdate,
  instructors = []
}) => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const openApplicationForm = () => {
    setIsApplicationFormOpen(true);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleCourseUpdate = (updatedCourse: ProfessionalCourse) => {
    if (onCourseUpdate) {
      onCourseUpdate(updatedCourse);
    }
  };
  
  // Format course creation date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('hy-AM', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-sky-50'}`}>
        {course.imageUrl && (
          <>
            <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className={`absolute inset-0 w-full h-full object-cover ${theme === 'dark' ? 'opacity-20' : 'opacity-30'}`}
              />
              <div className={`absolute inset-0 ${theme === 'dark' 
                ? 'bg-gradient-to-l from-blue-900/40 to-gray-900/95' 
                : 'bg-gradient-to-l from-blue-500/30 to-sky-50/95'}`}></div>
            </div>
          </>
        )}
      </div>
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        <Link to="/courses" className={`inline-flex items-center text-sm font-medium ${theme === 'dark' 
          ? 'text-gray-300 hover:text-blue-400' 
          : 'text-gray-700 hover:text-blue-600'} transition-colors mb-5`}>
          <ArrowLeft size={16} className="mr-2" /> Վերադառնալ դասընթացների ցանկին
        </Link>
        
        <div className="space-y-5">
          {/* Status badges */}
          {course.is_public !== undefined && (
            <div className="flex flex-wrap gap-2">
              <Badge variant={course.is_public ? "success" : "warning"}>
                {course.is_public ? 'Հրապարակված' : 'Չհրապարակված'}
              </Badge>
              
              {course.show_on_homepage && (
                <Badge variant="info">
                  Ցուցադրվում է գլխավոր էջում
                </Badge>
              )}
              
              {course.category && (
                <Badge variant="secondary" className={theme === 'dark' ? 'bg-gray-700 text-gray-200' : ''}>
                  {course.category}
                </Badge>
              )}
            </div>
          )}
          
          {/* Course title */}
          <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {course.title}
          </h1>
          
          {/* Course subtitle */}
          {course.subtitle && course.subtitle !== 'ԴԱՍԸՆԹԱՑ' && (
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {course.subtitle}
            </p>
          )}
          
          {/* Course metadata */}
          <div className="flex flex-wrap gap-5 items-center">
            {/* Show author based on author_type */}
            {course.author_type === 'institution' ? (
              <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Building size={18} />
                <span className="text-sm md:text-base">Հաստատություն՝ {course.institution}</span>
                {course.organizationLogo && (
                  <img 
                    src={course.organizationLogo} 
                    alt={course.institution} 
                    className="h-5 ml-2" 
                  />
                )}
              </div>
            ) : (
              <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <User size={18} />
                <span className="text-sm md:text-base">Հեղինակ՝ {course.createdBy || 'Անանուն'}</span>
              </div>
            )}
            
            {/* Show course duration */}
            <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <Clock size={18} />
              <span className="text-sm md:text-base">Տևողություն՝ {course.duration}</span>
            </div>
            
            {/* Show creation date if available */}
            {course.createdAt && (
              <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <CalendarDays size={18} />
                <span className="text-sm md:text-base">Ստեղծվել է՝ {formatDate(course.createdAt)}</span>
              </div>
            )}
            
            {/* Show URL/slug if available */}
            {course.slug && (
              <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Globe size={18} />
                <span className="text-sm md:text-base">Հղում՝ {course.slug}</span>
              </div>
            )}
            
            {/* Show instructors if available */}
            {instructors && instructors.length > 0 && (
              <div className={`flex items-start gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Users size={18} className="mt-1" />
                <div>
                  <span className="text-sm md:text-base">Դասավանդողներ՝</span>
                  <div className="flex flex-wrap items-center mt-1 gap-2">
                    {instructors.map(instructor => (
                      <div key={instructor.id} className={`flex items-center gap-2 ${theme === 'dark' 
                        ? 'bg-gray-800/80' 
                        : 'bg-white/80'} rounded-full px-3 py-1`}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={instructor.avatar_url || ''} alt={instructor.name} />
                          <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{instructor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Fallback to old instructor field if no instructors found and field exists */}
            {(!instructors || instructors.length === 0) && course.instructor && (
              <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <User size={18} />
                <span className="text-sm md:text-base">Դասախոս՝ {course.instructor}</span>
              </div>
            )}
          </div>
          
          {/* Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <Button
              onClick={openApplicationForm}
              size="lg"
              className={`${theme === 'dark' 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {course.buttonText || "Դիմել դասընթացին"}
            </Button>
            
            {canEdit && (
              <Button 
                variant="outline" 
                size="lg" 
                className={`${theme === 'dark' 
                  ? 'border-gray-600 hover:bg-gray-800' 
                  : 'border-gray-300 hover:bg-gray-50'} flex items-center gap-2`}
                onClick={handleEditClick}
              >
                <Pencil size={16} />
                Խմբագրել
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Course Application Form Dialog */}
      <CourseApplicationForm 
        course={course}
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
      />

      {/* Course Edit Dialog */}
      {canEdit && (
        <CourseEdit
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          course={course}
          onCourseUpdate={handleCourseUpdate}
        />
      )}
    </div>
  );
};

export default CourseBanner;
