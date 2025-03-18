
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSpecializations } from './utils/mockData';
import { Course } from './types';

interface CourseFormProps {
  course: Partial<Course>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<Course>>>;
  newModule: string;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  handleAddModule: () => void;
  handleRemoveModule: (index: number) => void;
  isEdit?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  course,
  setCourse,
  newModule,
  setNewModule,
  handleAddModule,
  handleRemoveModule,
  isEdit = false
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Անվանում
        </Label>
        <Input
          id="name"
          value={course.name || ''}
          onChange={(e) => setCourse({ ...course, name: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="specialization" className="text-right">
          Մասնագիտություն
        </Label>
        <Select 
          value={course.specialization} 
          onValueChange={(value) => setCourse({ ...course, specialization: value })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Ընտրեք մասնագիտությունը" />
          </SelectTrigger>
          <SelectContent>
            {mockSpecializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="duration" className="text-right">
          Տևողություն
        </Label>
        <Input
          id="duration"
          value={course.duration || ''}
          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
          className="col-span-3"
          placeholder="Օր. 4 ամիս"
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2">
          Նկարագրություն
        </Label>
        <Textarea
          id="description"
          value={course.description || ''}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          className="col-span-3"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2">Մոդուլներ</Label>
        <div className="col-span-3 space-y-2">
          <div className="flex gap-2">
            <Input
              value={newModule}
              onChange={(e) => setNewModule(e.target.value)}
              placeholder="Մոդուլի անվանում"
            />
            <Button type="button" onClick={handleAddModule} size="sm">
              Ավելացնել
            </Button>
          </div>
          {course.modules && course.modules.length > 0 && (
            <ul className="space-y-1 mt-2">
              {course.modules.map((module, index) => (
                <li key={index} className="flex justify-between items-center bg-secondary/30 p-2 rounded">
                  {module}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveModule(index)}
                    className="h-5 w-5 text-destructive"
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
