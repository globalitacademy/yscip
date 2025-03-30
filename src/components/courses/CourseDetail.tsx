
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
          setCourse(courseData);
        } else {
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
    toast.success('Դիմումն ուղարկված է');
  };

  if (loading) {
    return <CourseDetailSkeleton type="loading" />;
  }

  if (!course) {
    return <CourseDetailSkeleton type="not-found" />;
  }

  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header Banner */}
      <CourseBanner course={course} canEdit={canEdit} handleApply={handleApply} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList className="mb-6">
              <TabsTrigger value="description">Նկարագրություն</TabsTrigger>
              <TabsTrigger value="curriculum">Դասընթացի պլան</TabsTrigger>
              <TabsTrigger value="outcomes">Ակնկալվող արդյունքներ</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6">
              <CourseDescription course={course} />
            </TabsContent>

            <TabsContent value="curriculum">
              <CourseCurriculumTab course={course} />
            </TabsContent>

            <TabsContent value="outcomes">
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
