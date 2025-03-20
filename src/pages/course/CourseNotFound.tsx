
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CourseNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h2>
        <p className="mb-6">Ներողություն, նշված դասընթացը հնարավոր չէ գտնել։</p>
        <Button onClick={() => navigate('/admin/courses')}>Վերադառնալ դասընթացներին</Button>
      </div>
      <Footer />
    </>
  );
};

export default CourseNotFound;
