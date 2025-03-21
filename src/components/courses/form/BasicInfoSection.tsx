
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface BasicInfoSectionProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ course, setCourse }) => {
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
        <Label htmlFor="instructor">Դասախոս</Label>
        <Input
          id="instructor"
          value={course.instructor || ''}
          onChange={(e) => setCourse({ ...course, instructor: e.target.value })}
          placeholder="Դասախոսի անուն ազգանուն"
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
      
      <div>
        <Label htmlFor="buttonText">Կոճակի տեքստ</Label>
        <Input
          id="buttonText"
          value={course.buttonText || ''}
          onChange={(e) => setCourse({ ...course, buttonText: e.target.value })}
          placeholder="Օրինակ՝ Դիմել"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
