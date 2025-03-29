
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseBasicInfoProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

export const CourseBasicInfo: React.FC<CourseBasicInfoProps> = ({ course, setCourse }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Վերնագիր</Label>
        <Input
          id="title"
          value={course.title || ''}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          placeholder="Դասընթացի վերնագիր"
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Ենթավերնագիր</Label>
        <Input
          id="subtitle"
          value={course.subtitle || ''}
          onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
          placeholder="Դասընթացի ենթավերնագիր"
        />
      </div>

      <div>
        <Label htmlFor="description">Նկարագրություն</Label>
        <Textarea
          id="description"
          value={course.description || ''}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          placeholder="Դասընթացի մանրամասն նկարագրություն"
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="duration">Տևողություն</Label>
        <Input
          id="duration"
          value={course.duration || ''}
          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
          placeholder="Օրինակ՝ 3 ամիս"
        />
      </div>

      <div>
        <Label htmlFor="price">Արժեք</Label>
        <Input
          id="price"
          value={course.price || ''}
          onChange={(e) => setCourse({ ...course, price: e.target.value })}
          placeholder="Օրինակ՝ 58,000 ֏"
        />
      </div>
    </div>
  );
};
