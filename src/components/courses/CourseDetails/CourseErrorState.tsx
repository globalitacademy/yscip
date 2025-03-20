
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CourseErrorStateProps {
  error: string | null;
  handleGoBack: () => void;
}

const CourseErrorState: React.FC<CourseErrorStateProps> = ({ error, handleGoBack }) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Սխալ</h1>
      <p className="mb-8">{error || 'Դասընթաց չի գտնվել'}</p>
      <Button variant="outline" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Վերադառնալ
      </Button>
    </div>
  );
};

export default CourseErrorState;
