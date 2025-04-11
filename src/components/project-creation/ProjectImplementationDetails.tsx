
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ProjectImplementationDetailsProps {
  steps: string[];
  setSteps: (steps: string[]) => void;
  resources: { name: string; url: string }[];
  setResources: (resources: { name: string; url: string }[]) => void;
  links: { name: string; url: string }[];
  setLinks: (links: { name: string; url: string }[]) => void;
}

const ProjectImplementationDetails: React.FC<ProjectImplementationDetailsProps> = ({
  steps,
  setSteps,
  resources,
  setResources,
  links,
  setLinks
}) => {
  const [newStep, setNewStep] = useState('');
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    setSteps([...steps, newStep.trim()]);
    setNewStep('');
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleAddResource = () => {
    if (!newResourceName.trim() || !newResourceUrl.trim()) return;
    setResources([...resources, { name: newResourceName.trim(), url: newResourceUrl.trim() }]);
    setNewResourceName('');
    setNewResourceUrl('');
  };

  const handleRemoveResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  const handleAddLink = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;
    setLinks([...links, { name: newLinkName.trim(), url: newLinkUrl.trim() }]);
    setNewLinkName('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Իրականացման քայլեր</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Նկարագրեք իրականացման քայլը"
            />
            <Button 
              type="button" 
              onClick={handleAddStep} 
              className="flex items-center"
              disabled={!newStep.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Ավելացնել քայլ
            </Button>
          </div>

          {steps.length > 0 ? (
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start justify-between group p-3 border rounded-md">
                  <div className="flex items-center">
                    <Badge variant="outline" className="min-w-[2rem] mr-2">
                      {index + 1}
                    </Badge>
                    <p className="text-sm">{step}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveStep(index)} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Իրականացման քայլեր դեռ ավելացված չեն</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ռեսուրսներ և հղումներ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Ռեսուրսներ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
                placeholder="Ռեսուրսի անվանում"
              />
              <Input
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
                placeholder="Ռեսուրսի URL"
                type="url"
              />
            </div>
            <Button 
              type="button" 
              onClick={handleAddResource} 
              className="flex items-center"
              disabled={!newResourceName.trim() || !newResourceUrl.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Ավելացնել ռեսուրս
            </Button>

            {resources.length > 0 ? (
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between group p-2 border rounded-md">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-500 hover:underline flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {resource.name}
                    </a>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveResource(index)} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Ռեսուրսներ դեռ ավելացված չեն</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Օգտակար հղումներ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                placeholder="Հղման անվանում"
              />
              <Input
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="Հղման URL"
                type="url"
              />
            </div>
            <Button 
              type="button" 
              onClick={handleAddLink} 
              className="flex items-center"
              disabled={!newLinkName.trim() || !newLinkUrl.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Ավելացնել հղում
            </Button>

            {links.length > 0 ? (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between group p-2 border rounded-md">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-500 hover:underline flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {link.name}
                    </a>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveLink(index)} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Հղումներ դեռ ավելացված չեն</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectImplementationDetails;
