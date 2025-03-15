
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import AccessDenied from '@/components/project-submission/AccessDenied';
import ProjectSubmissionForm from '@/components/project-submission/ProjectSubmissionForm';
import SubmissionHistory from '@/components/project-submission/SubmissionHistory';

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
  
  const [activeTab, setActiveTab] = useState('new');
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      title: 'Անձնական կաբինետ',
      submittedDate: new Date(2023, 10, 15),
      status: 'pending',
      feedback: '',
    },
    {
      id: '2',
      title: 'Բազային ներկայացում',
      submittedDate: new Date(2023, 9, 20),
      status: 'approved',
      feedback: 'Լավ աշխատանք։ Շարունակեք նույն տեմպով։',
    },
    {
      id: '3',
      title: 'Նախնական առաջադրանք',
      submittedDate: new Date(2023, 8, 5),
      status: 'rejected',
      feedback: 'Անհրաժեշտ է վերանայել տեխնիկական մասնագրերը։',
    }
  ]);

  const handleSubmissionSuccess = (newSubmission: Submission) => {
    setSubmissions(prev => [newSubmission, ...prev]);
    setActiveTab('history');
  };

  if (!canSubmitProject) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AccessDenied />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Նախագծի տեղադրում</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">Նոր տեղադրում</TabsTrigger>
            <TabsTrigger value="history">Ներկայացված նախագծեր</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="mt-6">
            <ProjectSubmissionForm onSubmitSuccess={handleSubmissionSuccess} />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <SubmissionHistory submissions={submissions} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectSubmissionPage;
