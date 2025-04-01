
import { useState, useEffect } from 'react';

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalCourses: number;
  totalOrganizations: number;
  pendingApplications: number;
  recentActivity: any[];
  usersByRole: any[];
  projectsByStatus: any[];
  monthlyStats: any[];
}

export const useAdminStats = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProjects: 0,
    totalCourses: 0,
    totalOrganizations: 0,
    pendingApplications: 0,
    recentActivity: [],
    usersByRole: [],
    projectsByStatus: [],
    monthlyStats: []
  });

  // Mock data for demonstration purposes
  // In a real app, this would be fetched from the backend
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalUsers: 1254,
          totalProjects: 432,
          totalCourses: 128,
          totalOrganizations: 85,
          pendingApplications: 18,
          recentActivity: [
            { id: 1, user: 'Արամ Պետրոսյան', action: 'ստեղծել է նոր դասընթաց', time: '2 ժամ առաջ' },
            { id: 2, user: 'Մարիամ Հակոբյան', action: 'թարմացրել է նախագիծը', time: '3 ժամ առաջ' },
            { id: 3, user: 'Գևորգ Սարգսյան', action: 'հաստատել է դիմումը', time: '5 ժամ առաջ' }
          ],
          usersByRole: [
            { name: 'Ուսանողներ', value: 64, color: '#8884d8' },
            { name: 'Դասախոսներ', value: 12, color: '#82ca9d' },
            { name: 'Ղեկավարներ', value: 8, color: '#ffc658' },
            { name: 'Գործատուներ', value: 6, color: '#ff8042' },
            { name: 'Ադմիններ', value: 2, color: '#0088fe' }
          ],
          projectsByStatus: [
            { name: 'Ընթացիկ', value: 42, color: '#0088FE' },
            { name: 'Ավարտված', value: 38, color: '#00C49F' },
            { name: 'Չսկսված', value: 20, color: '#FFBB28' }
          ],
          monthlyStats: [
            { name: 'Հնվ', users: 12, projects: 5, courses: 2 },
            { name: 'Փտվ', users: 19, projects: 7, courses: 3 },
            { name: 'Մրտ', users: 25, projects: 10, courses: 4 },
            { name: 'Ապր', users: 32, projects: 13, courses: 5 },
            { name: 'Մյս', users: 45, projects: 18, courses: 7 },
            { name: 'Հնս', users: 52, projects: 21, courses: 8 }
          ]
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { loading, stats };
};
