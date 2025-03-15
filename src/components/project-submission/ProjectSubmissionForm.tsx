
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, { message: 'Վերնագիրը պետք է լինի առնվազն 5 նիշ' }),
  description: z.string().min(20, { message: 'Նկարագրությունը պետք է լինի առնվազն 20 նիշ' }),
  projectType: z.string().min(1, { message: 'Ընտրեք նախագծի տեսակը' }),
  courseOrModule: z.string().min(1, { message: 'Ընտրեք դասընթացը կամ մոդուլը' }),
});

interface ProjectSubmissionFormProps {
  onSubmit: (data: any) => void;
}

const ProjectSubmissionForm: React.FC<ProjectSubmissionFormProps> = ({ onSubmit }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      projectType: '',
      courseOrModule: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check file size (max 10MB)
      const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "Ֆայլի չափը գերազանցում է սահմանափակումը",
          description: "Ֆայլի առավելագույն չափը 10 ՄԲ է",
          variant: "destructive",
        });
        return;
      }
      
      // Check allowed extensions
      const allowedTypes = ['.pdf', '.docx', '.pptx', '.zip', '.rar'];
      const invalidFiles = newFiles.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return !allowedTypes.includes(ext);
      });
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Չաջակցվող ֆայլի ձևաչափ",
          description: "Թույլատրվում են միայն .pdf, .docx, .pptx, .zip, .rar ֆայլերը",
          variant: "destructive",
        });
        return;
      }
      
      // Add new files
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    if (files.length === 0) {
      toast({
        title: "Ֆայլեր չեն ընտրվել",
        description: "Խնդրում ենք կցել առնվազն մեկ ֆայլ",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate file upload
    setTimeout(() => {
      const submissionData = {
        ...values,
        files: files.map(f => ({ name: f.name, size: f.size })),
      };
      
      onSubmit(submissionData);
      
      // Reset form and state
      form.reset();
      setFiles([]);
      setIsSubmitting(false);
      
      toast({
        title: "Նախագիծը հաջողությամբ ներկայացվել է",
        description: "Շնորհակալություն ձեր նախագիծը ներկայացնելու համար։",
      });
    }, 1500);
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Նախագծի ներկայացում</CardTitle>
        <CardDescription>
          Լրացրեք ձեր նախագծի մանրամասները և կցեք համապատասխան ֆայլերը
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Նախագծի անվանում</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Մուտքագրեք նախագծի անվանումը" 
                      {...field} 
                    />
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
                      placeholder="Նախագծի համառոտ նկարագրություն" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Նախագծի տեսակ</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ընտրեք տեսակը" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="course-project">Կուրսային աշխատանք</SelectItem>
                        <SelectItem value="diploma-project">Դիպլոմային աշխատանք</SelectItem>
                        <SelectItem value="practice-project">Պրակտիկայի նախագիծ</SelectItem>
                        <SelectItem value="research-project">Հետազոտական նախագիծ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="courseOrModule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Դասընթաց/Մոդուլ</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ընտրեք դասընթացը" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web-programming">Վեբ ծրագրավորում</SelectItem>
                        <SelectItem value="mobile-development">Մոբայլ ծրագրավորում</SelectItem>
                        <SelectItem value="ai-ml">Արհեստական բանականություն</SelectItem>
                        <SelectItem value="databases">Տվյալների բազաներ</SelectItem>
                        <SelectItem value="software-engineering">Ծրագրային ապահովման ճարտարագիտություն</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FileUpload
                files={files}
                onFileChange={handleFileChange}
                onRemoveFile={handleRemoveFile}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Ներկայացվում է...
                </>
              ) : (
                'Ներկայացնել նախագիծը'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProjectSubmissionForm;
