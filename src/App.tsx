
import { useEffect } from 'react';
import { Routes } from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectManagementProvider } from './contexts/ProjectManagementContext';
import { useToast } from "@/components/ui/use-toast";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import '@/styles/editor.css'; // Import editor styles

function App() {
  const { toast } = useToast();
  
  useEffect(() => {
    // Any app initialization logic can go here
    
    // Example toast to confirm app has loaded
    // toast({
    //   title: "Բարի գալուստ",
    //   description: "Համակարգը հաջողությամբ բեռնվել է։",
    // });
  }, []);
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectManagementProvider>
          <Routes />
          <Toaster />
          <SonnerToaster position="top-right" />
        </ProjectManagementProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
