
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { X, PlusCircle } from 'lucide-react';
import { ProfessionalCourse, CourseLesson } from '../types/ProfessionalCourse';

interface ContentSectionProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({ course, setCourse }) => {
  const [newLesson, setNewLesson] = useState<CourseLesson>({ title: '', duration: '' });
  const [newRequirement, setNewRequirement] = useState('');
  const [newOutcome, setNewOutcome] = useState('');

  const handleAddLesson = () => {
    if (newLesson.title && newLesson.duration) {
      const lessons = [...(course.lessons || []), newLesson];
      setCourse({ ...course, lessons });
      setNewLesson({ title: '', duration: '' });
    }
  };

  const handleRemoveLesson = (index: number) => {
    const lessons = [...(course.lessons || [])];
    lessons.splice(index, 1);
    setCourse({ ...course, lessons });
  };

  const handleAddRequirement = () => {
    if (newRequirement) {
      const requirements = [...(course.requirements || []), newRequirement];
      setCourse({ ...course, requirements });
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const requirements = [...(course.requirements || [])];
    requirements.splice(index, 1);
    setCourse({ ...course, requirements });
  };

  const handleAddOutcome = () => {
    if (newOutcome) {
      const outcomes = [...(course.outcomes || []), newOutcome];
      setCourse({ ...course, outcomes });
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (index: number) => {
    const outcomes = [...(course.outcomes || [])];
    outcomes.splice(index, 1);
    setCourse({ ...course, outcomes });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="lessons">
        <AccordionTrigger>Դասընթացի ծրագիր</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {(course.lessons || []).map((lesson, index) => (
                <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                  <div className="flex-1">
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-sm text-muted-foreground">{lesson.duration}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveLesson(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="lessonTitle">Թեմայի անվանում</Label>
                <Input
                  id="lessonTitle"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  placeholder="Օր․՝ HTML5 հիմունքներ"
                />
              </div>
              <div>
                <Label htmlFor="lessonDuration">Տևողություն</Label>
                <Input
                  id="lessonDuration"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                  placeholder="Օր․՝ 3 ժամ"
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddLesson}
              className="w-full"
              disabled={!newLesson.title || !newLesson.duration}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ավելացնել թեմա
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="outcomes">
        <AccordionTrigger>Ինչ կսովորեք</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {(course.outcomes || []).map((outcome, index) => (
                <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                  <div className="flex-1">{outcome}</div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveOutcome(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div>
              <Label htmlFor="outcome">Սովորելիք</Label>
              <Input
                id="outcome"
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                placeholder="Օր․՝ Մշակել ամբողջական ինտերակտիվ վեբ կայքեր"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddOutcome}
              className="w-full"
              disabled={!newOutcome}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ավելացնել սովորելիք
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="requirements">
        <AccordionTrigger>Պահանջներ</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              {(course.requirements || []).map((requirement, index) => (
                <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                  <div className="flex-1">{requirement}</div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div>
              <Label htmlFor="requirement">Պահանջ</Label>
              <Input
                id="requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Օր․՝ Համակարգչային հիմնական գիտելիքներ"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddRequirement}
              className="w-full"
              disabled={!newRequirement}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ավելացնել պահանջ
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ContentSection;
