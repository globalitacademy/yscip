
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface CourseErrorStateProps {
  error: string | null;
  handleGoBack: () => void;
}

const CourseErrorState: React.FC<CourseErrorStateProps> = ({ error, handleGoBack }) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="p-6 rounded-lg border border-destructive/20 bg-destructive/5 max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-4">Սխալ</h1>
        <p className="mb-8 text-muted-foreground">{error || 'Դասընթաց չի գտնվել'}</p>
        <Button variant="outline" onClick={handleGoBack} className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Վերադառնալ
        </Button>
      </div>
    </div>
  );
};

export default CourseErrorState;
