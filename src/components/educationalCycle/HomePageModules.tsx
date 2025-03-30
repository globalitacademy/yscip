
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import ModuleTable from '@/components/admin/modules/components/ModuleTable';
import { educationalModules } from './moduleData';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePageModules: React.FC = () => {
  // Include only the first 6 modules for the homepage
  const visibleModules = educationalModules.slice(0, 6);

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Ուսումնական մոդուլներ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            Մեր ծրագրի հիմնական ուսումնական մոդուլները, որոնք անհրաժեշտ է անցնել ուսումնական ծրագիրն ավարտելու համար
          </p>
        </FadeIn>

        <FadeIn delay="delay-300">
          <ModuleTable 
            modules={visibleModules} 
            onEditClick={() => {}} 
            onDeleteClick={() => {}}
            displayMode="public"
          />
        </FadeIn>
        
        <FadeIn delay="delay-400">
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link to="/modules">
                Դիտել բոլոր մոդուլները <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default HomePageModules;
