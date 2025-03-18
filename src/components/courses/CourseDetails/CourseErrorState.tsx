
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface CourseErrorStateProps {
  error: string | null;
  handleGoBack: () => void;
}

const CourseErrorState: React.FC<CourseErrorStateProps> = ({ error, handleGoBack }) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-red-600 mb-4">Սխալ է տեղի ունեցել</h1>
      <p className="mb-8">{error || 'Դասընթաց չի գտնվել: Խնդրում ենք ստուգել դասընթացի ID-ն:'}</p>
      <Button variant="outline" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Վերադառնալ դասընթացներ
      </Button>
    </div>
  );
};

export default CourseErrorState;
