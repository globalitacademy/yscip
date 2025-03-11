
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from '@/contexts/auth';
import { NotificationProvider } from '@/contexts/NotificationContext';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
          <Toaster />
          <SonnerToaster position="top-right" />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
