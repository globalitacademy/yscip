
import React, { useState } from 'react';
import { ProfessionalCourse, LessonItem } from './types/ProfessionalCourse';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

import { 
  CourseBasicInfo,
  CourseInstitutionSelector,
  LogoSelector,
  CourseImageSelector,
  CourseColorSelector,
  CourseDisplaySettings,
  LessonsList,
  RequirementsList,
  OutcomesList
} from './form-components';

interface ProfessionalCourseFormProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
  isEdit?: boolean;
}

const ProfessionalCourseForm: React.FC<ProfessionalCourseFormProps> = ({
  course,
  setCourse,
  isEdit = false
}) => {
  const [isIconsOpen, setIsIconsOpen] = useState(false);
  const [isColorsOpen, setIsColorsOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    setCourse({ ...course, color });
    setIsColorsOpen(false);
  };

  const handleAddLesson = (newLesson: LessonItem) => {
    const lessons = [...(course.lessons || []), newLesson];
    setCourse({ ...course, lessons });
  };

  const handleRemoveLesson = (index: number) => {
    const lessons = [...(course.lessons || [])];
    lessons.splice(index, 1);
    setCourse({ ...course, lessons });
  };

  const handleAddRequirement = (newRequirement: string) => {
    const requirements = [...(course.requirements || []), newRequirement];
    setCourse({ ...course, requirements });
  };

  const handleRemoveRequirement = (index: number) => {
    const requirements = [...(course.requirements || [])];
    requirements.splice(index, 1);
    setCourse({ ...course, requirements });
  };

  const handleAddOutcome = (newOutcome: string) => {
    const outcomes = [...(course.outcomes || []), newOutcome];
    setCourse({ ...course, outcomes });
  };

  const handleRemoveOutcome = (index: number) => {
    const outcomes = [...(course.outcomes || [])];
    outcomes.splice(index, 1);
    setCourse({ ...course, outcomes });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        {/* Basic Course Information */}
        <CourseBasicInfo course={course} setCourse={setCourse} />
        
        {/* Institution Selector */}
        <CourseInstitutionSelector course={course} setCourse={setCourse} />
        
        {/* Logo Selector */}
        <LogoSelector course={course} setCourse={setCourse} />
        
        {/* Image Selector */}
        <CourseImageSelector course={course} setCourse={setCourse} />
        
        {/* Color Selector */}
        <CourseColorSelector 
          isColorsOpen={isColorsOpen} 
          setIsColorsOpen={setIsColorsOpen} 
          onColorSelect={handleColorSelect}
          selectedColor={course.color || 'text-amber-500'} // Added missing selectedColor prop
        />
        
        {/* Display Settings */}
        <CourseDisplaySettings course={course} setCourse={setCourse} />
        
        {/* Additional Course Details */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="lessons">
            <AccordionTrigger>Դասընթացի ծրագիր</AccordionTrigger>
            <AccordionContent>
              <LessonsList 
                lessons={course.lessons} 
                onAddLesson={handleAddLesson} 
                onRemoveLesson={handleRemoveLesson} 
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="outcomes">
            <AccordionTrigger>Ինչ կսովորեք</AccordionTrigger>
            <AccordionContent>
              <OutcomesList 
                outcomes={course.outcomes} 
                onAddOutcome={handleAddOutcome} 
                onRemoveOutcome={handleRemoveOutcome} 
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="requirements">
            <AccordionTrigger>Պահանջներ</AccordionTrigger>
            <AccordionContent>
              <RequirementsList 
                requirements={course.requirements} 
                onAddRequirement={handleAddRequirement} 
                onRemoveRequirement={handleRemoveRequirement} 
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ProfessionalCourseForm;
