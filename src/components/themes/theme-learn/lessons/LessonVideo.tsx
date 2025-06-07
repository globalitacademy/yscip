
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play } from 'lucide-react';
import { Lesson } from './types';

interface LessonVideoProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonVideo: React.FC<LessonVideoProps> = ({ lesson, onComplete }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);

  const extractYouTubeVideoId = (url?: string): string | null => {
    if (!url) return null;
    
    const urlMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"'&?\/\s]+)/);
    if (urlMatch && urlMatch[1]) return urlMatch[1];
    
    const embedMatch = url.match(/youtube\.com\/embed\/([^"'&?\/\s]+)/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];
    
    return null;
  };

  const videoId = extractYouTubeVideoId(lesson.videoUrl);

  const handleVideoStart = () => {
    setHasStarted(true);
  };

  const handleVideoEnd = () => {
    setHasWatched(true);
  };

  const handleCompleteLesson = () => {
    onComplete();
  };

  if (!videoId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Տեսանյութը հասանելի չէ</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!hasStarted ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Պատրաստ եք դիտելու՞</h3>
            <p className="text-muted-foreground">
              Այս տեսադասը կօգնի ձեզ լավ հասկանալ թեման:
            </p>
          </div>
          <Button onClick={handleVideoStart}>
            Սկսել տեսադասը
          </Button>
        </div>
      ) : (
        <>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe 
              className="w-full h-[400px]"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => {
                // Simulate video end after some time for demo purposes
                setTimeout(() => setHasWatched(true), 10000);
              }}
            ></iframe>
          </div>
          
          {lesson.content && (
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mb-4">Տեսանյութի նկարագրություն</h3>
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          )}
          
          <div className="text-center pt-6 border-t">
            <Button 
              onClick={handleCompleteLesson}
              className="flex items-center gap-2"
              disabled={lesson.isCompleted}
            >
              <CheckCircle className="h-4 w-4" />
              {lesson.isCompleted ? 'Ավարտված է' : hasWatched ? 'Ավարտել դասը' : 'Նշել որպես դիտված'}
            </Button>
            {!hasWatched && (
              <p className="text-sm text-muted-foreground mt-2">
                Դիտեք տեսանյութը մինչև վերջ՝ դասը ավարտելու համար
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LessonVideo;
