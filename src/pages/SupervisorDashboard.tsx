
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return <Navigate to="/login" />;
  }

  return (
    <AdminLayout pageTitle="Ղեկավարի վահանակ">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ղեկավարվող ուսանողներ
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Ընդհանուր ուսանողներ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Թեմայի հարցումներ
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M15 6h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5" />
              <path d="M12 4v16" />
              <path d="M9 4v16" />
              <path d="M3 10h3" />
              <path d="M3 14h3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Սպասման մեջ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ակտիվ նախագծեր
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Ընթացիկ ակտիվ նախագծեր
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Նախագծեր</TabsTrigger>
          <TabsTrigger value="requests">Հարցումներ</TabsTrigger>
          <TabsTrigger value="students">Ուսանողներ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Ակտիվ նախագծեր</CardTitle>
                <CardDescription>Ձեր ղեկավարած ընթացիկ նախագծերը</CardDescription>
              </div>
              <Button onClick={() => navigate('/admin/projects')} variant="outline" size="sm" className="flex items-center gap-2">
                Բոլոր նախագծերը
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ներկայումս ակտիվ նախագծեր չկան։ Ավելացրեք նախագիծ կամ սպասեք հարցումների։
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Թեմայի հարցումներ</CardTitle>
                <CardDescription>Ուսանողների կողմից ուղարկած թեմաների հարցումներ</CardDescription>
              </div>
              <Button onClick={() => navigate('/admin/pending-approvals')} variant="outline" size="sm" className="flex items-center gap-2">
                Բոլոր հարցումները
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ներկայումս հարցումներ չկան։ Հարցումները կհայտնվեն այստեղ, երբ ուսանողները ուղարկեն թեմայի հարցումներ։
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Ղեկավարվող ուսանողներ</CardTitle>
                <CardDescription>Ձեր ղեկավարության ներքո գտնվող ուսանողներ</CardDescription>
              </div>
              <Button onClick={() => navigate('/admin/supervised-students')} variant="outline" size="sm" className="flex items-center gap-2">
                Բոլոր ուսանողները
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ներկայումս ղեկավարվող ուսանողներ չկան։ Ուսանողները կհայտնվեն այստեղ, երբ նրանց թեմաների հարցումները հաստատվեն։
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SupervisorDashboard;
