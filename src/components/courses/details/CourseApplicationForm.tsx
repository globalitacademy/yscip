
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalCourse } from "../types/ProfessionalCourse";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Define the form schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Անունը պարտադիր է" }),
  phoneNumber: z.string().min(8, { message: "Հեռախոսահամարը պարտադիր է" }),
  email: z.string().email({ message: "Էլ. հասցեն սխալ է մուտքագրված" }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseApplicationFormProps {
  course: ProfessionalCourse;
  isOpen: boolean;
  onClose: () => void;
}

const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Create application object
      const application = {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        email: data.email,
        message: data.message || "",
        course_id: course.id,
        course_title: course.title,
        status: 'new'
      };

      // Store in localStorage for now (will be replaced with database storage later)
      const existingApplications = JSON.parse(localStorage.getItem('course_applications') || '[]');
      existingApplications.push(application);
      localStorage.setItem('course_applications', JSON.stringify(existingApplications));
      
      // Also send application to admin email (using localStorage for now)
      const adminNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
      adminNotifications.push({
        id: uuidv4(),
        title: 'New Course Application',
        message: `${data.fullName} applied for ${course.title}`,
        date: new Date().toISOString()
      });
      localStorage.setItem('admin_notifications', JSON.stringify(adminNotifications));

      // Success message
      toast.success('Դիմումն ուղարկված է', {
        description: 'Շուտով կապ կհաստատենք ձեզ հետ'
      });

      // Reset form and close dialog
      form.reset();
      onClose();
    } catch (err) {
      console.error('Application submission error:', err);
      toast.error('Դիմման ուղարկման սխալ', {
        description: 'Խնդրում ենք փորձել կրկին'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Դիմել դասընթացին</DialogTitle>
          <DialogDescription>
            Թողեք ձեր տվյալները և մենք կապ կհաստատենք ձեզ հետ
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Անուն Ազգանուն</FormLabel>
                  <FormControl>
                    <Input placeholder="Օր.՝ Անի Հակոբյան" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Հեռախոսահամար</FormLabel>
                  <FormControl>
                    <Input placeholder="Օր.՝ +374 XX XXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Էլ. փոստի հասցե</FormLabel>
                  <FormControl>
                    <Input placeholder="Օր.՝ ani@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Հաղորդագրություն (ոչ պարտադիր)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Լրացուցիչ տեղեկություններ կամ հարցեր..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Չեղարկել
              </Button>
              <Button type="submit">Ուղարկել դիմումը</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseApplicationForm;
