import React, { useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import Footer from '@/components/Footer';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/hero';
import Header from '@/components/Header';
import { CollaborativePointers } from '@/components/collaborative';

// Lazy load components that are not immediately visible
const FeaturesSection = lazy(() => import('@/components/features/FeaturesSection'));
const CoursesSection = lazy(() => import('@/components/courses/CoursesSection'));
const ProfessionalCoursesSection = lazy(() => import('@/components/courses/ProfessionalCoursesSection'));
const EducationalCycleInfographic = lazy(() => import('@/components/educationalCycle/EducationalCycleInfographic'));
const HomePageModules = lazy(() => import('@/components/educationalCycle/HomePageModules'));
const ProjectTabs = lazy(() => import('@/components/projects/ProjectTabs'));
const ThemeGrid = lazy(() => import('@/components/ThemeGrid'));

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
  const [modulesRef, modulesInView] = useInView<HTMLDivElement>();
  const [projectsRef, projectsInView] = useInView<HTMLDivElement>();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleProjectsViewAll = () => {
    navigate('/projects');
  };

  return (
    <div className="flex flex-col min-h-screen pt-16"> {/* Added pt-16 for header height */}
      {/* Header */}
      <Header />
      
      {/* Collaborative Pointers - only on home page */}
      <CollaborativePointers 
        virtualUsersCount={4} 
        currentUserName="Դուք"
        currentUserColor="hsl(var(--primary))"
        currentUserRole="Ուսանող"
      />
      
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

      {/* Educational Modules Section */}
      <div
        ref={modulesRef}
        className={`transition-opacity duration-1000 ${
          modulesInView ? 'opacity-100' : 'opacity-0'
        }`}
        id="modules"
      >
        <Suspense fallback={<SectionSkeleton />}>
          <HomePageModules />
        </Suspense>
      </div>

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
          <ProfessionalCoursesSection courses={[]} />
        </Suspense>
      </div>

      {/* Projects Section */}
      <div 
        ref={projectsRef}
        className={`transition-opacity duration-1000 py-12 ${
          projectsInView ? 'opacity-100' : 'opacity-0'
        }`}
        id="projects"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Նախագծային թեմաներ</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            Ուսումնասիրեք մեր առաջարկվող նախագծային թեմաները, որոնք օգնում են կիրառել ձեր գիտելիքները գործնականում
          </p>
          <Suspense fallback={<SectionSkeleton />}>
            <ProjectManagementProvider>
              <ThemeGrid limit={6} />
            </ProjectManagementProvider>
          </Suspense>
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={handleProjectsViewAll}>
              Դիտել բոլոր նախագծերը <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
