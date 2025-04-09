
import React from 'react';

interface ProjectEvaluationProps {
  projectId: number;
  isEditing?: boolean; // Add isEditing prop
}

const ProjectEvaluation: React.FC<ProjectEvaluationProps> = ({ projectId, isEditing = false }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Գնահատական</h3>
      
      {isEditing ? (
        <div className="p-6 border border-dashed border-primary/30 rounded-md bg-primary/5 text-center">
          <p className="text-muted-foreground">Գնահատականների խմբագրումը դեռևս հասանելի չէ</p>
          <p className="text-sm text-muted-foreground mt-1">Այս հատվածը կթարմացվի հետագա թարմացումներում</p>
        </div>
      ) : (
        <div className="p-6 border border-border rounded-md bg-muted/20 text-center">
          <p className="text-muted-foreground">Այս նախագծի համար դեռևս գնահատականներ չկան</p>
          <p className="text-sm text-muted-foreground mt-1">Գնահատականները կհայտնվեն նախագծի ավարտից հետո</p>
        </div>
      )}
    </div>
  );
};

export default ProjectEvaluation;
