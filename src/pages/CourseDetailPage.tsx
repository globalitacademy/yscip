
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CourseDetailPage as AdminCourseDetailPage } from '@/components/admin/courses/CourseDetailPage';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  console.log('CourseDetailPage: Loaded with ID:', id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <AdminCourseDetailPage id={id} />
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
