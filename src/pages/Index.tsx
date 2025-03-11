
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlideUp } from '@/components/LocalTransitions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import RoleBasedActions from '@/components/RoleBasedActions';
import ThemeProjectSection from '@/components/ThemeProjectSection';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Index: React.FC = () => {
  const { user, isAuthenticated, isApproved, loading, error } = useAuth();
  const navigate = useNavigate();
  
  console.log("Index page - Auth state:", { isAuthenticated, user, isApproved, loading, error });
  
  // Show error toast if auth error occurs
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
      toast.error("Նույնականացման սխալ", {
        description: error.message
      });
    }
  }, [error]);
  
  // Redirect based on session if user data is not available yet
  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      if (isAuthenticated && !user) {
        console.log("User authenticated but no user data, checking session");
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data } = await supabase.rpc('get_user_role', { user_id: session.user.id });
          const role = data || 'student';
          
          console.log(`Session found for user ${session.user.id} with role ${role}, redirecting`);
          
          switch (role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'lecturer':
            case 'instructor':
              navigate('/teacher-dashboard');
              break;
            case 'project_manager':
            case 'supervisor':
              navigate('/project-manager-dashboard');
              break;
            case 'employer':
              navigate('/employer-dashboard');
              break;
            case 'student':
              navigate('/student-dashboard');
              break;
            default:
              // Stay on index if role is unknown
          }
        }
      }
    };
    
    if (isAuthenticated && !user && !loading) {
      checkSessionAndRedirect();
    }
  }, [isAuthenticated, user, loading, navigate]);
  
  // Regular redirection based on user role
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      console.log("User authenticated, redirecting based on role:", user.role);
      
      if (!isApproved && user.role !== 'student') {
        console.log("User not approved, navigating to approval pending page");
        navigate('/approval-pending');
        return;
      }
      
      switch (user.role) {
        case 'admin':
          console.log("Redirecting to admin dashboard");
          navigate('/admin');
          break;
        case 'lecturer':
        case 'instructor':
          console.log("Redirecting to teacher dashboard");
          navigate('/teacher-dashboard');
          break;
        case 'project_manager':
        case 'supervisor':
          console.log("Redirecting to project manager dashboard");
          navigate('/project-manager-dashboard');
          break;
        case 'employer':
          console.log("Redirecting to employer dashboard");
          navigate('/employer-dashboard');
          break;
        case 'student':
          console.log("Redirecting to student dashboard");
          navigate('/student-dashboard');
          break;
        default:
          console.log("Unknown role, staying on index");
      }
    }
  }, [isAuthenticated, user, isApproved, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Բեռնում...</p>
        </div>
      </div>
    );
  }

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
