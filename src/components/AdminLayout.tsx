
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const { user, isAuthenticated, isApproved, loading, error } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  
  // Enforce admin access
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role !== 'admin') {
        toast.error("Մուտքը արգելափակված է", {
          description: "Ձեզ չունեք բավարար իրավունք այս էջը դիտելու համար"
        });
        navigate('/');
      }
    }
  }, [loading, isAuthenticated, user, navigate]);
  
  // Show loading state
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
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-semibold text-destructive mb-4">Նույնականացման սխալ</h2>
          <p className="mb-4">{error.message}</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')}
          >
            Վերադառնալ մուտքի էջ
          </Button>
        </div>
      </div>
    );
  }
  
  // Redirect if not authenticated or doesn't have appropriate role
  if (!isAuthenticated || !user) {
    console.log("User not authenticated, redirecting to login");
    toast.error("Մուտքը արգելափակված է", {
      description: "Նախքան շարունակելը, խնդրում ենք մուտք գործել համակարգ"
    });
    return <Navigate to="/login" replace />;
  }
  
  // Check for appropriate role - be strict about admin role specifically
  if (user.role !== 'admin') {
    console.log("User doesn't have admin role, redirecting to dashboard");
    toast.error("Մուտքը արգելափակված է", {
      description: "Ձեզ չունեք բավարար իրավունք այս էջը դիտելու համար"
    });
    
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'lecturer':
      case 'instructor':
        return <Navigate to="/teacher-dashboard" replace />;
      case 'project_manager':
      case 'supervisor':
        return <Navigate to="/project-manager-dashboard" replace />;
      case 'employer':
        return <Navigate to="/employer-dashboard" replace />;
      case 'student':
        return <Navigate to="/student-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  // Check if approved
  if (!isApproved) {
    console.log("User not approved, redirecting to approval pending page");
    return <Navigate to="/approval-pending" replace />;
  }
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex relative">
        {/* Mobile sidebar toggle */}
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden absolute top-4 left-4 z-50" 
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {/* Sidebar - hidden on mobile unless toggled */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block md:static absolute inset-0 z-40 bg-background/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none`}>
          <div className="h-full overflow-auto">
            <AdminSidebar onCloseMenu={() => setIsSidebarOpen(false)} />
          </div>
        </div>
        
        {/* Main content area with responsive padding */}
        <main className="flex-grow w-full">
          <div className="container mx-auto px-4 py-8">
            {pageTitle && (
              <h1 className="text-2xl md:text-3xl font-bold mb-6 mt-8 md:mt-0">{pageTitle}</h1>
            )}
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
