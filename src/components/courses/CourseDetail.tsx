
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfessionalCourse, CourseInstructor } from './types/ProfessionalCourse';
import { getCourseById, getCourseBySlug } from './utils/courseUtils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import CourseDetailSkeleton from './details/CourseDetailSkeleton';
import CourseBanner from './details/CourseBanner';
import CourseSidebar from './details/CourseSidebar';
import CourseDescription from './details/CourseDescription';
import CourseCurriculumTab from './details/CourseCurriculumTab';
import CourseOutcomesTab from './details/CourseOutcomesTab';
import CourseInstructorsTab from './details/CourseInstructorsTab';
import CourseMetaInfo from './details/CourseMetaInfo';
import CourseApplicationForm from './details/CourseApplicationForm';

const CourseDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [instructors, setInstructors] = useState<CourseInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Fetch instructors separately
  const fetchInstructors = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_instructors')
        .select('*')
        .eq('course_id', courseId);

      if (error) throw error;

      console.log('Instructors data:', data);
      setInstructors(data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setFetchError(null);
      
      try {
        let courseData = null;
        console.log("Փորձում ենք բեռնել դասընթացը հետևյալ տվյալներով:", { id, slug });
        
        // Նախ փորձենք slug-ով
        if (slug) {
          console.log("Փորձում ենք slug-ով:", slug);
          courseData = await getCourseBySlug(slug);
        } 
        // Եթե slug չկա կամ արդյունք չվերադարձվեց, փորձենք ID-ով
        if (!courseData && id) {
          console.log("Փորձում ենք ID-ով:", id);
          courseData = await getCourseById(id);
        }
        
        // Եթե դեռ չենք գտել և URI-ն կարող է լինել ID կամ slug
        if (!courseData && slug) {
          // Ստուգենք, թե slug-ը արդյոք UUID ձևաչափով է
          if (slug.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
            console.log("slug-ը նման է UUID-ի, փորձում ենք որպես ID:", slug);
            courseData = await getCourseById(slug);
          }
        }
        
        // Եթե ոչ մի եղանակով չկարողացանք գտնել դասընթացը
        if (!courseData) {
          console.error("Դասընթացը չի գտնվել:", { id, slug });
          setFetchError('Դասընթացը չի գտնվել');
          return;
        }

        // Դասընթացը գտնվել է
        console.log("Դասընթացը հաջողությամբ բեռնվել է:", courseData.title);
        setCourse(courseData);

        // Fetch instructors if course is found
        if (courseData.id) {
          fetchInstructors(courseData.id);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setFetchError('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
        toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, slug, navigate]);

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleCourseUpdate = (updatedCourse: ProfessionalCourse) => {
    setCourse(updatedCourse);
  };

  if (loading) {
    return <CourseDetailSkeleton type="loading" />;
  }

  if (fetchError || !course) {
    return <CourseDetailSkeleton type="not-found" />;
  }

  // Check if user can view unpublished courses
  const canViewUnpublished = user && (user.role === 'admin' || course.createdBy === user.name);
  
  // If course is not public and user cannot view unpublished courses, show not found
  if (!course.is_public && !canViewUnpublished) {
    return <CourseDetailSkeleton type="not-found" />;
  }

  const canEdit = user && (user.role === 'admin' || course.createdBy === user.name);

  return (
    <div className={`container mx-auto px-4 py-8 max-w-6xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
      {/* Show unpublished warning for creators */}
      {!course.is_public && canViewUnpublished && (
        <div className={`${theme === 'dark' 
          ? 'bg-amber-900/20 border-amber-800/40 text-amber-200' 
          : 'bg-amber-50 border-amber-200 text-amber-800'} 
          px-4 py-3 rounded-md mb-6 border`}
        >
          <p className="font-medium">Այս դասընթացը դեռ չի հրապարակված:</p>
          <p className="text-sm">Միայն դուք և ադմինիստրատորները կարող են տեսնել այն:</p>
        </div>
      )}
      
      {/* Course Header Banner */}
      <CourseBanner 
        course={course} 
        canEdit={canEdit} 
        handleApply={handleApply} 
        onCourseUpdate={handleCourseUpdate}
        instructors={instructors}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className={`mb-6 ${theme === 'dark' 
              ? 'bg-gray-800 p-1 rounded-lg w-full' 
              : 'bg-gray-100 p-1 rounded-lg w-full'}`}
            >
              <TabsTrigger 
                value="description" 
                className={`flex-1 ${theme === 'dark' 
                  ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-400' 
                  : 'data-[state=active]:bg-white data-[state=active]:text-indigo-700'} 
                  data-[state=active]:shadow-sm rounded-md`}
              >
                Նկարագրություն
              </TabsTrigger>
              <TabsTrigger 
                value="curriculum" 
                className={`flex-1 ${theme === 'dark' 
                  ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-400' 
                  : 'data-[state=active]:bg-white data-[state=active]:text-indigo-700'} 
                  data-[state=active]:shadow-sm rounded-md`}
              >
                Դասընթացի պլան
              </TabsTrigger>
              <TabsTrigger 
                value="outcomes" 
                className={`flex-1 ${theme === 'dark' 
                  ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-400' 
                  : 'data-[state=active]:bg-white data-[state=active]:text-indigo-700'} 
                  data-[state=active]:shadow-sm rounded-md`}
              >
                Արդյունքներ
              </TabsTrigger>
              <TabsTrigger 
                value="instructors" 
                className={`flex-1 ${theme === 'dark' 
                  ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-400' 
                  : 'data-[state=active]:bg-white data-[state=active]:text-indigo-700'} 
                  data-[state=active]:shadow-sm rounded-md`}
              >
                Դասախոսներ
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-400px)]">
              <TabsContent value="description" className="space-y-6 focus:outline-none">
                <CourseDescription course={course} />
                
                {/* Add meta information in description tab */}
                <div className="mt-8">
                  <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Դասընթացի մանրամասները
                  </h3>
                  <CourseMetaInfo course={course} />
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="focus:outline-none">
                <CourseCurriculumTab course={course} />
              </TabsContent>

              <TabsContent value="outcomes" className="focus:outline-none">
                <CourseOutcomesTab course={course} />
              </TabsContent>

              <TabsContent value="instructors" className="focus:outline-none">
                <CourseInstructorsTab course={course} instructors={instructors} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <CourseSidebar course={course} handleApply={handleApply} />
        </div>
      </div>
      
      {/* Application Form Dialog */}
      {showApplicationForm && (
        <CourseApplicationForm 
          course={course} 
          isOpen={showApplicationForm} 
          onClose={() => setShowApplicationForm(false)} 
        />
      )}
    </div>
  );
};

export default CourseDetail;
