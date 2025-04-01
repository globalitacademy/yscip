
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task } from '@/data/projectThemes';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Վերնագիրը պետք է ունենա առնվազն 3 նիշ' }),
  description: z.string().min(10, { message: 'Նկարագրությունը պետք է ունենա առնվազն 10 նիշ' }),
  assignedTo: z.string({ required_error: 'Ընտրեք կատարողին' }),
  dueDate: z.string({ required_error: 'Ընտրեք վերջնաժամկետը' }),
});

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
  currentUserId: string;
  students: any[];
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onClose, currentUserId, students }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const newTask: Omit<Task, 'id'> = {
      title: values.title,
      description: values.description,
      status: 'todo',
      assignee: values.assignedTo,
      assignedTo: values.assignedTo,
      dueDate: values.dueDate,
      createdBy: currentUserId
    };
    onSubmit(newTask);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Նոր առաջադրանք</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Վերնագիր</FormLabel>
                <FormControl>
                  <Input placeholder="Առաջադրանքի վերնագիր" {...field} />
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
                    placeholder="Նկարագրեք առաջադրանքը" 
                    rows={3} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Կատարող</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Ընտրեք կատարողին" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Վերջնաժամկետ</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Չեղարկել
            </Button>
            <Button type="submit">Ավելացնել</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default TaskForm;
