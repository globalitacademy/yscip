
import React from 'react';
import Hero from '@/components/Hero';
import LocalTransitions from '@/components/LocalTransitions';
import ThemeGrid from '@/components/ThemeGrid';
import { Button } from '@/components/ui/button';
import { createAdminUser } from '@/hooks/createAdmin';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const handleCreateAdmin = async () => {
    try {
      await createAdminUser();
    } catch (error) {
      toast.error('Սխալ ադմին օգտատեր ստեղծելիս');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Hero />
        <LocalTransitions />
        <ThemeGrid />
        
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleCreateAdmin}
            className="mb-8"
          >
            Ստեղծել ադմին օգտատեր
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
