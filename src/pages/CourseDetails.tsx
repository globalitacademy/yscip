
import React from 'react';
import { useParams } from 'react-router-dom';
import CourseDetail from '@/components/courses/CourseDetail';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  
  console.log("CourseDetails էջ: Ստացված slug:", slug);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CourseDetail />
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetails;
