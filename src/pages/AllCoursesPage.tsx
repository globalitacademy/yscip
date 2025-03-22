
import React from 'react';
import { CourseProvider } from '@/components/courses/CourseContext';
import AllCoursesView from '@/components/courses/AllCoursesView';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const AllCoursesPage: React.FC = () => {
  return (
    <CourseProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Բոլոր դասընթացները</h1>
          <AllCoursesView />
        </main>
        <Footer />
      </div>
    </CourseProvider>
  );
};

export default AllCoursesPage;
