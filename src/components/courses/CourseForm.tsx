import React from 'react';
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
  course: Course;
  setCourse: (course: Course) => void;
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
  return (
    <Form>
      <div className="space-y-4">
        <FormField
          control={{ value: course.title, onChange: (value) => setCourse({ ...course, title: value }) }}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Անվանում</FormLabel>
              <FormControl>
                <Input placeholder="Դասընթացի անվանումը" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={{ value: course.description, onChange: (value) => setCourse({ ...course, description: value }) }}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Նկարագրություն</FormLabel>
              <FormControl>
                <Textarea placeholder="Դասընթացի նկարագրությունը" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={{ value: course.instructor, onChange: (value) => setCourse({ ...course, instructor: value }) }}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Դասախոս</FormLabel>
              <FormControl>
                <Input placeholder="Դասախոսի անունը" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={{ value: course.duration, onChange: (value) => setCourse({ ...course, duration: value }) }}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Տևողություն</FormLabel>
              <FormControl>
                <Input placeholder="Օրինակ՝ 3 ամիս" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={{
            value: course.category || '',
            onChange: (value) => setCourse({ ...course, category: value }),
          }}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Կատեգորիա</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Ընտրեք կատեգորիա" />
                  </SelectTrigger>
                </FormControl>
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
          )}
        />

        <FormField
          control={{ value: course.is_public, onChange: (value) => setCourse({ ...course, is_public: value }) }}
          name="is_public"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Հրապարակային է</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </Form>
  );
};

export default CourseForm;
