
import React, { useState } from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Book, PlayCircle, Clock, LockIcon, UnlockIcon } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

interface CourseCurriculumTabProps {
  course: ProfessionalCourse;
}

const CourseCurriculumTab: React.FC<CourseCurriculumTabProps> = ({ course }) => {
  const [expandedAll, setExpandedAll] = useState(false);
  const { theme } = useTheme();
  
  if (!course.lessons || course.lessons.length === 0) {
    return (
      <div className={`text-center py-16 border rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
        <Book className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-4`} />
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
          Դասընթացի պլանը դեռ հասանելի չէ
        </p>
        <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm mt-2`}>
          Դասընթացի պլանն ավելացվելուն պես կհայտնվի այստեղ
        </p>
      </div>
    );
  }
  
  const toggleAll = () => {
    setExpandedAll(!expandedAll);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {course.lessons.length} դասեր
        </h2>
        <Button 
          variant="ghost" 
          onClick={toggleAll}
          className={`${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50' : 'text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50'}`}
        >
          {expandedAll ? 'Փակել բոլորը' : 'Բացել բոլորը'}
        </Button>
      </div>
      
      <Accordion 
        type="multiple" 
        defaultValue={expandedAll ? course.lessons.map((_, i) => `item-${i}`) : []} 
        className="w-full"
      >
        {course.lessons.map((lesson, index) => (
          <AccordionItem 
            value={`item-${index}`} 
            key={index} 
            className={`border mb-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center w-full">
                <div className={`${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'} w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                  {index + 1}
                </div>
                <div className="text-left flex-1">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{lesson.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <LockIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className={`px-6 py-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-4 ml-14">
                <PlayCircle className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Դասի մանրամասներ հասանելի կլինեն գրանցվելուց հետո
                </p>
              </div>
              <div className="ml-14">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${theme === 'dark' ? 'text-indigo-400 border-indigo-800/50 hover:bg-indigo-950/50' : 'text-indigo-700 border-indigo-200 hover:bg-indigo-50'}`}
                >
                  Գրանցվել դասընթացին
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseCurriculumTab;
