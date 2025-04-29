
import React from 'react';
import EditableList from '@/components/common/EditableList';

interface ProjectStepsProps {
  steps: string[] | undefined;
  isEditing: boolean;
  onChange: (steps: string[]) => void;
}

const ProjectSteps: React.FC<ProjectStepsProps> = ({
  steps,
  isEditing,
  onChange
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Իրականացման քայլեր</h2>
      {isEditing ? (
        <EditableList 
          items={steps || []}
          onChange={onChange}
          placeholder="Մուտքագրեք նոր քայլը..."
          listType="steps"
          disabled={!isEditing}
        />
      ) : (
        <div className="space-y-3 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>
          {steps?.map((step, index) => (
            <div key={index} className="flex items-start gap-4 pl-4 relative">
              <div className="absolute left-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary z-10">
                {index + 1}
              </div>
              <div className="bg-accent/40 rounded-lg p-4 w-full">
                <p>{step}</p>
              </div>
            </div>
          ))}
          {(!steps || steps.length === 0) && (
            <p className="text-muted-foreground italic pl-4">Քայլեր չեն նշված</p>
          )}
        </div>
      )}
    </section>
  );
};

export default ProjectSteps;
