
import React from 'react';
import { Course } from '@/components/courses/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { Save, X } from 'lucide-react';

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Վերնագիրը պետք է լինի առնվազն 3 նիշ" }),
  subtitle: z.string().optional(),
  description: z.string().min(10, { message: "Նկարագրությունը պետք է լինի առնվազն 10 նիշ" }),
  duration: z.string(),
  price: z.string(),
  specialization: z.string().optional(),
  institution: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseEditFormProps {
  form: UseFormReturn<CourseFormValues>;
  onSubmit: (values: CourseFormValues) => void;
  handleEditToggle: () => void;
}

const CourseEditForm: React.FC<CourseEditFormProps> = ({
  form,
  onSubmit,
  handleEditToggle
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Վերնագիր</FormLabel>
              <FormControl>
                <Input placeholder="Դասընթացի վերնագիր" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ենթավերնագիր</FormLabel>
              <FormControl>
                <Input placeholder="Դասընթացի ենթավերնագիր" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Տևողություն</FormLabel>
              <FormControl>
                <Input placeholder="Օր.՝ 6 ամիս" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Արժեք</FormLabel>
              <FormControl>
                <Input placeholder="Օր.՝ 58,000 ֏" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Նկարագրություն</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Դասընթացի մանրամասն նկարագրություն" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Մասնագիտացում</FormLabel>
              <FormControl>
                <Input placeholder="Մասնագիտացում" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Հաստատություն</FormLabel>
              <FormControl>
                <Input placeholder="Օր.՝ Qolej" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 pt-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Պահպանել
          </Button>
          <Button type="button" variant="outline" onClick={handleEditToggle}>
            <X className="h-4 w-4 mr-2" />
            Չեղարկել
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseEditForm;
export { courseFormSchema };
