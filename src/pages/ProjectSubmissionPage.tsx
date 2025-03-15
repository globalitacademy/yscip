
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import ProjectSubmissionForm from '@/components/project-submission/ProjectSubmissionForm';
import SubmissionHistory from '@/components/project-submission/SubmissionHistory';
import AccessDenied from '@/components/project-submission/AccessDenied';

interface Submission {
  id: string;
  title: string;
  submittedDate: Date;
  status: string;
  feedback: string;
}

const ProjectSubmissionPage: React.FC = () => {
  const { user } = useAuth();
  const { canSubmitProject } = useProjectPermissions(user?.role);
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      title: 'Վեբ հավելված օգտատերերի համար',
      submittedDate: new Date(2023, 9, 15),
      status: 'pending',
      feedback: ''
    },
    {
      id: '2',
      title: 'Մոբայլ հավելվածի նախատիպ',
      submittedDate: new Date(2023, 8, 20),
      status: 'approved',
      feedback: 'Շատ լավ աշխատանք է: Մաքուր կոդ և հիանալի փաստաթղթավորում:'
    },
    {
      id: '3',
      title: 'ՀՀԴ կիրառություն',
      submittedDate: new Date(2023, 7, 5),
      status: 'rejected',
      feedback: 'Պահանջվում է վերանայում: Խնդրում ենք կատարել նշված փոփոխությունները և նորից ներկայացնել:'
    }
  ]);

  const handleSubmitProject = (project: any) => {
    const newSubmission: Submission = {
      id: Date.now().toString(),
      title: project.title,
      submittedDate: new Date(),
      status: 'pending',
      feedback: ''
    };
    
    setSubmissions([newSubmission, ...submissions]);
  };

  // If user doesn't have permission to submit projects, show access denied
  if (!canSubmitProject) {
    return (
      <AdminLayout pageTitle="Նախագծի տեղադրում">
        <AccessDenied />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Նախագծի տեղադրում">
      <Tabs defaultValue="new-submission" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="new-submission">Նոր ներկայացում</TabsTrigger>
          <TabsTrigger value="history">Ներկայացումների պատմություն</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-submission" className="space-y-4">
          <ProjectSubmissionForm onSubmit={handleSubmitProject} />
        </TabsContent>
        
        <TabsContent value="history">
          <SubmissionHistory submissions={submissions} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ProjectSubmissionPage;
