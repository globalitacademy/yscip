
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/features';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { projectThemes } from '@/data/projectThemes';
import UserReservedProjects from '@/components/user/UserReservedProjects';
import ProjectTabs from '@/components/projects/ProjectTabs';
import EducationalCycleInfographic from '@/components/educationalCycle';
import CoursesSection from '@/components/courses/CoursesSection';
import HomePageModules from '@/components/educationalCycle/HomePageModules';

const Index = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [reservedProjects, setReservedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  useEffect(() => {
    const storedProjects = localStorage.getItem('createdProjects');
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setCreatedProjects(parsedProjects);
        console.log('Loaded created projects:', parsedProjects);
      } catch (e) {
        console.error('Error parsing stored projects:', e);
      }
    }
    
    const storedReservations = localStorage.getItem('reservedProjects');
    if (storedReservations) {
      try {
        const parsedReservations = JSON.parse(storedReservations);
        setReservedProjects(parsedReservations);
        console.log('Loaded reserved projects:', parsedReservations);
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
      }
    }
    
    const storedAssignments = localStorage.getItem('projectAssignments');
    if (storedAssignments) {
      try {
        const parsedAssignments = JSON.parse(storedAssignments);
        setAssignments(parsedAssignments);
        console.log('Loaded assignments:', parsedAssignments);
      } catch (e) {
        console.error('Error parsing assignments:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      const roleMap: Record<string, string> = {
        'student': 'Ուսանող',
        'instructor': 'Դասախոս',
        'admin': 'Ադմինիստրատոր',
        'supervisor': 'Ղեկավար'
      };
      
      const roleName = roleMap[user.role] || user.role;
      
      toast.success(`Մուտք եք գործել որպես ${roleName}`, {
        duration: 3000,
        position: 'top-right'
      });
    }
  }, [user]);

  const userReservedProjects = user 
    ? reservedProjects.filter(rp => rp.userId === user.id)
    : [];

  const userReservedProjectDetails = userReservedProjects.map(rp => {
    const project = [...projectThemes, ...createdProjects].find(p => Number(p.id) === Number(rp.projectId));
    return { ...rp, project };
  }).filter(rp => rp.project);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeaturesSection />
        <div id="themes-section" className="container mx-auto px-4 pb-16">
          {user && (
            <UserReservedProjects reservedProjects={userReservedProjectDetails} />
          )}
          
          <ProjectTabs 
            user={user} 
            createdProjects={createdProjects} 
            assignments={assignments}
            projectThemes={projectThemes}
          />
        </div>
        <CoursesSection />
        <HomePageModules />
        <EducationalCycleInfographic />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
