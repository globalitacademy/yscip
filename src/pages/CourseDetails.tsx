
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseDetail from '@/components/courses/CourseDetail';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/use-theme';
import { ScrollArea } from '@/components/ui/scroll-area';

const CourseDetails: React.FC = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  console.log("CourseDetails էջ: Ստացված պարամետրեր:", { slug, id });
  
  return (
    <div className={`flex min-h-screen flex-col ${theme === 'dark' ? 'bg-background text-foreground' : ''}`}>
      <Header />
      <ScrollArea className="flex-1 h-[calc(100vh-150px)]">
        <main className="flex-1">
          <CourseDetail />
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default CourseDetails;
