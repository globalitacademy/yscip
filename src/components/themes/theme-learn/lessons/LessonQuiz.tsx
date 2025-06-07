
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Lesson } from './types';

interface LessonQuizProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonQuiz: React.FC<LessonQuizProps> = ({ lesson, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  if (!lesson.quiz || !lesson.quiz.questions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Թեստ հասանելի չէ</p>
      </div>
    );
  }

  const questions = lesson.quiz.questions;
  const totalQuestions = questions.length;

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!hasStarted) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Պատրաստ եք թեստի համար՞</h3>
          <p className="text-muted-foreground mb-4">
            Այս թեստը ընդգրկում է {totalQuestions} հարց և կօգնի ստուգել ձեր գիտելիքները:
          </p>
          <Badge variant="outline">
            {totalQuestions} հարց
          </Badge>
        </div>
        <Button onClick={handleStart}>
          Սկսել թեստը
        </Button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="space-y-6">
        <Card className={passed ? 'border-green-200' : 'border-red-200'}>
          <CardContent className="pt-6 text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {passed ? <Check className="h-8 w-8" /> : <X className="h-8 w-8" />}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {passed ? 'Շնորհավորում!' : 'Փորձեք կրկին'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Ձեր արդյունքը՝ {score}% ({selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length}/{totalQuestions})
            </p>
            <Badge variant={passed ? 'default' : 'destructive'} className="mb-4">
              {passed ? 'Հաջող անցում' : 'Կարիք է բարելավման'}
            </Badge>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="font-medium">Մանրամասն արդյունքներ</h4>
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className={isCorrect ? 'border-green-200' : 'border-red-200'}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {isCorrect ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Ձեր պատասխանը՝ {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600">
                          Ճիշտ պատասխանը՝ {question.options[question.correctAnswer]}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button onClick={handleComplete} disabled={lesson.isCompleted}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {lesson.isCompleted ? 'Ավարտված է' : 'Ավարտել դասը'}
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const hasAnswer = selectedAnswers[currentQuestion] !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">
          Հարց {currentQuestion + 1} / {totalQuestions}
        </Badge>
        <div className="w-32 bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Նախորդը
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!hasAnswer}
        >
          {currentQuestion === totalQuestions - 1 ? 'Ավարտել' : 'Հաջորդը'}
        </Button>
      </div>
    </div>
  );
};

export default LessonQuiz;
