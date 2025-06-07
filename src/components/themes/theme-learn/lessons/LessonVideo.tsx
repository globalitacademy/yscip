
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play } from 'lucide-react';
import { Lesson } from './types';

interface LessonVideoProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonVideo: React.FC<LessonVideoProps> = ({ lesson, onComplete }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const extractYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"&?\/\s]+)/);
    return match && match[1] ? match[1] : null;
  };

  const videoId = lesson.videoUrl ? extractYouTubeVideoId(lesson.videoUrl) : null;

  const handleStartWatching = () => {
    setIsWatching(true);
  };

  const handleVideoEnd = () => {
    setVideoCompleted(true);
  };

  const handleCompleteLesson = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      {!isWatching ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <Play className="h-16 w-16 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Պատրաստ եք նայելու՞</h3>
            <p className="text-muted-foreground">
              Այս դասը բաղկացած է {lesson.duration} րոպե տեսանյութից:
            </p>
          </div>
          <Button onClick={handleStartWatching}>
            Սկսել դիտումը
          </Button>
        </div>
      ) : (
        <>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            {videoId ? (
              <iframe
                ref={videoRef}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  // Simulate video completion after duration
                  setTimeout(() => {
                    setVideoCompleted(true);
                  }, lesson.duration * 60 * 1000);
                }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p>Տեսանյութը հասանելի չէ</p>
              </div>
            )}
          </div>
          
          {lesson.content && (
            <div className="prose prose-lg max-w-none">
              <h3>Տեսանյութի նկարագրություն</h3>
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
              {lesson.isCompleted ? 'Ավարտված է' : 'Ավարտել դասը'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LessonVideo;
