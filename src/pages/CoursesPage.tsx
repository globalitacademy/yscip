
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseManagement from '@/components/courses/CourseManagement';
import { CourseProvider } from '@/components/courses/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfessionalCoursesSection from '@/components/courses/ProfessionalCoursesSection';

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Դասընթացներ</h1>
      
      <Tabs defaultValue="professional">
        <TabsList className="mb-8">
          <TabsTrigger value="professional">Մասնագիտական դասընթացներ</TabsTrigger>
          <TabsTrigger value="courses">Դասընթացների կառավարում</TabsTrigger>
        </TabsList>
        
        <TabsContent value="professional">
          <ProfessionalCoursesSection isAdminView={true} />
        </TabsContent>
        
        <TabsContent value="courses">
          <CourseProvider>
            <CourseManagement />
          </CourseProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoursesPage;
