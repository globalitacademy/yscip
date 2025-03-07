
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProjectProposalForm from '@/components/project-proposals/ProjectProposalForm';
import ProjectProposalsList from '@/components/project-proposals/ProjectProposalsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProjectProposalsPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Նախագծերի առաջարկներ">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full md:w-auto mb-6">
          <TabsTrigger value="list">Իմ առաջարկները</TabsTrigger>
          <TabsTrigger value="create">Նոր առաջարկ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          <ProjectProposalsList />
        </TabsContent>
        
        <TabsContent value="create" className="mt-0">
          <ProjectProposalForm />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ProjectProposalsPage;
