
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ExternalLink, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { SlideUp } from '@/components/LocalTransitions';
import { Input } from '@/components/ui/input';

const ProjectResourcesTab: React.FC = () => {
  const { project, updateProject, isEditing } = useProject();
  
  // Initialize resources and links with defaults to avoid null/undefined issues
  const initialResources = project.resources || [];
  const initialLinks = project.links || [];
  
  const [resources, setResources] = useState<{name: string, url: string}[]>(initialResources);
  const [links, setLinks] = useState<{name: string, url: string}[]>(initialLinks);
  const [newResource, setNewResource] = useState({ name: '', url: '' });
  const [newLink, setNewLink] = useState({ name: '', url: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateProject({
        // Only include the resources and links properties if they're part of the project type
        resources: resources,
        links: links
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addResource = () => {
    if (newResource.name.trim() && newResource.url.trim()) {
      setResources([...resources, { ...newResource }]);
      setNewResource({ name: '', url: '' });
    }
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (newLink.name.trim() && newLink.url.trim()) {
      setLinks([...links, { ...newLink }]);
      setNewLink({ name: '', url: '' });
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <SlideUp className="space-y-8">
      {isEditing && (
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline"
            className="mr-2"
            onClick={() => {
              setResources(initialResources);
              setLinks(initialLinks);
            }}
          >
            <X className="h-4 w-4 mr-2" /> Չեղարկել
          </Button>
          <Button 
            variant="outline" 
            className="border-green-200 bg-green-100 text-green-700 hover:bg-green-200"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" /> Պահպանել
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            Ռեսուրսներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{resource.name}</p>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-primary flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink size={14} /> Դիտել ռեսուրսը
                    </a>
                  </div>
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeResource(index)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Ռեսուրսներ չեն ավելացված</p>
          )}

          {isEditing && (
            <div className="flex flex-col gap-3 p-4 border rounded-md bg-accent/20">
              <h3 className="font-medium">Ավելացնել նոր ռեսուրս</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="Ռեսուրսի անվանումը" 
                  value={newResource.name} 
                  onChange={e => setNewResource({...newResource, name: e.target.value})}
                />
                <Input 
                  placeholder="Ռեսուրսի հղումը (URL)" 
                  value={newResource.url} 
                  onChange={e => setNewResource({...newResource, url: e.target.value})}
                />
                <Button onClick={addResource} className="mt-2 sm:mt-0">
                  <Plus size={16} className="mr-2" /> Ավելացնել
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            Օգտակար հղումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {links && links.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{link.name}</p>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-primary flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink size={14} /> Անցնել հղումով
                    </a>
                  </div>
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeLink(index)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Հղումներ չեն ավելացված</p>
          )}

          {isEditing && (
            <div className="flex flex-col gap-3 p-4 border rounded-md bg-accent/20">
              <h3 className="font-medium">Ավելացնել նոր հղում</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="Հղման անվանումը" 
                  value={newLink.name} 
                  onChange={e => setNewLink({...newLink, name: e.target.value})}
                />
                <Input 
                  placeholder="Հղման URL" 
                  value={newLink.url} 
                  onChange={e => setNewLink({...newLink, url: e.target.value})}
                />
                <Button onClick={addLink} className="mt-2 sm:mt-0">
                  <Plus size={16} className="mr-2" /> Ավելացնել
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </SlideUp>
  );
};

export default ProjectResourcesTab;
