
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CourseDetailHeader from './CourseDetailHeader';
import CourseTabContent from './CourseTabContent';
import CourseBenefitsCard from './CourseBenefitsCard';

interface CourseDetailContentProps {
  course: ProfessionalCourse;
  canEdit: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handlePublishToggle: () => void;
  loading: boolean;
}

const CourseDetailContent: React.FC<CourseDetailContentProps> = ({
  course,
  canEdit,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  handlePublishToggle,
  loading
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.subtitle}</p>
        </div>
        
        {canEdit && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Խմբագրել
            </Button>
            
            <Button 
              variant={course.is_public ? "secondary" : "default"}
              size="sm"
              onClick={handlePublishToggle}
              disabled={loading}
            >
              {course.is_public ? (
                <>
                  <Eye className="h-4 w-4 mr-2" /> Հրապարակված է
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" /> Հրապարակել
                </>
              )}
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" /> Ջնջել
            </Button>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <CourseStatusBadge isPublic={course.is_public} />
      </div>
      
      <CourseDetailHeader course={course} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Նկարագրություն</TabsTrigger>
              <TabsTrigger value="curriculum">Դասընթացի պլան</TabsTrigger>
              <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
              <TabsTrigger value="outcomes">Արդյունքներ</TabsTrigger>
            </TabsList>
            
            <CourseTabContent course={course} />
          </Tabs>
        </div>
        
        <div>
          <CourseBenefitsCard />
        </div>
      </div>
    </>
  );
};

const CourseStatusBadge: React.FC<{ isPublic?: boolean }> = ({ isPublic }) => (
  <>
    {isPublic ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <Eye className="h-3 w-3 mr-1" /> Հրապարակված
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        <Clock className="h-3 w-3 mr-1" /> Սպասում է հրապարակման
      </Badge>
    )}
  </>
);

export default CourseDetailContent;
