
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { getCourseById, getCourseBySlug } from './utils/courseUtils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import refactored components
import CourseDetailSkeleton from './details/CourseDetailSkeleton';
import CourseBanner from './details/CourseBanner';
import CourseSidebar from './details/CourseSidebar';
import CourseDescription from './details/CourseDescription';
import CourseCurriculumTab from './details/CourseCurriculumTab';
import CourseOutcomesTab from './details/CourseOutcomesTab';
import CourseApplicationForm from './details/CourseApplicationForm';

const CourseDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Show unpublished warning for creators */}
      {!course.is_public && canViewUnpublished && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Այս դասընթացը դեռ չի հրապարակված:</p>
          <p className="text-sm">Միայն դուք և ադմինիստրատորները կարող են տեսնել այն:</p>
        </div>
      )}
      
      {/* Course Header Banner */}
      <CourseBanner course={course} canEdit={canEdit} handleApply={handleApply} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg w-full">
              <TabsTrigger 
                value="description" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md"
              >
                Նկարագրություն
              </TabsTrigger>
              <TabsTrigger 
                value="curriculum" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md"
              >
                Դասընթացի պլան
              </TabsTrigger>
              <TabsTrigger 
                value="outcomes" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md"
              >
                Արդյունքներ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6 focus:outline-none">
              <CourseDescription course={course} />
            </TabsContent>

            <TabsContent value="curriculum" className="focus:outline-none">
              <CourseCurriculumTab course={course} />
            </TabsContent>

            <TabsContent value="outcomes" className="focus:outline-none">
              <CourseOutcomesTab course={course} />
            </TabsContent>
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
