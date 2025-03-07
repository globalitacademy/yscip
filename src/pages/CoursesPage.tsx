
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseManagement from '@/components/CourseManagement';

const CoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <CourseManagement />
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;
