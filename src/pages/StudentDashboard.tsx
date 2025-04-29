
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folders, CheckSquare, Briefcase, Bell } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" />;
  }

  return (
    <AdminLayout pageTitle="Ուսանողի վահանակ">
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
        <Link to="/admin/my-projects" className="no-underline">
          <Card className={`cursor-pointer transition-all duration-300 hover:translate-y-[-5px] ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'hover:shadow-md'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Իմ նախագծերը
              </CardTitle>
              <Folders className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-muted-foreground'}`} />
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
          <Card className={`cursor-pointer transition-all duration-300 hover:translate-y-[-5px] ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'hover:shadow-md'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Հանձնարարություններ
              </CardTitle>
              <CheckSquare className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-muted-foreground'}`} />
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
          <Card className={`cursor-pointer transition-all duration-300 hover:translate-y-[-5px] ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'hover:shadow-md'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Պորտֆոլիո
              </CardTitle>
              <Briefcase className={`h-4 w-4 ${theme === 'dark' ? 'text-purple-400' : 'text-muted-foreground'}`} />
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
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
              Վերջին ծանուցումներ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ներկայումս ծանուցումներ չկան։ Նոր ծանուցումները կհայտնվեն այստեղ։
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Առաջարկվող նախագծեր</CardTitle>
            <Button variant={theme === 'dark' ? 'outline' : 'outline'} size="sm" asChild>
              <Link to="/admin/my-projects" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>Բոլոր նախագծերը</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : ''}`}>
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
