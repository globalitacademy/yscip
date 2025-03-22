
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import FeaturesSection from '@/components/features';
import Footer from '@/components/Footer';
import CoursesSection from '@/components/courses/CoursesSection';
import ProfessionalCoursesSection from '@/components/courses/ProfessionalCoursesSection';
import EducationalCycleInfographic from '@/components/educationalCycle/EducationalCycleInfographic';
import ProjectTabs from '@/components/projects/ProjectTabs';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/hero';
import Header from '@/components/Header';

const Index = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>();
  const [featuresRef, featuresInView] = useInView<HTMLDivElement>();
  const [coursesRef, coursesInView] = useInView<HTMLDivElement>();
  const { user } = useAuth();

  // Scroll to module on load if URL contains module hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <div
        ref={heroRef}
        className={`transition-opacity duration-1000 ${
          heroInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Hero />
      </div>

      {/* Features Section */}
      <div
        ref={featuresRef}
        className={`transition-opacity duration-1000 ${
          featuresInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FeaturesSection />
      </div>

      {/* Educational Cycle Infographic */}
      <EducationalCycleInfographic />

      {/* Courses Section */}
      <div
        ref={coursesRef}
        className={`transition-opacity duration-1000 ${
          coursesInView ? 'opacity-100' : 'opacity-0'
        }`}
        id="courses"
      >
        <CoursesSection />
        <ProfessionalCoursesSection />
      </div>

      {/* Projects Section */}
      <div className="container mx-auto px-4 pb-16">
        <ProjectManagementProvider>
          <ProjectTabs 
            user={user}
            createdProjects={[]} 
            assignments={[]} 
            projectThemes={[]}
          />
        </ProjectManagementProvider>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
