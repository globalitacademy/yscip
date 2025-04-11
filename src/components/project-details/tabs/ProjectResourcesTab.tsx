
import React, { useState } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrashIcon } from 'lucide-react';
import ProjectDetailSection from '../ProjectDetailSection';

interface ProjectResourcesTabProps {
  project: ProjectTheme;
  isEditing: boolean;
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<void>;
}

const ProjectResourcesTab: React.FC<ProjectResourcesTabProps> = ({ 
  project, 
  isEditing,
  onSaveChanges
}) => {
  const [resources, setResources] = useState<{ name: string; url: string }[]>(
    project.resources || []
  );
  const [links, setLinks] = useState<{ name: string; url: string }[]>(
    project.links || []
  );
  
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Handle adding a new resource
  const handleAddResource = () => {
    if (newResourceName && newResourceUrl) {
      const updatedResources = [...resources, { name: newResourceName, url: newResourceUrl }];
      setResources(updatedResources);
      setNewResourceName('');
      setNewResourceUrl('');
      
      // Save immediately
      onSaveChanges({
        resources: updatedResources
      });
    }
  };

  // Handle removing a resource
  const handleRemoveResource = (index: number) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    setResources(updatedResources);
    
    // Save immediately
    onSaveChanges({
      resources: updatedResources
    });
  };

  // Handle adding a new link
  const handleAddLink = () => {
    if (newLinkName && newLinkUrl) {
      const updatedLinks = [...links, { name: newLinkName, url: newLinkUrl }];
      setLinks(updatedLinks);
      setNewLinkName('');
      setNewLinkUrl('');
      
      // Save immediately
      onSaveChanges({
        links: updatedLinks
      });
    }
  };

  // Handle removing a link
  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
    
    // Save immediately
    onSaveChanges({
      links: updatedLinks
    });
  };

  return (
    <div className="space-y-6">
      {/* Resources Section */}
      <ProjectDetailSection 
        title="Ուսումնական ռեսուրսներ" 
        isEditing={isEditing}
      >
        {resources && resources.length > 0 ? (
          <ul className="space-y-2">
            {resources.map((resource, index) => (
              <li key={`resource-${index}`} className="flex items-center justify-between gap-2 py-2 border-b">
                <div>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {resource.name}
                  </a>
                </div>
                {isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveResource(index)}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Այս նախագծի համար չկան սահմանված ուսումնական ռեսուրսներ</p>
        )}
        
        {isEditing && (
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Input 
                placeholder="Ռեսուրսի անվանում" 
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
              />
              <Input 
                placeholder="URL" 
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
              />
              <Button onClick={handleAddResource}>Ավելացնել</Button>
            </div>
          </div>
        )}
      </ProjectDetailSection>
      
      {/* Links Section */}
      <ProjectDetailSection 
        title="Օգտակար հղումներ" 
        isEditing={isEditing}
      >
        {links && links.length > 0 ? (
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={`link-${index}`} className="flex items-center justify-between gap-2 py-2 border-b">
                <div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {link.name}
                  </a>
                </div>
                {isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveLink(index)}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Այս նախագծի համար չկան սահմանված օգտակար հղումներ</p>
        )}
        
        {isEditing && (
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Input 
                placeholder="Հղման անվանում" 
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
              />
              <Input 
                placeholder="URL" 
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
              />
              <Button onClick={handleAddLink}>Ավելացնել</Button>
            </div>
          </div>
        )}
      </ProjectDetailSection>
    </div>
  );
};

export default ProjectResourcesTab;
