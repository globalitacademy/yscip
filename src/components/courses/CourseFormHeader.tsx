
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const CourseFormHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Նոր դասընթացի ստեղծում</CardTitle>
      <CardDescription>Ստեղծեք նոր դասընթաց ձեր ուսանողների համար</CardDescription>
    </CardHeader>
  );
};

export default CourseFormHeader;
