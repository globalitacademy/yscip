
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const ReportsPage: React.FC = () => {
  // Sample data for reports
  const projectData = [
    { name: 'Հունվար', completed: 4, active: 7 },
    { name: 'Փետրվար', completed: 3, active: 8 },
    { name: 'Մարտ', completed: 5, active: 9 },
    { name: 'Ապրիլ', completed: 6, active: 10 },
    { name: 'Մայիս', completed: 7, active: 8 },
    { name: 'Հունիս', completed: 9, active: 7 },
  ];

  const taskCompletionData = [
    { name: 'Հունվար', completion: 65 },
    { name: 'Փետրվար', completion: 59 },
    { name: 'Մարտ', completion: 80 },
    { name: 'Ապրիլ', completion: 81 },
    { name: 'Մայիս', completion: 76 },
    { name: 'Հունիս', completion: 85 },
  ];

  // Sample data for the recent projects table
  const recentProjects = [
    { id: 1, title: 'Էլեկտրոնային առևտրի հարթակ', students: 4, completed: '85%', date: '2024-05-15' },
    { id: 2, title: 'CRM համակարգ', students: 3, completed: '60%', date: '2024-06-20' },
    { id: 3, title: 'Մոբայլ հավելված', students: 5, completed: '45%', date: '2024-07-10' },
    { id: 4, title: 'Տվյալների վերլուծության գործիք', students: 2, completed: '90%', date: '2024-05-30' },
    { id: 5, title: 'Խաղային հավելված', students: 6, completed: '30%', date: '2024-08-15' },
  ];

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
                  <div className="text-2xl font-bold">125</div>
                  <p className="text-xs text-muted-foreground">+12% նախորդ ամսվա համեմատ</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ակտիվ ուսանողներ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">324</div>
                  <p className="text-xs text-muted-foreground">+4% նախորդ ամսվա համեմատ</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ավարտված նախագծեր</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68</div>
                  <p className="text-xs text-muted-foreground">+18% նախորդ ամսվա համեմատ</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Կատարված առաջադրանքներ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">842</div>
                  <p className="text-xs text-muted-foreground">+6% նախորդ ամսվա համեմատ</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Նախագծեր ըստ ամիսների</CardTitle>
                  <CardDescription>Ավարտված և ակտիվ նախագծերի քանակն ըստ ամիսների</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Ավարտված" fill="#8884d8" />
                      <Bar dataKey="active" name="Ակտիվ" fill="#82ca9d" />
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
                    <LineChart data={taskCompletionData}>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Անվանում</TableHead>
                      <TableHead>Ուսանողներ</TableHead>
                      <TableHead>Ավարտված %</TableHead>
                      <TableHead>Վերջնաժամկետ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.students}</TableCell>
                        <TableCell>{project.completed}</TableCell>
                        <TableCell>{new Date(project.date).toLocaleDateString('hy-AM')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <p className="text-muted-foreground mb-4">
                  Այս բաժնում կարող եք դիտել նախագծերի մանրամասն հաշվետվությունները։
                </p>
                {/* Additional project specific reports would go here */}
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
                  Այս բաժնում կարող եք դիտել ուսանողների առաջադիմության հաշվետվությունները։
                </p>
                {/* Additional student specific reports would go here */}
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
                  Այս բաժնում կարող եք դիտել առաջադրանքների կատարման հաշվետվությունները։
                </p>
                {/* Additional task specific reports would go here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
