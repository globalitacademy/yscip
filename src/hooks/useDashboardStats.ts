
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  userCount: number;
  courseCount: number;
  projectCount: number;
  newUsersLastWeek: number;
  newCoursesLastMonth: number;
  newProjectsLastMonth: number;
  usersByRole: {
    name: string;
    value: number;
    color: string;
  }[];
  registrationsByMonth: {
    name: string;
    count: number;
  }[];
  projectsByStatus: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    userCount: 0,
    courseCount: 0,
    projectCount: 0,
    newUsersLastWeek: 0,
    newCoursesLastMonth: 0,
    newProjectsLastMonth: 0,
    usersByRole: [],
    registrationsByMonth: [],
    projectsByStatus: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch total user count
        const { count: userCount, error: userError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true });

        if (userError) throw userError;

        // Fetch new users in the last week
        const lastWeekDate = new Date();
        lastWeekDate.setDate(lastWeekDate.getDate() - 7);
        
        const { count: newUsersCount, error: newUsersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', lastWeekDate.toISOString());

        if (newUsersError) throw newUsersError;

        // Fetch projects count
        const { count: projectCount, error: projectError } = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true });

        if (projectError) throw projectError;

        // Fetch new projects in the last month
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        
        const { count: newProjectsCount, error: newProjectsError } = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', lastMonthDate.toISOString());

        if (newProjectsError) throw newProjectsError;

        // Fetch users by role
        const { data: usersByRoleData, error: usersByRoleError } = await supabase
          .from('users')
          .select('role')
          .not('role', 'is', null);

        if (usersByRoleError) throw usersByRoleError;

        // Calculate count for each role
        const roleColors = {
          student: '#8884d8',
          lecturer: '#82ca9d',
          instructor: '#82ca9d',
          supervisor: '#ffc658',
          project_manager: '#ffc658',
          employer: '#ff8042',
          admin: '#83a6ed'
        };

        const roleCounts: Record<string, number> = {};
        usersByRoleData.forEach(user => {
          const role = user.role;
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        });

        // Group lecturers and instructors into "Դասախոսներ"
        // Group supervisors and project managers into "Ղեկավարներ"
        const lecturerCount = (roleCounts['lecturer'] || 0) + (roleCounts['instructor'] || 0);
        const supervisorCount = (roleCounts['supervisor'] || 0) + (roleCounts['project_manager'] || 0);

        const usersByRole = [
          { name: 'Ուսանողներ', value: roleCounts['student'] || 0, color: roleColors.student },
          { name: 'Դասախոսներ', value: lecturerCount, color: roleColors.lecturer },
          { name: 'Ղեկավարներ', value: supervisorCount, color: roleColors.supervisor },
          { name: 'Գործատուներ', value: roleCounts['employer'] || 0, color: roleColors.employer },
          { name: 'Ադմիններ', value: roleCounts['admin'] || 0, color: roleColors.admin }
        ];

        // For course count, fetch distinct courses from users
        const { data: coursesData, error: coursesError } = await supabase
          .from('users')
          .select('course')
          .not('course', 'is', null);

        if (coursesError) throw coursesError;

        const uniqueCourses = new Set(coursesData.map(item => item.course).filter(Boolean));
        const courseCount = uniqueCourses.size;

        // For new courses in the last month, query based on created_at of users with new courses
        const { count: newCoursesCount, error: newCoursesCountError } = await supabase
          .from('users')
          .select('course', { count: 'exact', head: true })
          .not('course', 'is', null)
          .gte('created_at', lastMonthDate.toISOString());

        const newCoursesLastMonth = newCoursesCountError ? 0 : (newCoursesCount || 0);

        // Fetch registration data for the last 6 months
        const registrationsByMonth = await getMonthlyRegistrations();

        // Fetch project status data
        const projectsByStatus = await getProjectsByStatus();

        // Update stats state
        setStats({
          userCount: userCount || 0,
          courseCount,
          projectCount: projectCount || 0,
          newUsersLastWeek: newUsersCount || 0,
          newCoursesLastMonth,
          newProjectsLastMonth: newProjectsCount || 0,
          usersByRole,
          registrationsByMonth,
          projectsByStatus
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Սխալ է տեղի ունեցել վիճակագրությունը բեռնելիս։');
      } finally {
        setLoading(false);
      }
    };

    // Helper function to get monthly registrations
    const getMonthlyRegistrations = async () => {
      const months = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 
                    'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
      
      const currentDate = new Date();
      const registrationsByMonth = [];
      
      // Get data for the last 6 months
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(currentDate);
        monthDate.setMonth(currentDate.getMonth() - i);
        
        const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const { count, error } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());
        
        if (error) {
          console.error('Error fetching monthly registrations:', error);
          continue;
        }
        
        registrationsByMonth.push({
          name: months[monthDate.getMonth()],
          count: count || 0
        });
      }
      
      return registrationsByMonth;
    };

    // Helper function to get projects by status
    const getProjectsByStatus = async () => {
      try {
        // Get projects with different statuses
        const { data: projectAssignments, error } = await supabase
          .from('project_assignments')
          .select('status');
        
        if (error) throw error;
        
        const statusCounts: Record<string, number> = {};
        
        if (projectAssignments && projectAssignments.length > 0) {
          projectAssignments.forEach(assignment => {
            const status = assignment.status || 'pending';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
          });
        }

        // Map statuses to Armenian language
        const statusMap: Record<string, string> = {
          'completed': 'Ավարտված',
          'in_progress': 'Ընթացքում',
          'pending': 'Սպասման մեջ'
        };
        
        // Map colors for different statuses
        const statusColors: Record<string, string> = {
          'completed': '#8884d8',
          'in_progress': '#82ca9d',
          'pending': '#ffc658'
        };
        
        return Object.entries(statusCounts).map(([status, count]) => ({
          name: statusMap[status] || status,
          value: count,
          color: statusColors[status] || '#aaa'
        }));
      } catch (error) {
        console.error('Error fetching projects by status:', error);
        return [
          { name: 'Ընթացքում', value: 0, color: '#82ca9d' },
          { name: 'Ավարտված', value: 0, color: '#8884d8' },
          { name: 'Սպասման մեջ', value: 0, color: '#ffc658' }
        ];
      }
    };

    fetchStats();
    
    // Set up real-time subscription for dashboard updates
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        // Refresh stats when database changes
        fetchStats();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading };
};
