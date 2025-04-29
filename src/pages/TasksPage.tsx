
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
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
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Կատարման ընթացքում</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ավարտված</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ժամկետանց</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  return (
    <AdminLayout pageTitle="Հանձնարարություններ">
      <Card>
        <CardHeader>
          <CardTitle>Իմ հանձնարարությունները</CardTitle>
          <CardDescription>
            Դիտեք և կառավարեք ձեր բոլոր նախագծային հանձնարարությունները
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Բոլորը</TabsTrigger>
              <TabsTrigger value="pending">Ընթացիկ</TabsTrigger>
              <TabsTrigger value="completed">Ավարտված</TabsTrigger>
              <TabsTrigger value="overdue">Ժամկետանց</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredTasks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Վերնագիր</TableHead>
                      <TableHead>Նախագիծ</TableHead>
                      <TableHead>Վերջնաժամկետ</TableHead>
                      <TableHead>Կարգավիճակ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map(task => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.project}</TableCell>
                        <TableCell>{new Date(task.dueDate).toLocaleDateString('hy-AM')}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
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
