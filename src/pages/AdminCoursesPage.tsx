
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllCoursesForAdmin } from '@/components/admin/courses/utils/courseUpdateUtils';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Loader2 } from 'lucide-react';
import { CoursesTable } from '@/components/admin/courses/CoursesTable';
import { CoursesPageHeader } from '@/components/admin/courses/CoursesPageHeader';

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const allCourses = await getAllCoursesForAdmin();
        setCourses(allCourses);
      } catch (err) {
        console.error('Error fetching all courses:', err);
        setError('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  const handleCourseStatusChange = (updatedCourse: ProfessionalCourse) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) =>
        c.id === updatedCourse.id ? updatedCourse : c
      )
    );
  };

  const handleCourseDelete = (courseId: string) => {
    setCourses((prevCourses) => prevCourses.filter((c) => c.id !== courseId));
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Բոլոր դասընթացները">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Բեռնում...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout pageTitle="Բոլոր դասընթացները">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Բոլոր դասընթացները">
      <div className="space-y-6">
        <CoursesPageHeader courseCount={courses.length} />
        <CoursesTable 
          courses={courses} 
          onStatusChange={handleCourseStatusChange}
          onDelete={handleCourseDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCoursesPage;
