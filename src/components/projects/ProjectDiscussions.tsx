
import React from 'react';

interface ProjectDiscussionsProps {
  projectId: number;
  isEditing?: boolean; // Add isEditing prop
}

const ProjectDiscussions: React.FC<ProjectDiscussionsProps> = ({ projectId, isEditing = false }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Քննարկումներ</h3>
      
      {isEditing ? (
        <div className="p-6 border border-dashed border-primary/30 rounded-md bg-primary/5 text-center">
          <p className="text-muted-foreground">Քննարկումների խմբագրումը դեռևս հասանելի չէ</p>
          <p className="text-sm text-muted-foreground mt-1">Այս հատվածը կթարմացվի հետագա թարմացումներում</p>
        </div>
      ) : (
        <div className="p-6 border border-border rounded-md bg-muted/20 text-center">
          <p className="text-muted-foreground">Այս նախագծի համար դեռևս քննարկումներ չկան</p>
          <p className="text-sm text-muted-foreground mt-1">Սկսեք նոր քննարկում այս նախագծի վերաբերյալ</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDiscussions;
