
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folders, CheckSquare, Briefcase } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" />;
  }

  return (
    <AdminLayout pageTitle="Ուսանողի վահանակ">
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/my-projects" className="no-underline">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Իմ նախագծերը
              </CardTitle>
              <Folders className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Ընթացիկ նախագծերի քանակ
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/tasks" className="no-underline">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Հանձնարարություններ
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Ընդհանուր առաջադրանքների 0%
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/portfolio" className="no-underline">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Պորտֆոլիո
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Դիտել իմ պրոֆեսիոնալ պրոֆիլը
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Վերջին ծանուցումներ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ներկայումս ծանուցումներ չկան։ Նոր ծանուցումները կհայտնվեն այստեղ։
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Առաջարկվող նախագծեր</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/my-projects">Բոլոր նախագծերը</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              <div className="p-4 text-center text-sm text-muted-foreground">
                Ներկայումս չկան առաջարկվող նախագծեր։
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default StudentDashboard;
