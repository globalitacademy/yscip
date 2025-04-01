
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllCoursesForAdmin } from '@/components/admin/courses/utils/courseUpdateUtils';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Loader2, Eye, EyeOff, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  const toggleCoursePublishStatus = async (course: ProfessionalCourse) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_public: !course.is_public })
        .eq('id', course.id);

      if (error) {
        console.error('Error toggling course status:', error);
        toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
        return;
      }

      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c.id === course.id ? { ...c, is_public: !c.is_public } : c
        )
      );

      toast.success(
        course.is_public
          ? 'Դասընթացը դարձել է անտեսանելի օգտագործողների համար'
          : 'Դասընթացը հաջողությամբ հրապարակվել է'
      );
    } catch (err) {
      console.error('Error toggling course status:', err);
      toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const deleteCourse = async (course: ProfessionalCourse) => {
    if (!window.confirm(`Իսկապե՞ս ցանկանում եք ջնջել "${course.title}" դասընթացը:`)) {
      return;
    }

    try {
      // Delete related records first
      await Promise.allSettled([
        supabase.from('course_lessons').delete().eq('course_id', course.id),
        supabase.from('course_requirements').delete().eq('course_id', course.id),
        supabase.from('course_outcomes').delete().eq('course_id', course.id)
      ]);
      
      // Delete the main course record
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);
        
      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      setCourses((prevCourses) => prevCourses.filter((c) => c.id !== course.id));
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
    }
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Բոլոր դասընթացները ({courses.length})</h1>
          <Button asChild>
            <Link to="/courses/create">Ստեղծել նոր դասընթաց</Link>
          </Button>
        </div>

        {courses.length === 0 ? (
          <div className="bg-muted p-8 text-center rounded-md">
            <p className="text-muted-foreground">Դասընթացներ չկան: Ստեղծեք ձեր առաջին դասընթացը:</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Վերնագիր</TableHead>
                  <TableHead>Ստեղծողը</TableHead>
                  <TableHead>Տևողություն</TableHead>
                  <TableHead>Արժեք</TableHead>
                  <TableHead>Կարգավիճակ</TableHead>
                  <TableHead className="text-right">Գործողություններ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.createdBy || 'Անհայտ'}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>{course.price}</TableCell>
                    <TableCell>
                      <Badge variant={course.is_public ? "success" : "secondary"}>
                        {course.is_public ? 'Հրապարակված' : 'Թաքցված'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/course/${course.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/admin/courses/${course.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleCoursePublishStatus(course)}
                        >
                          {course.is_public ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteCourse(course)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoursesPage;
