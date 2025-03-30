
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Book } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface CourseCurriculumTabProps {
  course: ProfessionalCourse;
}

const CourseCurriculumTab: React.FC<CourseCurriculumTabProps> = ({ course }) => {
  if (!course.lessons || course.lessons.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <Book className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <p className="text-gray-500">Դասընթացի պլանը դեռ հասանելի չէ</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {course.lessons.map((lesson, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border rounded-lg px-2 py-1 mb-2">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{lesson.title}</h3>
                  <p className="text-sm text-gray-500">{lesson.duration}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-14">
              <p>Դասի մանրամասներ հասանելի կլինեն գրանցվելուց հետո:</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseCurriculumTab;
