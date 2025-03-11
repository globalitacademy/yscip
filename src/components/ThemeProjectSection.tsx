
import React from 'react';
import { FadeIn } from './LocalTransitions';
import ThemeGrid from './ThemeGrid';
import ProjectGrid from './project/ProjectGrid';

const ThemeProjectSection: React.FC = () => {
  return (
    <div id="themes-section" className="pt-8">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Նախագծերի թեմաներ</h2>
          <p className="text-muted-foreground text-lg">
            Հետազոտեք մեր վերջին նախագծերի թեմաները
          </p>
        </div>
        <ThemeGrid limit={6} />
      </FadeIn>

      <FadeIn>
        <div className="text-center max-w-2xl mx-auto mb-12 mt-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Նախագծեր</h2>
          <p className="text-muted-foreground text-lg">
            Հետազոտեք մեր վերջին նախագծերը և միացեք դրանց
          </p>
        </div>
        <ProjectGrid projects={[]} />
      </FadeIn>
    </div>
  );
};

export default ThemeProjectSection;
