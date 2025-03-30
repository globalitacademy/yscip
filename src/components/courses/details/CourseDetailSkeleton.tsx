
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CourseDetailSkeletonProps {
  type: 'loading' | 'not-found';
}

const CourseDetailSkeleton: React.FC<CourseDetailSkeletonProps> = ({ type }) => {
  const navigate = useNavigate();
  
  if (type === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Բեռնում...</span>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h1>
        <Button onClick={() => navigate('/courses')}>Վերադառնալ դասընթացների էջ</Button>
      </div>
    </div>
  );
};

export default CourseDetailSkeleton;
