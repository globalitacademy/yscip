
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import FileUpload from './FileUpload';

interface ProjectData {
  title: string;
  description: string;
  githubUrl: string;
  additionalInfo: string;
}

interface ProjectSubmissionFormProps {
  onSubmitSuccess: (newSubmission: {
    id: string;
    title: string;
    submittedDate: Date;
    status: string;
    feedback: string;
  }) => void;
}

const ProjectSubmissionForm: React.FC<ProjectSubmissionFormProps> = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    githubUrl: '',
    additionalInfo: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.title || !projectData.description) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը։');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create new submission
      const newSubmission = {
        id: Math.random().toString(36).substring(2, 9),
        title: projectData.title,
        submittedDate: new Date(),
        status: 'pending',
        feedback: '',
      };
      
      // Pass the new submission to parent component
      onSubmitSuccess(newSubmission);
      
      // Reset form
      setProjectData({
        title: '',
        description: '',
        githubUrl: '',
        additionalInfo: '',
      });
      setFiles([]);
      
      toast.success('Նախագիծը հաջողությամբ ներկայացվել է։');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Նոր նախագծի տեղադրում</CardTitle>
        <CardDescription>
          Ներկայացրեք Ձեր նախագիծը ստուգման և գնահատման համար
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Նախագծի անվանումը <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              name="title"
              value={projectData.title}
              onChange={handleInputChange}
              placeholder="Օր․՝ Տեղեկատվական համակարգ ուսանողների համար"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Նկարագրություն <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              value={projectData.description}
              onChange={handleInputChange}
              placeholder="Մանրամասն նկարագրեք Ձեր նախագիծը, նշելով հիմնական ֆունկցիոնալությունը, տեխնոլոգիաները և այլն"
              rows={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub հղում</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              value={projectData.githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repository"
            />
          </div>
          
          <FileUpload 
            files={files}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Լրացուցիչ տեղեկություններ</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={projectData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Նշեք ցանկացած լրացուցիչ տեղեկություն, որը կարող է օգտակար լինել նախագծի գնահատման համար"
              rows={3}
            />
          </div>
          
          <CardFooter className="px-0 pt-6">
            <Button
              type="submit"
              className="ml-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Տեղադրվում է...
                </>
              ) : (
                'Տեղադրել նախագիծը'
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectSubmissionForm;
