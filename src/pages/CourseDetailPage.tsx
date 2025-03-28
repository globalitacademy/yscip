
import React from 'react';
import CourseDetail from '@/components/courses/CourseDetail';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CourseDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <CourseDetail />
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
