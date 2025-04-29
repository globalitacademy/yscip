
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, FileText, CheckCircle, AlertCircle, Clock, Folder } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Progress } from '@/components/ui/progress';

interface Project {
  id: string;
  title: string;
  student: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'reviewed';
  progress: number;
  lastUpdated: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Կառավարման տեղեկատվական համակարգի մշակում',
    student: 'Արամ Հակոբյան',
    deadline: '2025-06-15',
    status: 'in_progress',
    progress: 45,
    lastUpdated: '2025-04-22'
  },
  {
    id: '2',
    title: 'Առցանց ուսուցման հարթակի մշակում',
    student: 'Մարիամ Պետրոսյան',
    deadline: '2025-05-30',
    status: 'pending',
    progress: 10,
    lastUpdated: '2025-04-18'
  },
  {
    id: '3',
    title: 'Ինտերնետ խանութ վեբ հավելվածի մշակում',
    student: 'Դավիթ Մկրտչյան',
    deadline: '2025-07-10',
    status: 'completed',
    progress: 100,
    lastUpdated: '2025-04-20'
  },
  {
    id: '4',
    title: 'Բջջային հավելված քաղաքային տրանսպորտի համար',
    student: 'Նարե Գրիգորյան',
    deadline: '2025-06-25',
    status: 'reviewed',
    progress: 100,
    lastUpdated: '2025-04-15'
  }
];

const LecturerStudentProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects based on search term and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap">Սպասում է</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap">Ընթացքի մեջ</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 whitespace-nowrap">Ավարտված</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 whitespace-nowrap">Դիտարկված</Badge>;
      default:
        return null;
    }
  };

  const handleReviewProject = (project: Project) => {
    setSelectedProject(project);
    toast.success(`Նախագիծը նշված է դիտարկված`, {
      description: `"${project.title}" նախագիծը հաջողությամբ նշված է դիտարկված:`,
    });
    // Update project status in state
    setProjects(prevProjects =>
      prevProjects.map(p => p.id === project.id ? { ...p, status: 'reviewed' as const } : p)
    );
  };

  const handleProvideAssistance = (project: Project) => {
    toast.success(`Հաղորդագրությունը ուղարկված է`, {
      description: `Ուսանողը կստանա ձեր օգնության առաջարկը:`,
    });
  };

  return (
    <AdminLayout pageTitle="Ուսանողների նախագծեր">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Փնտրել նախագիծ կամ ուսանող..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Բոլոր կարգավիճակները" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Բոլորը</SelectItem>
              <SelectItem value="pending">Սպասում է</SelectItem>
              <SelectItem value="in_progress">Ընթացքի մեջ</SelectItem>
              <SelectItem value="completed">Ավարտված</SelectItem>
              <SelectItem value="reviewed">Դիտարկված</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Քարտեր
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Ցանկ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">Նախագծեր չեն գտնվել</p>
              </div>
            ) : (
              filteredProjects.map(project => (
                <Card key={project.id} className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {getStatusBadge(project.status)}
                    </div>
                    <CardDescription className="mt-1">
                      Ուսանող: {project.student}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-4 flex-grow">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Առաջընթաց</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Վերջնաժամկետ:</span>
                          </div>
                          <span>{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span>Վերջին թարմացում:</span>
                          <span>{new Date(project.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      {project.status === 'completed' && (
                        <Button 
                          onClick={() => handleReviewProject(project)}
                          variant="outline"
                          className="w-full"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Նշել դիտարկված
                        </Button>
                      )}
                      {project.status !== 'reviewed' && (
                        <Button
                          onClick={() => handleProvideAssistance(project)}
                          variant={project.status === 'completed' ? "outline" : "default"}
                          className="w-full"
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Օգնել
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3">Նախագծի անվանում</th>
                      <th className="px-6 py-3">Ուսանող</th>
                      <th className="px-6 py-3">Կարգավիճակ</th>
                      <th className="px-6 py-3">Առաջընթաց</th>
                      <th className="px-6 py-3">Վերջնաժամկետ</th>
                      <th className="px-6 py-3">Գործողություններ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          Նախագծեր չեն գտնվել
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map(project => (
                        <tr key={project.id} className="border-b">
                          <td className="px-6 py-4 font-medium">{project.title}</td>
                          <td className="px-6 py-4">{project.student}</td>
                          <td className="px-6 py-4">{getStatusBadge(project.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="h-2 w-24" />
                              <span className="whitespace-nowrap">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{new Date(project.deadline).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {project.status === 'completed' && (
                                <Button 
                                  onClick={() => handleReviewProject(project)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Նշել դիտարկված
                                </Button>
                              )}
                              {project.status !== 'reviewed' && (
                                <Button
                                  onClick={() => handleProvideAssistance(project)}
                                  variant={project.status === 'completed' ? "outline" : "secondary"}
                                  size="sm"
                                >
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Օգնել
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default LecturerStudentProjectsPage;
