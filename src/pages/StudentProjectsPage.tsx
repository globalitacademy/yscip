
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, FolderGit2, Plus } from 'lucide-react';

const StudentProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  
  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return <Navigate to="/login" />;
  }

  // Mock student projects data
  const projects = [
    {
      id: '1',
      title: 'Ուսումնական հարթակի մշակում',
      student: 'Արամ Պողոսյան',
      course: 'Վեբ ծրագրավորում',
      stage: 'development',
      progress: 45,
      dueDate: '2024-06-15'
    },
    {
      id: '2',
      title: 'Բջջային հավելվածի ստեղծում',
      student: 'Մարիամ Սարգսյան',
      course: 'Մոբայլ հավելվածների մշակում',
      stage: 'planning',
      progress: 20,
      dueDate: '2024-07-10'
    },
    {
      id: '3',
      title: 'Տվյալների վերլուծության համակարգ',
      student: 'Դավիթ Մարտիրոսյան',
      course: 'Տվյալների վերլուծություն',
      stage: 'completed',
      progress: 100,
      dueDate: '2024-04-30'
    }
  ];

  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';
    
    switch(status) {
      case 'planning':
        return <Badge variant="outline" className={isDark ? "bg-blue-900/60 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700 border-blue-200"}>Պլանավորում</Badge>;
      case 'development':
        return <Badge variant="outline" className={isDark ? "bg-amber-900/60 text-amber-300 border-amber-700" : "bg-yellow-50 text-yellow-700 border-yellow-200"}>Մշակում</Badge>;
      case 'completed':
        return <Badge variant="outline" className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200"}>Ավարտված</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab !== 'all') {
      if (activeTab === 'active' && project.stage === 'completed') return false;
      if (activeTab === 'completed' && project.stage !== 'completed') return false;
    }
    
    return (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           project.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
           project.course.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const tabsListClass = theme === 'dark' ? 'bg-gray-700' : '';
  const tabsTriggerClass = theme === 'dark' ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100' : '';
  const tableHeaderClass = theme === 'dark' ? 'bg-gray-900 text-gray-300' : '';
  const tableRowClass = theme === 'dark' ? 'hover:bg-gray-900/30 border-gray-700' : 'hover:bg-gray-100';

  return (
    <AdminLayout pageTitle="Ուսանողների նախագծեր">
      <Card className={`animate-fade-in ${cardClass}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ուսանողների նախագծեր</CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
              Կառավարեք ուսանողների նախագծերը և հետևեք առաջընթացին
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Նոր նախագիծ
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Փնտրել..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`mb-4 ${tabsListClass}`}>
                <TabsTrigger value="all" className={tabsTriggerClass}>Բոլորը</TabsTrigger>
                <TabsTrigger value="active" className={tabsTriggerClass}>Ընթացիկ</TabsTrigger>
                <TabsTrigger value="completed" className={tabsTriggerClass}>Ավարտված</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {filteredProjects.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className={tableHeaderClass}>
                        <TableRow className={theme === 'dark' ? 'border-gray-700' : ''}>
                          <TableHead>Նախագիծ</TableHead>
                          <TableHead>Ուսանող</TableHead>
                          <TableHead>Կուրս</TableHead>
                          <TableHead>Փուլ</TableHead>
                          <TableHead>Առաջընթաց</TableHead>
                          <TableHead>Վերջնաժամկետ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map(project => (
                          <TableRow key={project.id} className={tableRowClass}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>{project.student}</TableCell>
                            <TableCell>{project.course}</TableCell>
                            <TableCell>{getStatusBadge(project.stage)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                                    }`} 
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs whitespace-nowrap">{project.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(project.dueDate).toLocaleDateString('hy-AM')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className={`flex flex-col items-center justify-center py-12 text-center rounded-md border ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-muted-foreground'}`}>
                    <FolderGit2 className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">Նախագծեր չեն գտնվել</h3>
                    <p className="text-sm mt-1 max-w-sm">
                      Այս պահին չկան նախագծեր այս կատեգորիայում կամ ձեր որոնման արդյունքներում։
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default StudentProjectsPage;
