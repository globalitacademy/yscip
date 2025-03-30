
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CourseProvider, useCourseContext } from '@/contexts/CourseContext';
import CourseList from './CourseList';
import CourseFilterSection from './CourseFilterSection';
import CourseDialogManager from './CourseDialogManager';
import CourseCreationForm from './CourseCreationForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from './types/index';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useCoursePermissions } from '@/hooks/useCoursePermissions';

// Inner component that uses the context
const CourseManagementContent: React.FC = () => {
  const { 
    isCreateDialogOpen, 
    setIsCreateDialogOpen,
    loadCourses,
    handleCreateInit,
    courses,
    professionalCourses,
    setProfessionalCourses
  } = useCourseContext();
  
  const { user } = useAuth();
  const permissions = useCoursePermissions();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempted, setLoadAttempted] = useState(false); // Flag to prevent infinite loops
  
  // Load courses directly from Supabase
  const loadCoursesDirectly = async () => {
    if (loadAttempted) return; // Prevent multiple load attempts
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Loading courses directly from Supabase");
      const { data, error } = await supabase
        .from('courses')
        .select('*');
        
      if (error) {
        console.error("Error fetching courses from Supabase:", error);
        setError("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
        // Try to load via context
        await loadCourses();
        return;
      }
      
      console.log("Courses loaded from Supabase:", data);
      
      if (data && data.length > 0) {
        // Process courses
        const formattedCourses = await Promise.all(data.map(async (course) => {
          // Fetch related data
          const { data: lessonsData } = await supabase
            .from('course_lessons')
            .select('*')
            .eq('course_id', course.id);
            
          const { data: requirementsData } = await supabase
            .from('course_requirements')
            .select('*')
            .eq('course_id', course.id);
            
          const { data: outcomesData } = await supabase
            .from('course_outcomes')
            .select('*')
            .eq('course_id', course.id);
            
          // Convert to ProfessionalCourse format
          const iconElement = convertIconNameToComponent(course.icon_name);
          
          return {
            id: course.id,
            title: course.title,
            subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
            icon: iconElement,
            iconName: course.icon_name,
            duration: course.duration,
            price: course.price,
            buttonText: course.button_text || 'Դիտել',
            color: course.color || 'text-amber-500',
            createdBy: course.created_by || '',
            institution: course.institution || 'ՀՊՏՀ',
            imageUrl: course.image_url,
            organizationLogo: course.organization_logo,
            description: course.description || '',
            is_public: course.is_public || false,
            lessons: lessonsData?.map(lesson => ({
              title: lesson.title, 
              duration: lesson.duration
            })) || [],
            requirements: requirementsData?.map(req => req.requirement) || [],
            outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
            slug: course.slug || '',
            createdAt: course.created_at || new Date().toISOString()
          } as ProfessionalCourse;
        }));
        
        console.log("Formatted courses:", formattedCourses);
        setProfessionalCourses(formattedCourses);
      }
    } catch (e) {
      console.error("Error in loadCoursesDirectly:", e);
      setError("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
      // Try to load via context
      await loadCourses();
    } finally {
      setIsLoading(false);
      setLoadAttempted(true); // Mark loading as attempted to prevent loops
    }
  };
  
  // Load courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Try direct loading first
        await loadCoursesDirectly();
        
        // If that fails, fall back to context
        if (professionalCourses.length === 0 && !loadAttempted) {
          console.log("No courses loaded directly, trying context method");
          await loadCourses();
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
      }
    };
    
    fetchCourses();
    // Only run this effect once on mount
  }, []); // Empty dependency array to run only on mount

  // Check if user has permission to manage courses
  const canManageCourses = permissions.canCreateCourse;
  
  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Դուք պետք է լինեք մուտք գործած համակարգ դասընթացների կառավարման համար
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Դասընթացներ</h2>
        {canManageCourses && (
          <div className="flex gap-2">
            <Button onClick={() => handleCreateInit('professional')}>
              <Plus className="h-4 w-4 mr-2" /> Մասնագիտական դասընթաց
            </Button>
            <Button variant="default" asChild>
              <Link to="/courses/create">
                <Plus className="h-4 w-4 mr-2" /> Նոր դասընթաց
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <CourseFilterSection />
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <CourseList 
          courses={courses} 
          professionalCourses={professionalCourses} 
          userPermissions={permissions}
          currentUserId={user?.id || ''}
        />
      )}
      
      <CourseDialogManager />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-y-auto max-h-screen">
          <CourseCreationForm />
        </DialogContent>
      </Dialog>
      
      {permissions.requiresApproval && (
        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ձեր ստեղծած դասընթացները պետք է հաստատվեն ադմինիստրատորի կողմից նախքան դրանք կհասանելի դառնան համակարգում
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Main component that provides the context
const CourseManagement: React.FC = () => {
  return (
    <CourseProvider>
      <CourseManagementContent />
    </CourseProvider>
  );
};

export default CourseManagement;
