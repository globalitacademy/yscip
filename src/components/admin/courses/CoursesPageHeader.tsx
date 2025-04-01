
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CoursesPageHeaderProps {
  courseCount: number;
}

export const CoursesPageHeader: React.FC<CoursesPageHeaderProps> = ({
  courseCount,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Բոլոր դասընթացները ({courseCount})</h1>
      <Button asChild>
        <Link to="/courses/create">Ստեղծել նոր դասընթաց</Link>
      </Button>
    </div>
  );
};
