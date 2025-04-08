
import React from 'react';
import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom';
import ProjectDetails from './pages/ProjectDetails';
import CourseDetails from './pages/CourseDetails';
import CourseDetailPage from './pages/CourseDetailPage';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Index />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/course/:slug" element={<CourseDetails />} />
        <Route path="/course-detail/:id" element={<CourseDetailPage />} /> 
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};
