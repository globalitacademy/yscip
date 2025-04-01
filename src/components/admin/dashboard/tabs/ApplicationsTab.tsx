
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseApplicationsTable } from '../../courses/applications/CourseApplicationsTable';
import { useCourseApplications } from '@/hooks/useCourseApplications';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApplicationsTab: React.FC = () => {
  const { applications, loading } = useCourseApplications();
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Դասընթացների դիմումներ</CardTitle>
          <CardDescription>Վերջին դիմումները դասընթացներին մասնակցելու համար</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/course-applications')}
        >
          Բոլոր դիմումները <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <CourseApplicationsTable 
          applications={applications} 
          isLoading={loading} 
        />
      </CardContent>
    </Card>
  );
};

export default ApplicationsTab;
