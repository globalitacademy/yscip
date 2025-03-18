
import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CoursePageLayoutProps {
  children: ReactNode;
}

const CoursePageLayout: React.FC<CoursePageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePageLayout;
