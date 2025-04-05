
import React, { useState, useEffect } from 'react';
import { ProfessionalCourse, CourseInstructor } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Users, Clock, Pencil, Building } from 'lucide-react';
import CourseApplicationForm from './CourseApplicationForm';
import CourseEdit from './CourseEdit';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CourseBannerProps {
  course: ProfessionalCourse;
  canEdit?: boolean;
  handleApply: () => void;
  onCourseUpdate?: (updatedCourse: ProfessionalCourse) => void;
}

const CourseBanner: React.FC<CourseBannerProps> = ({ 
  course, 
  canEdit = false,
  handleApply,
  onCourseUpdate
}) => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [instructors, setInstructors] = useState<CourseInstructor[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch instructors when component mounts or when course changes
  useEffect(() => {
    if (course.id) {
      fetchInstructors();
    }
  }, [course.id]);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_instructors')
        .select('*')
        .eq('course_id', course.id);
        
      if (error) throw error;
      
      setInstructors(data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

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
    
    // Refetch instructors in case they were updated
    fetchInstructors();
  };

  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Light blue background */}
      <div className="absolute inset-0 bg-sky-50">
        {course.imageUrl && (
          <>
            <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-blue-500/30 to-sky-50/95"></div>
            </div>
          </>
        )}
      </div>
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        <Link to="/courses" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors mb-5">
          <ArrowLeft size={16} className="mr-2" /> Վերադառնալ դասընթացների ցանկին
        </Link>
        
        <div className="space-y-5">
          {/* Course title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {course.title}
          </h1>
          
          {/* Course metadata */}
          <div className="flex flex-wrap gap-5 items-center">
            {/* Show author based on author_type */}
            {course.author_type === 'institution' ? (
              <div className="flex items-center gap-2 text-gray-600">
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
              <div className="flex items-center gap-2 text-gray-600">
                <User size={18} />
                <span className="text-sm md:text-base">Հեղինակ՝ {course.createdBy || 'Անանուն'}</span>
              </div>
            )}
            
            {/* Show course duration */}
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} />
              <span className="text-sm md:text-base">Տևողություն՝ {course.duration}</span>
            </div>
            
            {/* Show instructors if available */}
            {instructors.length > 0 && (
              <div className="flex items-start gap-2 text-gray-600">
                <Users size={18} className="mt-1" />
                <div>
                  <span className="text-sm md:text-base">Դասավանդողներ՝</span>
                  <div className="flex flex-wrap items-center mt-1 gap-2">
                    {instructors.map(instructor => (
                      <div key={instructor.id} className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1">
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
            {instructors.length === 0 && course.instructor && (
              <div className="flex items-center gap-2 text-gray-600">
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {course.buttonText || "Դիմել դասընթացին"}
            </Button>
            
            {canEdit && (
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-300 hover:bg-gray-50 flex items-center gap-2"
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
