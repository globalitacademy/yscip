
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/features';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import UserReservedProjects from '@/components/user/UserReservedProjects';
import ProjectTabs from '@/components/projects/ProjectTabs';
import EducationalCycleInfographic from '@/components/educationalCycle';
import CoursesSection from '@/components/courses/CoursesSection';
import ProfessionalCoursesSection from '@/components/courses/ProfessionalCoursesSection';
import { projectService } from '@/services/projectService';

const Index = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [reservedProjects, setReservedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load projects from database on component mount
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await projectService.fetchProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Նախագծերի բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  useEffect(() => {
    try {
      const assignmentsData = localStorage.getItem('projectAssignments');
      if (assignmentsData) {
        const parsedAssignments = JSON.parse(assignmentsData);
        setAssignments(parsedAssignments || []);
      }
    } catch (e) {
      console.error('Error loading project assignments:', e);
      setAssignments([]);
    }
  }, []);
  
  useEffect(() => {
    if (user) {
      try {
        const reservedData = localStorage.getItem('reservedProjects');
        if (reservedData) {
          const reservations = JSON.parse(reservedData);
          const userReservations = user.role === 'student' 
            ? reservations.filter((res: any) => res.userId === user.id)
            : reservations;
          
          setReservedProjects(userReservations);
        }
      } catch (e) {
        console.error('Error loading reserved projects:', e);
      }
    }
  }, [user]);

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
    const project = projects.find(p => Number(p.id) === Number(rp.projectId));
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
            createdProjects={[]} 
            assignments={assignments}
            projectThemes={projects}
          />
        </div>
        <ProfessionalCoursesSection />
        <CoursesSection />
        <EducationalCycleInfographic />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
