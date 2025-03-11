
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Navigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, FileText, Building, PieChart, Users } from 'lucide-react';

const EmployerDashboard: React.FC = () => {
  const { user, isAuthenticated, isApproved } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'employer') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (!isApproved) {
    return <Navigate to="/approval-pending" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Գործատուի վահանակ</h1>
          <p className="text-muted-foreground mt-2">
            Կառավարեք Ձեր նախագծերը և առաջարկները
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <ClipboardList className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Իմ նախագծերը</CardTitle>
              <CardDescription>
                Դիտել և կառավարել Ձեր նախագծերը
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="default" className="w-full" asChild>
                <Link to="/projects/my">Դիտել</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Նոր առաջարկ</CardTitle>
              <CardDescription>
                Ստեղծել նոր նախագծի առաջարկ
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="default" className="w-full" asChild>
                <Link to="/projects/submit">Ստեղծել</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Ուսանողներ</CardTitle>
              <CardDescription>
                Դիտել Ձեր նախագծերում ընդգրկված ուսանողներին
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="default" className="w-full" asChild>
                <Link to="/students">Դիտել</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <PieChart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Վիճակագրություն</CardTitle>
              <CardDescription>
                Դիտել Ձեր նախագծերի վիճակագրությունը
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="default" className="w-full" asChild>
                <Link to="/statistics">Դիտել</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Կազմակերպության տվյալներ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Անվանում</dt>
                  <dd className="text-base">{user.organization || 'Չնշված'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Հասցե</dt>
                  <dd className="text-base">Չնշված</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Կոնտակտային տվյալներ</dt>
                  <dd className="text-base">{user.email}</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Թարմացնել տվյալները</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Վերջին նախագծերը</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">Դեռևս նախագծեր չկան</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/projects/submit">Ավելացնել նախագիծ</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
