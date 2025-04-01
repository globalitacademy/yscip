
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const NotFound: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Էջը չի գտնվել</h2>
        <p className="text-muted-foreground">
          Ցավոք, ձեր փնտրած էջը գոյություն չունի։ Հնարավոր է, որ այն տեղափոխվել է կամ ժամանակավորապես անհասանելի է։
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link to="/">Վերադառնալ գլխավոր էջ</Link>
          </Button>
          
          {isAdmin && (
            <Button variant="outline" asChild>
              <Link to="/admin">Վերադառնալ ադմինիստրատորի վահանակ</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
