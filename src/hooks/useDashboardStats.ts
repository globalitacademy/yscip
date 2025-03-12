
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
          .not('role', 'is', null);  // Fixed: using the correct filter syntax

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

        // For course count, let's use a distinct count from users' course field
        const { data: coursesData, error: coursesError } = await supabase
          .from('users')
          .select('course')
          .not('course', 'is', null); // Fixed: using the correct filter syntax

        if (coursesError) throw coursesError;

        const uniqueCourses = new Set(coursesData.map(item => item.course).filter(Boolean));
        const courseCount = uniqueCourses.size;

        // For new courses, we don't have a created_at for courses directly
        // so we'll use a fixed number for now
        const newCoursesLastMonth = 2;

        // Mock monthly registrations data
        // In a real system, this would come from aggregated database queries
        const months = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս'];
        
        // Get current month index (0-based)
        const currentMonth = new Date().getMonth();
        
        // Generate data for the last 6 months
        const registrationsByMonth = [];
        
        for (let i = 5; i >= 0; i--) {
          // Calculate the month index, wrapping around to previous year if needed
          const monthIndex = (currentMonth - i + 12) % 12;
          
          // For this example, we'll generate some random data that looks realistic
          // In a real implementation, we would query the database for users created in each month
          const monthlyCount = Math.floor(Math.random() * 40) + 10; // Random number between 10-50
          
          registrationsByMonth.push({
            name: months[monthIndex % months.length],
            count: monthlyCount
          });
        }

        // Mock project status data
        // In a real system, this would come from project status field
        const projectsByStatus = [
          { name: 'Ընթացքում', value: 14, color: '#82ca9d' },
          { name: 'Ավարտված', value: 22, color: '#8884d8' },
          { name: 'Սպասման մեջ', value: 8, color: '#ffc658' }
        ];

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

    fetchStats();
  }, []);

  return { stats, loading };
};
