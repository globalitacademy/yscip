
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

const CourseDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        let courseData;
        console.log("Fetching course with ID:", id, "or slug:", slug);
        
        // Եթե ունենք slug, օգտագործում ենք այն
        if (slug) {
          courseData = await getCourseBySlug(slug);
        } 
        // Եթե ունենք id, օգտագործում ենք այն
        else if (id) {
          courseData = await getCourseById(id);
        } 
        // Եթե ոչ id, ոչ slug չկա
        else {
          setLoading(false);
          toast.error('Դասընթացի ճանապարհը սխալ է տրված');
          navigate('/courses');
          return;
        }

        if (courseData) {
          console.log("Course data fetched successfully:", courseData.title);
          setCourse(courseData);
        } else {
          console.error("Course data not found for:", id || slug);
          toast.error('Դասընթացը չհաջողվեց գտնել');
          navigate('/courses');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, slug, navigate]);

  const handleApply = () => {
    toast.success('Դիմումն ուղարկված է', {
      description: 'Շուտով կզանգահարենք ձեզ',
      action: {
        label: 'Փակել',
        onClick: () => console.log('Toast closed')
      },
    });
  };

  if (loading) {
    return <CourseDetailSkeleton type="loading" />;
  }

  if (!course) {
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
    </div>
  );
};

export default CourseDetail;
