
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const { user, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { theme } = useTheme();
  const location = useLocation();
  
  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col pt-16"> {/* Added pt-16 for header height */}
      <Header />
      <div className="flex-grow flex relative">
        {/* Mobile sidebar toggle */}
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden absolute top-4 left-4 z-40" 
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {/* Sidebar - hidden on mobile unless toggled */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block md:static absolute inset-0 z-30 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-background/80'} backdrop-blur-sm md:bg-transparent md:backdrop-blur-none`}>
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
