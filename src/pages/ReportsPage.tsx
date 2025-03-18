
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
  created_by: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface ReportData {
  projectStats: {
    active: number;
    completed: number;
    total: number;
  };
  userStats: {
    students: number;
    instructors: number;
    supervisors: number;
    employers: number;
    total: number;
  };
  taskStats: {
    todo: number;
    inProgress: number;
    completed: number;
    total: number;
  };
  recentProjects: Project[];
  monthlyData: {
    name: string;
    projects: number;
    users: number;
  }[];
  taskCompletionData: {
    name: string;
    completion: number;
  }[];
}

const ReportsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    projectStats: { active: 0, completed: 0, total: 0 },
    userStats: { students: 0, instructors: 0, supervisors: 0, employers: 0, total: 0 },
    taskStats: { todo: 0, inProgress: 0, completed: 0, total: 0 },
    recentProjects: [],
    monthlyData: [],
    taskCompletionData: []
  });

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        // Fetch projects
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
        }
        
        // Fetch users
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*');
        
        if (usersError) {
          console.error('Error fetching users:', usersError);
        }
        
        // Fetch tasks
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('*');
        
        if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
        }
        
        // Generate report data
        const projectsData = projects || [];
        const usersData = users || [];
        const tasksData = tasks || [];
        
        // Project stats
        const completedProjects = 0; // This would be based on a status field
        const activeProjects = projectsData.length;
        
        // User stats
        const studentUsers = usersData.filter(u => u.role === 'student').length;
        const instructorUsers = usersData.filter(u => u.role === 'instructor' || u.role === 'lecturer').length;
        const supervisorUsers = usersData.filter(u => u.role === 'supervisor' || u.role === 'project_manager').length;
        const employerUsers = usersData.filter(u => u.role === 'employer').length;
        
        // Task stats
        const todoTasks = tasksData.filter(t => t.status === 'todo').length;
        const inProgressTasks = tasksData.filter(t => t.status === 'in-progress').length;
        const completedTasks = tasksData.filter(t => t.status === 'completed').length;
        
        // Generate monthly data (simplified version)
        const months = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս'];
        const monthlyData = months.map((name, index) => {
          // Here we would typically aggregate data by month from our DB
          // For demo, using simple calculations based on index
          return {
            name,
            projects: Math.max(3, Math.round(projectsData.length / 6 * (index + 1))),
            users: Math.max(10, Math.round(usersData.length / 6 * (index + 1)))
          };
        });
        
        // Generate task completion data (simplified)
        const taskCompletionData = months.map((name, index) => {
          // Calculate completion percentage (simplified for demo)
          const completionPercent = Math.min(100, 50 + index * 7);
          return {
            name,
            completion: completionPercent
          };
        });
        
        // Set report data
        setReportData({
          projectStats: {
            active: activeProjects,
            completed: completedProjects,
            total: activeProjects + completedProjects
          },
          userStats: {
            students: studentUsers,
            instructors: instructorUsers,
            supervisors: supervisorUsers,
            employers: employerUsers,
            total: usersData.length
          },
          taskStats: {
            todo: todoTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
            total: tasksData.length
          },
          recentProjects: projectsData.slice(0, 5) as Project[],
          monthlyData,
          taskCompletionData
        });
      } catch (error) {
        console.error('Error generating report data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Հաշվետվություններ">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Հաշվետվություններ">
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Ընդհանուր</TabsTrigger>
            <TabsTrigger value="projects">Նախագծեր</TabsTrigger>
            <TabsTrigger value="students">Ուսանողներ</TabsTrigger>
            <TabsTrigger value="tasks">Առաջադրանքներ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ընդհանուր նախագծեր</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.projectStats.total}</div>
                  <p className="text-xs text-muted-foreground">{reportData.projectStats.active} ակտիվ նախագիծ</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ակտիվ ուսանողներ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.userStats.students}</div>
                  <p className="text-xs text-muted-foreground">Ընդհանուր {reportData.userStats.total} օգտատեր</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ավարտված նախագծեր</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.projectStats.completed}</div>
                  <p className="text-xs text-muted-foreground">{Math.round(reportData.projectStats.completed / Math.max(1, reportData.projectStats.total) * 100)}% բոլոր նախագծերից</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Կատարված առաջադրանքներ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.taskStats.completed}</div>
                  <p className="text-xs text-muted-foreground">{Math.round(reportData.taskStats.completed / Math.max(1, reportData.taskStats.total) * 100)}% բոլոր առաջադրանքներից</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Նախագծեր և օգտատերեր ըստ ամիսների</CardTitle>
                  <CardDescription>Նոր նախագծերի և օգտատերերի քանակն ըստ ամիսների</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="projects" name="Նախագծեր" fill="#8884d8" />
                      <Bar dataKey="users" name="Օգտատերեր" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Առաջադրանքների կատարում</CardTitle>
                  <CardDescription>Առաջադրանքների կատարման տոկոսն ըստ ամիսների</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="completion" name="Կատարում %" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Վերջին նախագծեր</CardTitle>
                <CardDescription>Վերջին ավելացված նախագծերի ցանկը</CardDescription>
              </CardHeader>
              <CardContent>
                {reportData.recentProjects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-10">Դեռ նախագծեր չկան</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Անվանում</TableHead>
                        <TableHead>Կատեգորիա</TableHead>
                        <TableHead>Ստեղծված</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.recentProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>{new Date(project.created_at).toLocaleDateString('hy-AM')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Նախագծերի հաշվետվություն</CardTitle>
                <CardDescription>Մանրամասն տվյալներ բոլոր նախագծերի վերաբերյալ</CardDescription>
              </CardHeader>
              <CardContent>
                {reportData.recentProjects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-10">Դեռ նախագծեր չկան բազայում</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Անվանում</TableHead>
                        <TableHead>Կատեգորիա</TableHead>
                        <TableHead>Ստեղծված</TableHead>
                        <TableHead>Նկարագրություն</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.recentProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>{new Date(project.created_at).toLocaleDateString('hy-AM')}</TableCell>
                          <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Ուսանողների հաշվետվություն</CardTitle>
                <CardDescription>Ուսանողների առաջադիմության և ակտիվության տվյալներ</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Համակարգում գրանցված է {reportData.userStats.students} ուսանող։
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Օգտատերերի դերերի բաշխում</h3>
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span>Ուսանողներ:</span>
                        <span>{reportData.userStats.students}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Դասախոսներ:</span>
                        <span>{reportData.userStats.instructors}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Ղեկավարներ:</span>
                        <span>{reportData.userStats.supervisors}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Գործատուներ:</span>
                        <span>{reportData.userStats.employers}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Առաջադրանքների հաշվետվություն</CardTitle>
                <CardDescription>Առաջադրանքների կատարման և ժամկետների վերաբերյալ տվյալներ</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Համակարգում գրանցված է {reportData.taskStats.total} առաջադրանք։
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Առաջադրանքների կարգավիճակ</h3>
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span>Սպասվող:</span>
                        <span>{reportData.taskStats.todo}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Ընթացքում:</span>
                        <span>{reportData.taskStats.inProgress}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Ավարտված:</span>
                        <span>{reportData.taskStats.completed}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
