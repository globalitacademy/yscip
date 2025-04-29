
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, Clock, Plus, Search } from 'lucide-react';

const MyProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('active');
  
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" />;
  }

  // Mock-up data for projects
  const projects = [
    {
      id: '1',
      title: 'Առցանց ուսուցման հարթակ',
      description: 'Վեբ հավելված դասընթացների կազմակերպման և անցկացման համար',
      status: 'active',
      progress: 60,
      techs: ['React', 'Node.js', 'MongoDB'],
      deadline: '2024-06-15',
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '2',
      title: 'Էլեկտրոնային առևտրի հարթակ',
      description: 'Վեբ խանութ պրոդուկտների առցանց գնման և վաճառքի համար',
      status: 'completed',
      progress: 100,
      techs: ['Vue.js', 'Express', 'PostgreSQL'],
      deadline: '2024-04-01',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    return project.status === activeTab;
  });

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const tabsListClass = theme === 'dark' ? 'bg-gray-700' : '';
  const tabsTriggerClass = theme === 'dark' ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100' : '';
  const projectCardClass = theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white';
  
  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';
    
    switch(status) {
      case 'active':
        return <Badge className={isDark ? "bg-blue-900/60 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700"}>Ընթացիկ</Badge>;
      case 'completed':
        return <Badge className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-50 text-green-700"}>Ավարտված</Badge>;
      case 'pending':
        return <Badge className={isDark ? "bg-amber-900/60 text-amber-300 border-amber-700" : "bg-yellow-50 text-yellow-700"}>Սպասման մեջ</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };
  
  return (
    <AdminLayout pageTitle="Իմ նախագծերը">
      <div className="space-y-6 animate-fade-in">
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Նախագծեր</CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                  Բոլոր նախագծերը, որոնց դուք մասնակցում եք
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Որոնել..." 
                    className={`pl-8 h-9 w-[200px] rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors ${theme === 'dark' ? 'border-gray-700 focus:border-gray-500 focus:ring-0 placeholder:text-gray-500' : ''}`} 
                  />
                </div>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Նոր նախագիծ
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`mb-4 ${tabsListClass}`}>
                <TabsTrigger value="all" className={tabsTriggerClass}>Բոլորը</TabsTrigger>
                <TabsTrigger value="active" className={tabsTriggerClass}>Ընթացիկ</TabsTrigger>
                <TabsTrigger value="completed" className={tabsTriggerClass}>Ավարտված</TabsTrigger>
                <TabsTrigger value="pending" className={tabsTriggerClass}>Սպասման մեջ</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map(project => (
                      <div key={project.id} className={`rounded-lg border overflow-hidden ${projectCardClass}`}>
                        <div className="relative">
                          <AspectRatio ratio={16/9}>
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="object-cover w-full h-full"
                            />
                          </AspectRatio>
                          <div className="absolute top-2 right-2">
                            {getStatusBadge(project.status)}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg mb-1">{project.title}</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                            {project.description}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Վերջնաժամկետ՝ {new Date(project.deadline).toLocaleDateString('hy-AM')}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.techs.map(tech => (
                              <span key={tech} className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden dark:bg-gray-700">
                            <div 
                              className={`h-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                            <span>Առաջընթաց՝ {project.progress}%</span>
                          </div>
                        </div>
                        <div className={`flex border-t ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                          <Button variant="ghost" className="flex-1 py-2 h-10 rounded-none">
                            <BookOpen className="h-4 w-4 mr-1" /> Դիտել
                          </Button>
                          <div className={`w-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                          <Button variant="ghost" className="flex-1 py-2 h-10 rounded-none">
                            <Code className="h-4 w-4 mr-1" /> Կոդ
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 border rounded-md ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'text-muted-foreground'}`}>
                    <p className="mb-2">Այս կատեգորիայում նախագծեր չկան։</p>
                    <Button variant="outline" className="mt-2">
                      <Plus className="h-4 w-4 mr-1" /> Ավելացնել նախագիծ
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MyProjectsPage;
