
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
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('pending');
  
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" />;
  }

  // Mock task data
  const tasks = [
    {
      id: '1',
      title: 'Ներկայացնել նախագծի նախնական պլանը',
      project: 'Առցանց ուսուցման համակարգ',
      dueDate: '2024-05-10',
      status: 'pending'
    },
    {
      id: '2',
      title: 'UI դիզայնի մշակում',
      project: 'Առցանց ուսուցման համակարգ',
      dueDate: '2024-05-15',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Գրել տեխնիկական փաստաթուղթը',
      project: 'Առցանց ուսուցման համակարգ',
      dueDate: '2024-05-05',
      status: 'completed'
    }
  ];

  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';
    
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className={isDark ? "bg-amber-900/60 text-amber-300 border-amber-700" : "bg-yellow-50 text-yellow-700 border-yellow-200"}>Կատարման ընթացքում</Badge>;
      case 'completed':
        return <Badge variant="outline" className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200"}>Ավարտված</Badge>;
      case 'overdue':
        return <Badge variant="outline" className={isDark ? "bg-red-900/60 text-red-300 border-red-700" : "bg-red-50 text-red-700 border-red-200"}>Ժամկետանց</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const tabsListClass = theme === 'dark' ? 'bg-gray-700' : '';
  const tabsTriggerClass = theme === 'dark' ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100' : '';
  const tableHeaderClass = theme === 'dark' ? 'bg-gray-900 text-gray-300' : '';
  const tableRowClass = theme === 'dark' ? 'hover:bg-gray-900/30 border-gray-700' : 'hover:bg-gray-100';

  return (
    <AdminLayout pageTitle="Հանձնարարություններ">
      <Card className={`animate-fade-in ${cardClass}`}>
        <CardHeader>
          <CardTitle>Իմ հանձնարարությունները</CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Դիտեք և կառավարեք ձեր բոլոր նախագծային հանձնարարությունները
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`mb-4 ${tabsListClass}`}>
              <TabsTrigger value="all" className={tabsTriggerClass}>Բոլորը</TabsTrigger>
              <TabsTrigger value="pending" className={tabsTriggerClass}>Ընթացիկ</TabsTrigger>
              <TabsTrigger value="completed" className={tabsTriggerClass}>Ավարտված</TabsTrigger>
              <TabsTrigger value="overdue" className={tabsTriggerClass}>Ժամկետանց</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredTasks.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className={tableHeaderClass}>
                      <TableRow className={theme === 'dark' ? 'border-gray-700' : ''}>
                        <TableHead>Վերնագիր</TableHead>
                        <TableHead>Նախագիծ</TableHead>
                        <TableHead>Վերջնաժամկետ</TableHead>
                        <TableHead>Կարգավիճակ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map(task => (
                        <TableRow key={task.id} className={tableRowClass}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>{task.project}</TableCell>
                          <TableCell>{new Date(task.dueDate).toLocaleDateString('hy-AM')}</TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className={`text-center py-8 rounded-md border ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-muted-foreground'}`}>
                  Այս պահին չկան հանձնարարություններ այս կատեգորիայում։
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default TasksPage;
