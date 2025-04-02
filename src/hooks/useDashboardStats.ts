
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    newUsersLastWeek: 0,
    projectCount: 0,
    newProjectsLastMonth: 0,
    courseCount: 0,
    newCoursesLastMonth: 0,
    usersByRole: [] as { name: string; value: number }[],
    projectsByStatus: [] as { name: string; value: number }[],
    recentRegistrations: [] as { date: string; count: number }[]
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user count
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, role, created_at');
          
        if (usersError) throw usersError;

        // Fetch project count
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id, created_at, is_public');
          
        if (projectsError) throw projectsError;
        
        // Fetch course count
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id, created_at');
          
        if (coursesError) throw coursesError;

        // Calculate new users in the last week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newUsers = users?.filter(user => 
          new Date(user.created_at) > oneWeekAgo
        ).length || 0;

        // Calculate new projects in the last month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const newProjects = projects?.filter(project => 
          new Date(project.created_at) > oneMonthAgo
        ).length || 0;
        
        // Calculate new courses in the last month
        const newCourses = courses?.filter(course => 
          new Date(course.created_at) > oneMonthAgo
        ).length || 0;

        // Calculate users by role
        const roleCount: Record<string, number> = {};
        users?.forEach(user => {
          const role = user.role || 'unknown';
          roleCount[role] = (roleCount[role] || 0) + 1;
        });

        const usersByRole = Object.entries(roleCount).map(([name, value]) => ({
          name: name === 'employer' ? 'Գործատուներ' : 
                name === 'admin' ? 'Ադմինիստրատորներ' : 
                name === 'student' ? 'Ուսանողներ' : 
                name === 'lecturer' ? 'Դասախոսներ' : 
                name === 'instructor' ? 'Հրահանգիչներ' : name,
          value
        }));

        // Calculate projects by status
        const publicProjects = projects?.filter(project => project.is_public).length || 0;
        const privateProjects = (projects?.length || 0) - publicProjects;

        const projectsByStatus = [
          { name: 'Հրապարակված', value: publicProjects },
          { name: 'Նախագծեր', value: privateProjects }
        ];

        // Calculate recent registrations (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const registrationsByDate: Record<string, number> = {};
        last7Days.forEach(date => {
          registrationsByDate[date] = 0;
        });

        users?.forEach(user => {
          const date = new Date(user.created_at).toISOString().split('T')[0];
          if (registrationsByDate[date] !== undefined) {
            registrationsByDate[date]++;
          }
        });

        const recentRegistrations = Object.entries(registrationsByDate).map(([date, count]) => ({
          date,
          count
        }));

        setStats({
          userCount: users?.length || 0,
          newUsersLastWeek: newUsers,
          projectCount: projects?.length || 0,
          newProjectsLastMonth: newProjects,
          courseCount: courses?.length || 0,
          newCoursesLastMonth: newCourses,
          usersByRole,
          projectsByStatus,
          recentRegistrations
        });

      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
