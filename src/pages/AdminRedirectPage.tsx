
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRedirectPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default AdminRedirectPage;
