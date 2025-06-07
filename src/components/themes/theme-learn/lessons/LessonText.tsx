
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Lesson } from './types';

interface LessonTextProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonText: React.FC<LessonTextProps> = ({ lesson, onComplete }) => {
  const [isReading, setIsReading] = useState(false);

  const handleStartReading = () => {
    setIsReading(true);
  };

  const handleCompleteReading = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      {!isReading ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Պատրաստ եք սկսելու՞</h3>
            <p className="text-muted-foreground">
              Այս դասը բաղկացած է տեքստային նյութից, որը կօգնի ձեզ հասկանալ թեման:
            </p>
          </div>
          <Button onClick={handleStartReading}>
            Սկսել ընթերցանությունը
          </Button>
        </div>
      ) : (
        <>
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
          
          <div className="text-center pt-6 border-t">
            <Button 
              onClick={handleCompleteReading}
              className="flex items-center gap-2"
              disabled={lesson.isCompleted}
            >
              <CheckCircle className="h-4 w-4" />
              {lesson.isCompleted ? 'Ավարտված է' : 'Ավարտել դասը'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LessonText;
