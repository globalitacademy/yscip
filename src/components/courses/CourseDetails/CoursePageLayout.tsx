
import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface CoursePageLayoutProps {
  children: ReactNode;
}

const CoursePageLayout: React.FC<CoursePageLayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const isAdminUser = isAuthenticated && user && ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user.role);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex relative">
        {isAdminUser && (
          <>
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
          </>
        )}
        
        <main className={`flex-grow ${isAdminUser ? 'w-full md:pl-64' : 'w-full'}`}>
          <div className="container px-4 py-8 mx-auto max-w-4xl">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default CoursePageLayout;
