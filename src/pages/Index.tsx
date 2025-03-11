
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import UserReservedProjects from '@/components/user/UserReservedProjects';
import ProjectTabs from '@/components/tabs/ProjectTabs';
import { useProjectData } from '@/hooks/useProjectData';

const Index = () => {
  const { 
    user, 
    createdProjects,
    assignments,
    userReservedProjectDetails
  } = useProjectData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto px-4 pb-16">
          {user && userReservedProjectDetails.length > 0 && (
            <UserReservedProjects userReservedProjectDetails={userReservedProjectDetails} />
          )}
          
          <ProjectTabs 
            user={user}
            createdProjects={createdProjects}
            assignments={assignments}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
