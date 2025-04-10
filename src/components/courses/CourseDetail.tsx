
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfessionalCourse, CourseInstructor } from './types/ProfessionalCourse';
import { getCourseById, getCourseBySlug } from './utils/courseUtils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
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
import CourseEdit from './details/CourseEdit';

const CourseDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [instructors, setInstructors] = useState<CourseInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
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
        
        if (slug) {
          console.log("Փորձում ենք slug-ով:", slug);
          courseData = await getCourseBySlug(slug);
        } 
        if (!courseData && id) {
          console.log("Փորձում ենք ID-ով:", id);
          courseData = await getCourseById(id);
        }
        
        if (!courseData && slug) {
          if (slug.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
            console.log("slug-ը նման է UUID-ի, փորձում ենք որպես ID:", slug);
            courseData = await getCourseById(slug);
          }
        }
        
        if (!courseData) {
          console.error("Դասընթացը չի գտնվել:", { id, slug });
          setFetchError('Դասընթացը չի գտնվել');
          return;
        }

        console.log("Դասընթացը հաջողությամբ բեռնվել է:", courseData.title);
        setCourse(courseData);

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

  const handleEdit = () => {
    setShowEditForm(true);
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

  const canViewUnpublished = user && (user.role === 'admin' || course.createdBy === user.name);
  
  if (!course.is_public && !canViewUnpublished) {
    return <CourseDetailSkeleton type="not-found" />;
  }

  const canEdit = user && (user.role === 'admin' || course.createdBy === user.name);

  // Format the learning format in Armenian
  const formatInArmenian = (format?: string) => {
    if (!format) return 'Առցանց';
    switch (format) {
      case 'online': return 'Առցանց';
      case 'classroom': return 'Լսարանային';
      case 'hybrid': return 'Հիբրիդային';
      case 'remote': return 'Հեռավար';
      default: return format;
    }
  };

  // Format the language in Armenian
  const languageInArmenian = (language?: string) => {
    if (!language) return 'Հայերեն';
    switch (language) {
      case 'armenian': return 'Հայերեն';
      case 'english': return 'Անգլերեն';
      case 'russian': return 'Ռուսերեն';
      default: return language;
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 max-w-6xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
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
      
      <CourseBanner 
        course={course} 
        canEdit={canEdit} 
        handleApply={handleApply}
        handleEdit={handleEdit}
        onCourseUpdate={handleCourseUpdate}
        instructors={instructors}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

            <TabsContent value="description" className="space-y-6 focus:outline-none">
              <CourseDescription course={course} />
              
              <div className="mt-8">
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Դասընթացի մանրամասները
                </h3>
                <CourseMetaInfo course={course} />
                
                {/* Display new fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {course.category && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className="text-sm text-muted-foreground">Կատեգորիա</p>
                      <p className="font-medium">{course.category}</p>
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className="text-sm text-muted-foreground">Ուսուցման ձևաչափ</p>
                    <p className="font-medium">{formatInArmenian(course.format)}</p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className="text-sm text-muted-foreground">Դասավանդման լեզու</p>
                    <p className="font-medium">{languageInArmenian(course.language)}</p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className="text-sm text-muted-foreground">Դասերի քանակ</p>
                    <p className="font-medium">{course.lessons?.length || 0}</p>
                  </div>
                  
                  {course.createdAt && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className="text-sm text-muted-foreground">Ստեղծվել է</p>
                      <p className="font-medium">{new Date(course.createdAt).toLocaleDateString('hy-AM')}</p>
                    </div>
                  )}
                  
                  {course.updatedAt && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className="text-sm text-muted-foreground">Թարմացվել է</p>
                      <p className="font-medium">{new Date(course.updatedAt).toLocaleDateString('hy-AM')}</p>
                    </div>
                  )}
                </div>
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
          </Tabs>
        </div>

        <div>
          <CourseSidebar course={course} handleApply={handleApply} />
        </div>
      </div>
      
      {showApplicationForm && (
        <CourseApplicationForm 
          course={course} 
          isOpen={showApplicationForm} 
          onClose={() => setShowApplicationForm(false)} 
        />
      )}
      
      {showEditForm && (
        <CourseEdit 
          isOpen={showEditForm} 
          onClose={() => setShowEditForm(false)} 
          course={course} 
          onCourseUpdate={handleCourseUpdate} 
        />
      )}
    </div>
  );
};

export default CourseDetail;
