
import React from 'react';

interface ProjectFilesProps {
  projectId: number;
  isEditing?: boolean; // Add isEditing prop
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId, isEditing = false }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Ֆայլեր</h3>
      
      {isEditing ? (
        <div className="p-6 border border-dashed border-primary/30 rounded-md bg-primary/5 text-center">
          <p className="text-muted-foreground">Ֆայլերի խմբագրումը դեռևս հասանելի չէ</p>
          <p className="text-sm text-muted-foreground mt-1">Այս հատվածը կթարմացվի հետագա թարմացումներում</p>
        </div>
      ) : (
        <div className="p-6 border border-border rounded-md bg-muted/20 text-center">
          <p className="text-muted-foreground">Այս նախագծի համար դեռևս ֆայլեր չկան</p>
          <p className="text-sm text-muted-foreground mt-1">Ավելացրեք ֆայլեր այս նախագծի համար</p>
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;
