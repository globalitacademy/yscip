
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CourseLoadingState: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <Skeleton className="h-64 w-full rounded-lg" />
        
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
};

export default CourseLoadingState;
