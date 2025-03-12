
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Navigate } from 'react-router-dom';
import { AdminReset } from './components/AdminReset';

const Login = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Redirect authenticated users based on their role
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'lecturer' || user.role === 'instructor') {
      return <Navigate to="/teacher-dashboard" replace />;
    } else if (user.role === 'project_manager' || user.role === 'supervisor') {
      return <Navigate to="/project-manager-dashboard" replace />;
    } else if (user.role === 'employer') {
      return <Navigate to="/employer-dashboard" replace />;
    } else if (user.role === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    }
    
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Մուտք / Գրանցում</CardTitle>
            <CardDescription>
              Մուտք գործեք համակարգ կամ ստեղծեք նոր հաշիվ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminReset />
            
            <div className="mt-4">
              <Tabs 
                defaultValue="login" 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Մուտք</TabsTrigger>
                  <TabsTrigger value="register">Գրանցում</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <LoginForm isLoading={isLoading} />
                </TabsContent>
                
                <TabsContent value="register">
                  <RegisterForm 
                    isLoading={isLoading}
                    onRegisterSuccess={() => setActiveTab('login')}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
