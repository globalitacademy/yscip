
import React from 'react';
import Hero from '@/components/Hero';
import { FadeIn, SlideUp, SlideDown, StaggeredContainer } from '@/components/LocalTransitions';
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
        <FadeIn>
          <h2 className="text-2xl font-bold mb-4 text-center">Անցումային էֆեկտներ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <SlideUp className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-2">Վերևից ներքև</h3>
              <p>Այս բլոկը հայտնվում է ներքևից վերև սահելով</p>
            </SlideUp>
            <FadeIn className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md delay-150">
              <h3 className="font-bold mb-2">Աստիճանաբար</h3>
              <p>Այս բլոկը պարզապես աստիճանաբար հայտնվում է</p>
            </FadeIn>
            <SlideDown className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md delay-300">
              <h3 className="font-bold mb-2">Վերևից ներքև</h3>
              <p>Այս բլոկը հայտնվում է վերևից ներքև սահելով</p>
            </SlideDown>
          </div>
        </FadeIn>
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
