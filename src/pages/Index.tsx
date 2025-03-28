import React, { useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import Footer from '@/components/Footer';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/hero';
import Header from '@/components/Header';

// Lazy load components that are not immediately visible
const FeaturesSection = lazy(() => import('@/components/features'));
const CoursesSection = lazy(() => import('@/components/courses/CoursesSection'));
const ProfessionalCoursesSection = lazy(() => import('@/components/courses/ProfessionalCoursesSection'));
const EducationalCycleInfographic = lazy(() => import('@/components/educationalCycle/EducationalCycleInfographic'));
const ProjectTabs = lazy(() => import('@/components/projects/ProjectTabs'));

// Loading fallback component
const SectionSkeleton = () => (
  <div className="w-full py-12 bg-gray-100 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-8 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(item => (
          <div key={item} className="bg-white h-64 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

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
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Small timeout to ensure components are rendered
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
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturesSection />
        </Suspense>
      </div>

      {/* Educational Cycle Infographic */}
      <Suspense fallback={<SectionSkeleton />}>
        <EducationalCycleInfographic />
      </Suspense>

      {/* Courses Section */}
      <div
        ref={coursesRef}
        className={`transition-opacity duration-1000 ${
          coursesInView ? 'opacity-100' : 'opacity-0'
        }`}
        id="courses"
      >
        <Suspense fallback={<SectionSkeleton />}>
          <CoursesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProfessionalCoursesSection />
        </Suspense>
      </div>

      {/* Projects Section */}
      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<SectionSkeleton />}>
          <ProjectManagementProvider>
            <ProjectTabs />
          </ProjectManagementProvider>
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
