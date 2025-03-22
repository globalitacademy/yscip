
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import Hero from '@/components/hero/Hero';
import FeaturesSection from '@/components/features';
import Footer from '@/components/Footer';
import CoursesSection from '@/components/courses/CoursesSection';
import ProfessionalCoursesSection from '@/components/courses/ProfessionalCoursesSection';
import { HomePageModules } from '@/components/educationalCycle/HomePageModules';
import ProjectTabs from '@/components/projects/ProjectTabs';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [heroRef, heroInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [coursesRef, coursesInView] = useInView();
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

      {/* Educational Cycle */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Կրթական ցիկլ</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Մեր կրթական ցիկլը ներառում է տարբեր մոդուլներ, որոնք օգնում են ուսանողներին 
              զարգացնել իրենց հմտությունները և ձեռք բերել նոր գիտելիքներ:
            </p>
          </div>
          
          <HomePageModules />

          <div className="text-center mt-10">
            <Link to="/modules">
              <Button variant="outline" className="mt-4 group">
                Դիտել բոլոր մոդուլները
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
