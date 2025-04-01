
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import CourseManagement from '@/components/courses/CourseManagement';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const CoursesPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Դասընթացների կառավարում">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Դասընթացների կառավարում</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/all-courses">
            <Eye className="h-4 w-4 mr-2" /> Դիտել բոլոր դասընթացները
          </Link>
        </Button>
      </div>
      <CourseManagement />
    </AdminLayout>
  );
};

export default CoursesPage;
