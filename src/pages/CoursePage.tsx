
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CoursePageProvider, useCoursePageContext } from '@/contexts/CoursePageContext';
import CoursePageLoading from './course/CoursePageLoading';
import CourseNotFound from './course/CourseNotFound';
import CourseHeader from './course/CourseHeader';
import CourseInfo from './course/CourseInfo';
import CourseTabs from './course/tabs/CourseTabs';
import CourseSidebar from './course/CourseSidebar';

const CoursePageContent: React.FC = () => {
  const { course, loading } = useCoursePageContext();
  
  if (loading) {
    return <CoursePageLoading />;
  }
  
  if (!course) {
    return <CourseNotFound />;
  }
  
  // URL normalization - moved from the old component
  const courseSlug = course.id || course.title.toLowerCase().replace(/\s+/g, '-');
  
  if (window.location.pathname.includes('/course-detail/') || window.location.pathname.includes('/course/')) {
    window.history.replaceState({}, '', `/courses/${courseSlug}`);
  }
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <CourseHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CourseInfo />
            <CourseTabs />
          </div>
          
          <div className="lg:col-span-1">
            <CourseSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const CoursePage: React.FC = () => {
  return (
    <CoursePageProvider>
      <CoursePageContent />
    </CoursePageProvider>
  );
};

export default CoursePage;
