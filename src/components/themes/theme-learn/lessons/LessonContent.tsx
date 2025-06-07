
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lesson } from './types';
import LessonVideo from './LessonVideo';
import LessonText from './LessonText';
import LessonQuiz from './LessonQuiz';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  onComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}) => {
  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return <LessonVideo lesson={lesson} onComplete={onComplete} />;
      case 'quiz':
        return <LessonQuiz lesson={lesson} onComplete={onComplete} />;
      default:
        return <LessonText lesson={lesson} onComplete={onComplete} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{lesson.duration} րոպե</span>
            </Badge>
            {lesson.isCompleted && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Ավարտված</span>
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-2xl">{lesson.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderLessonContent()}
        
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Նախորդ դասը
          </Button>
          
          <Button 
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-2"
          >
            Հաջորդ դասը
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonContent;
