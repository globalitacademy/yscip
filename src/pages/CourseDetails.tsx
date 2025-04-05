
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseDetail from '@/components/courses/CourseDetail';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CourseDetails: React.FC = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  
  console.log("CourseDetails էջ: Ստացված պարամետրեր:", { slug, id });
  
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
