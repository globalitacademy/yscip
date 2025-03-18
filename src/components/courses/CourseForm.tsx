
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Course } from './types';
import { mockSpecializations } from './useCourseManagement';

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
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Կուրսի անվանումը</Label>
        <Input
          id="title"
          value={course.title || ''}
          onChange={(e) => setCourse({...course, title: e.target.value})}
          placeholder="Օր.՝ JavaScript ծրագրավորում"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Նկարագրություն</Label>
        <Textarea
          id="description"
          value={course.description || ''}
          onChange={(e) => setCourse({...course, description: e.target.value})}
          placeholder="Կուրսի մանրամասն նկարագրություն"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialization">Մասնագիտություն</Label>
        <Select 
          value={course.specialization || ''}
          onValueChange={(value) => setCourse({...course, specialization: value})}
        >
          <SelectTrigger>
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
      
      <div className="space-y-2">
        <Label htmlFor="duration">Տևողություն</Label>
        <Input
          id="duration"
          value={course.duration || ''}
          onChange={(e) => setCourse({...course, duration: e.target.value})}
          placeholder="Օր.՝ 3 ամիս"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="module">Մոդուլներ</Label>
        <div className="flex space-x-2">
          <Input
            id="module"
            value={newModule}
            onChange={(e) => setNewModule(e.target.value)}
            placeholder="Մոդուլի անվանումը"
          />
          <Button type="button" variant="outline" onClick={handleAddModule}>
            Ավելացնել
          </Button>
        </div>
        
        {course.modules && course.modules.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {course.modules.map((module, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {module}
                <button 
                  type="button" 
                  onClick={() => handleRemoveModule(index)}
                  className="ml-1 text-xs text-red-500 hover:text-red-700"
                  aria-label="Remove module"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseForm;
