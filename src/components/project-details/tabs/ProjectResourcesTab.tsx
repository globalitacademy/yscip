
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectTheme } from '@/data/projectThemes';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

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
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddResource = async () => {
    if (!newResourceName || !newResourceUrl) return;
    
    const newResources = [
      ...resources, 
      { name: newResourceName, url: newResourceUrl }
    ];
    
    setIsSaving(true);
    try {
      await onSaveChanges({ resources: newResources });
      setNewResourceName('');
      setNewResourceUrl('');
    } catch (error) {
      console.error("Error adding resource:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveResource = async (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    
    setIsSaving(true);
    try {
      await onSaveChanges({ resources: newResources });
    } catch (error) {
      console.error("Error removing resource:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLinkName || !newLinkUrl) return;
    
    const newLinks = [
      ...links, 
      { name: newLinkName, url: newLinkUrl }
    ];
    
    setIsSaving(true);
    try {
      await onSaveChanges({ links: newLinks });
      setNewLinkName('');
      setNewLinkUrl('');
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLink = async (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    
    setIsSaving(true);
    try {
      await onSaveChanges({ links: newLinks });
    } catch (error) {
      console.error("Error removing link:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Resources section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Ռեսուրսներ</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <p className="text-muted-foreground">Այս նախագծի համար ռեսուրսներ նշված չեն:</p>
          ) : (
            <ul className="space-y-2 mb-6">
              {resources.map((resource, index) => (
                <li key={index} className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-2 flex-1"
                  >
                    <ExternalLink size={16} />
                    <span>{resource.name}</span>
                  </a>
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveResource(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
          
          {isEditing && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="font-medium">Ավելացնել նոր ռեսուրս</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resourceName">Անվանում</Label>
                  <Input 
                    id="resourceName"
                    value={newResourceName}
                    onChange={(e) => setNewResourceName(e.target.value)}
                    placeholder="Ռեսուրսի անվանում"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="resourceUrl">URL</Label>
                  <Input 
                    id="resourceUrl"
                    value={newResourceUrl}
                    onChange={(e) => setNewResourceUrl(e.target.value)}
                    placeholder="https://"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddResource} 
                disabled={!newResourceName || !newResourceUrl || isSaving}
                className="flex items-center gap-1"
              >
                <Plus size={16} />
                Ավելացնել ռեսուրս
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Links section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Օգտակար հղումներ</CardTitle>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="text-muted-foreground">Այս նախագծի համար հղումներ նշված չեն:</p>
          ) : (
            <ul className="space-y-2 mb-6">
              {links.map((link, index) => (
                <li key={index} className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-2 flex-1"
                  >
                    <ExternalLink size={16} />
                    <span>{link.name}</span>
                  </a>
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveLink(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
          
          {isEditing && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="font-medium">Ավելացնել նոր հղում</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkName">Անվանում</Label>
                  <Input 
                    id="linkName"
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                    placeholder="Հղման անվանում"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input 
                    id="linkUrl"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddLink} 
                disabled={!newLinkName || !newLinkUrl || isSaving}
                className="flex items-center gap-1"
              >
                <Plus size={16} />
                Ավելացնել հղում
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectResourcesTab;
