
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Loader2 } from 'lucide-react';
import { CoursesTable } from '@/components/admin/courses/CoursesTable';
import { CoursesPageHeader } from '@/components/admin/courses/CoursesPageHeader';
import { useCourseService } from '@/hooks/courseService';
import { toast } from 'sonner';

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ProfessionalCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchAllCourses, loading, error } = useCourseService();

  // Load courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const allCourses = await fetchAllCourses();
        setCourses(allCourses);
        setFilteredCourses(allCourses);
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    };

    loadCourses();
  }, [fetchAllCourses]);

  // Filter courses when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(query) || 
      (course.description && course.description.toLowerCase().includes(query)) ||
      (course.createdBy && course.createdBy.toLowerCase().includes(query))
    );
    
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleCourseStatusChange = (updatedCourse: ProfessionalCourse) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) =>
        c.id === updatedCourse.id ? updatedCourse : c
      )
    );
    setFilteredCourses((prevCourses) =>
      prevCourses.map((c) =>
        c.id === updatedCourse.id ? updatedCourse : c
      )
    );
    toast.success("Դասընթացի կարգավիճակը հաջողությամբ փոփոխվեց");
  };

  const handleCourseDelete = (courseId: string) => {
    setCourses((prevCourses) => prevCourses.filter((c) => c.id !== courseId));
    setFilteredCourses((prevCourses) => prevCourses.filter((c) => c.id !== courseId));
    toast.success("Դասընթացը հաջողությամբ ջնջվեց");
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
        <CoursesPageHeader 
          courseCount={courses.length} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        
        <CoursesTable 
          courses={filteredCourses} 
          onStatusChange={handleCourseStatusChange}
          onDelete={handleCourseDelete}
        />
        
        {filteredCourses.length === 0 && searchQuery && (
          <div className="text-center py-8 border rounded-md bg-muted/10">
            <p className="text-muted-foreground">Որոնման արդյունքում դասընթացներ չեն գտնվել</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-primary hover:underline mt-2"
            >
              Մաքրել որոնումը
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoursesPage;
