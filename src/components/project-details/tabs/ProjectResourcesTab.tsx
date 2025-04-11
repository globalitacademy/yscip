
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectResourcesTabProps {
  project: ProjectTheme;
  isEditing?: boolean;
  onSaveChanges?: (updates: Partial<ProjectTheme>) => Promise<any>;
}

const ProjectResourcesTab: React.FC<ProjectResourcesTabProps> = ({ 
  project, 
  isEditing = false,
  onSaveChanges = async () => false
}) => {
  const resources = project.resources || [];
  const links = project.links || [];

  return (
    <div className="space-y-8">
      {/* Resources section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ռեսուրսներ</h2>
        {resources.length === 0 ? (
          <p className="text-muted-foreground">Այս նախագծի համար ռեսուրսներ նշված չեն:</p>
        ) : (
          <ul className="space-y-2">
            {resources.map((resource, index) => (
              <li key={index} className="flex items-center space-x-2">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {resource.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Links section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Օգտակար հղումներ</h2>
        {links.length === 0 ? (
          <p className="text-muted-foreground">Այս նախագծի համար հղումներ նշված չեն:</p>
        ) : (
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={index} className="flex items-center space-x-2">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectResourcesTab;
