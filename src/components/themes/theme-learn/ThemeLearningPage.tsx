
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeDetail } from '../hooks/useThemeDetail';
import LessonList from './lessons/LessonList';
import LessonContent from './lessons/LessonContent';
import { Lesson } from './lessons/types';

const ThemeLearningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme, moduleTitle, isLoading } = useThemeDetail(id);
  
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Mock lessons data - in real app this would come from API
  useEffect(() => {
    if (theme) {
      const mockLessons: Lesson[] = [
        {
          id: '1',
          title: 'Ներածություն',
          content: theme.content || 'Դասի բովանդակություն',
          duration: 15,
          type: 'text',
          order: 1,
          isCompleted: false
        },
        {
          id: '2',
          title: 'Տեսադաս',
          content: 'Տեսանյութի նկարագրություն',
          duration: 30,
          type: 'video',
          order: 2,
          isCompleted: false,
          videoUrl: theme.video_url
        },
        {
          id: '3',
          title: 'Գիտելիքների ստուգում',
          content: '',
          duration: 10,
          type: 'quiz',
          order: 3,
          isCompleted: false,
          quiz: {
            id: 'quiz1',
            questions: [
              {
                id: 'q1',
                question: 'Ինչպիսի՞ն է ձեր գնահատականը այս թեմայի վերաբերյալ:',
                options: ['Գեղեցիկ', 'Լավ', 'Շատ լավ', 'Գերազանց'],
                correctAnswer: 3,
                explanation: 'Գերազանցն է ամենալավ պատասխանը:'
              },
              {
                id: 'q2',
                question: 'Ինչքանո՞վ է օգտակար այս նյութը:',
                options: ['Փոքր', 'Միջին', 'Լավ', 'Շատ օգտակար'],
                correctAnswer: 3
              }
            ]
          }
        }
      ];
      setLessons(mockLessons);
      setCurrentLessonId(mockLessons[0]?.id || null);
    }
  }, [theme]);

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
  };

  const handleLessonComplete = () => {
    if (currentLessonId) {
      setLessons(prev => prev.map(lesson => 
        lesson.id === currentLessonId 
          ? { ...lesson, isCompleted: true }
          : lesson
      ));
    }
  };

  const handlePrevious = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex > 0) {
      setCurrentLessonId(lessons[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex < lessons.length - 1) {
      setCurrentLessonId(lessons[currentIndex + 1].id);
    }
  };

  const currentLesson = lessons.find(l => l.id === currentLessonId);
  const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
  const progress = Math.round((lessons.filter(l => l.isCompleted).length / lessons.length) * 100);

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="container max-w-6xl mx-auto py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Թեման չի գտնվել</h2>
          <Button asChild>
            <Link to="/themes">Բոլոր թեմաները</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to={`/themes/${id}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Վերադառնալ թեմային
          </Link>
        </Button>
        
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{theme.title}</h1>
          <p className="text-lg text-muted-foreground">Դասեր և վարժություններ</p>
          {moduleTitle && (
            <Link to={`/module/${theme.module_id}`} className="text-sm text-primary hover:underline">
              {moduleTitle}
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <LessonList
            lessons={lessons}
            currentLessonId={currentLessonId || undefined}
            onLessonSelect={handleLessonSelect}
            progress={progress}
          />
        </div>
        
        <div className="lg:col-span-2">
          {currentLesson && (
            <LessonContent
              lesson={currentLesson}
              onComplete={handleLessonComplete}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={currentIndex > 0}
              hasNext={currentIndex < lessons.length - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeLearningPage;
