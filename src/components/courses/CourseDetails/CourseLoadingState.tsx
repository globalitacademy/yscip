
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CourseLoadingState: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-56" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    </div>
  );
};

export default CourseLoadingState;
