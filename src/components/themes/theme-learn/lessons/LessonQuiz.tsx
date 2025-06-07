
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Check } from 'lucide-react';
import { Lesson, QuizQuestion } from './types';

interface LessonQuizProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonQuiz: React.FC<LessonQuizProps> = ({ lesson, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = lesson.quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      const correctAnswers = selectedAnswers.filter((answer, index) => 
        answer === questions[index]?.correctAnswer
      ).length;
      setScore(Math.round((correctAnswers / questions.length) * 100));
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!lesson.quiz || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Թեստը հասանելի չէ</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-4">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              score >= 70 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            } mb-4`}>
              <span className="text-2xl font-bold">{score}%</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {score >= 70 ? 'Շնորհավորում!' : 'Փորձեք կրկին'}
            </h3>
            <p className="text-muted-foreground">
              Դուք պատասխանել եք {selectedAnswers.filter((answer, index) => 
                answer === questions[index]?.correctAnswer
              ).length} / {questions.length} հարցերին ճիշտ:
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className={`border ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{question.question}</h4>
                      <div className="space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 text-green-800'
                                : optionIndex === userAnswer && !isCorrect
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-50'
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <Badge variant="secondary" className="ml-2">Ճիշտ պատասխան</Badge>
                            )}
                            {optionIndex === userAnswer && optionIndex !== question.correctAnswer && (
                              <Badge variant="destructive" className="ml-2">Ձեր պատասխանը</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          {score < 70 && (
            <Button variant="outline" onClick={handleRetry}>
              Փորձել կրկին
            </Button>
          )}
          <Button onClick={handleComplete} disabled={lesson.isCompleted}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {lesson.isCompleted ? 'Ավարտված է' : 'Ավարտել դասը'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Թեստ</h3>
        <Badge variant="outline">
          {currentQuestionIndex + 1} / {questions.length}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium mb-4">{currentQuestion?.question}</h4>
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Հաջորդ հարցը' : 'Ավարտել թեստը'}
        </Button>
      </div>
    </div>
  );
};

export default LessonQuiz;
