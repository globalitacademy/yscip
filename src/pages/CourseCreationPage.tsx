
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import CourseCreationForm from '@/components/courses/CourseCreationForm';

const CourseCreationPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Դասընթացի ստեղծում">
      <CourseCreationForm />
    </AdminLayout>
  );
};

export default CourseCreationPage;
