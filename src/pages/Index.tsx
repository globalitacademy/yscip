
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlideUp } from '@/components/LocalTransitions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import RoleBasedActions from '@/components/RoleBasedActions';
import ThemeProjectSection from '@/components/ThemeProjectSection';
import { useAuth } from '@/contexts/auth';

const Index: React.FC = () => {
  const { user, isAuthenticated, isApproved } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to role-specific dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!isApproved && user.role !== 'student') {
        return; // Stay on page for unapproved non-students
      }
      
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'lecturer':
        case 'instructor':
          navigate('/courses');
          break;
        case 'project_manager':
        case 'supervisor':
          navigate('/projects/manage');
          break;
        case 'employer':
          navigate('/projects/my');
          break;
        case 'student':
          navigate('/projects');
          break;
      }
    }
  }, [isAuthenticated, user, isApproved, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        <div className="container mx-auto px-4 py-12">
          <SlideUp className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ձեր դաշբորդը</h2>
              <p className="text-muted-foreground text-lg">
                Կառավարեք Ձեր նախագծերը և հետևեք առաջընթացին
              </p>
            </div>
            <RoleBasedActions 
              isAuthenticated={isAuthenticated} 
              user={user} 
              isApproved={isApproved} 
            />
          </SlideUp>
          
          <ThemeProjectSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
