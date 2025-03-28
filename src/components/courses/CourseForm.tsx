
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { mockSpecializations } from './hooks/useCourseInit';
import { Course } from './types';
import { useCourseContext } from '@/contexts/CourseContext';

interface CourseFormProps {
  course: Partial<Course>;
  setCourse: (course: Partial<Course>) => void;
  newModule: string;
  setNewModule: (module: string) => void;
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
  // Custom form control handlers
  const handleInputChange = (field: keyof Course, value: any) => {
    setCourse({ ...course, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <FormItem>
          <FormLabel>Անվանում</FormLabel>
          <Input 
            placeholder="Դասընթացի անվանումը" 
            value={course.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Նկարագրություն</FormLabel>
          <Textarea 
            placeholder="Դասընթացի նկարագրությունը" 
            value={course.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Դասախոս</FormLabel>
          <Input 
            placeholder="Դասախոսի անունը" 
            value={course.instructor || ''}
            onChange={(e) => handleInputChange('instructor', e.target.value)}
          />
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Տևողություն</FormLabel>
          <Input 
            placeholder="Օրինակ՝ 3 ամիս" 
            value={course.duration || ''}
            onChange={(e) => handleInputChange('duration', e.target.value)}
          />
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Կատեգորիա</FormLabel>
          <Select 
            value={course.category || ''} 
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ընտրեք կատեգորիա" />
            </SelectTrigger>
            <SelectContent>
              {mockSpecializations.map((specialization) => (
                <SelectItem key={specialization} value={specialization}>
                  {specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>

        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-sm">Հրապարակային է</FormLabel>
          </div>
          <Switch
            checked={course.is_public || false}
            onCheckedChange={(checked) => handleInputChange('is_public', checked)}
          />
          <FormMessage />
        </FormItem>

        <div>
          <FormLabel>Մոդուլներ</FormLabel>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Մոդուլի անվանումը"
              value={newModule}
              onChange={(e) => setNewModule(e.target.value)}
            />
            <Button type="button" size="sm" onClick={handleAddModule}>
              Ավելացնել
            </Button>
          </div>
          <ul className="mt-2 space-y-1">
            {course.modules && course.modules.map((module, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{module}</span>
                <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveModule(index)}>
                  Հեռացնել
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
