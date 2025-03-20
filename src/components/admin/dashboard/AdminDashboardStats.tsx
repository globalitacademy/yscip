
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Clock, BookOpen } from 'lucide-react';

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalLecturers: number;
  totalGroups: number;
  totalCourses: number;
  totalProjects: number;
}

const AdminDashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalLecturers: 0,
    totalGroups: 0,
    totalCourses: 0,
    totalProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Count total users
        const { count: totalUsers, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Count total students
        const { count: totalStudents, error: studentsError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student');

        // Count total lecturers
        const { count: totalLecturers, error: lecturersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .in('role', ['lecturer', 'instructor']);

        // Count total groups
        const { count: totalGroups, error: groupsError } = await supabase
          .from('groups')
          .select('*', { count: 'exact', head: true });

        // Count total courses
        const { count: totalCourses, error: coursesError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        // Count total projects
        const { count: totalProjects, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        if (usersError || studentsError || lecturersError || groupsError || coursesError || projectsError) {
          console.error('Error fetching stats:', { 
            usersError, studentsError, lecturersError, groupsError, coursesError, projectsError
          });
          return;
        }

        setStats({
          totalUsers: totalUsers || 0,
          totalStudents: totalStudents || 0,
          totalLecturers: totalLecturers || 0,
          totalGroups: totalGroups || 0,
          totalCourses: totalCourses || 0,
          totalProjects: totalProjects || 0
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscription for updates
    const usersChannel = supabase
      .channel('dashboard-stats-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: '*' },
        () => {
          // Refresh stats when any table changes
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="h-6 bg-gray-200 rounded"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-12 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">Օգտատերեր</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Ուսանողներ: {stats.totalStudents}, Դասախոսներ: {stats.totalLecturers}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">Խմբեր</CardTitle>
          <Users className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGroups}</div>
          <p className="text-xs text-muted-foreground">
            Ակտիվ ուսումնական խմբերի քանակ
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">Դասընթացներ</CardTitle>
          <BookOpen className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCourses}</div>
          <p className="text-xs text-muted-foreground">
            Ակտիվ դասընթացների քանակ
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">Նախագծեր</CardTitle>
          <GraduationCap className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProjects}</div>
          <p className="text-xs text-muted-foreground">
            Ակտիվ նախագծերի քանակ
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">Ակտիվ սեսիա</CardTitle>
          <Clock className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Տարի 2024</div>
          <p className="text-xs text-muted-foreground">
            Ընթացիկ ուսումնական տարի
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardStats;
