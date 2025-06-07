
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Video, Book, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lesson } from './types';

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
  progress: number;
}

const LessonList: React.FC<LessonListProps> = ({ 
  lessons, 
  currentLessonId, 
  onLessonSelect,
  progress 
}) => {
  const getIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'quiz':
        return <Brain className="h-4 w-4" />;
      case 'practice':
        return <Brain className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return 'Տեսադաս';
      case 'quiz':
        return 'Թեստ';
      case 'practice':
        return 'Գործնական';
      default:
        return 'Տեքստ';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Դասեր</span>
          <Badge variant="secondary">{lessons.length} դաս</Badge>
        </CardTitle>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Առաջընթաց</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                currentLessonId === lesson.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onLessonSelect(lesson.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}.
                    </span>
                    {lesson.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{lesson.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getIcon(lesson.type)}
                        <span>{getTypeLabel(lesson.type)}</span>
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration} րոպե</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant={currentLessonId === lesson.id ? "default" : "outline"}
                >
                  {lesson.isCompleted ? 'Վերանայել' : 'Սկսել'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonList;
