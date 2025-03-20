
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CoursePageLoading: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-28 bg-gray-200 rounded"></div>
            <div className="h-28 bg-gray-200 rounded"></div>
            <div className="h-28 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursePageLoading;
