
import React, { useState } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useTheme } from '@/hooks/use-theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, File, Link as LinkIcon, Plus, Trash } from 'lucide-react';
import EditableField from '../EditableField';

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
  const { theme } = useTheme();
  const [resources, setResources] = useState(project.resources || []);
  const [links, setLinks] = useState(project.links || []);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  const handleAddResource = () => {
    if (newResourceName && newResourceUrl) {
      setResources([...resources, { name: newResourceName, url: newResourceUrl }]);
      setNewResourceName('');
      setNewResourceUrl('');
    }
  };
  
  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };
  
  const handleAddLink = () => {
    if (newLinkName && newLinkUrl) {
      setLinks([...links, { name: newLinkName, url: newLinkUrl }]);
      setNewLinkName('');
      setNewLinkUrl('');
    }
  };
  
  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };
  
  const handleSaveResources = async () => {
    await onSaveChanges({
      resources,
      links
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Files and Documents Card */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
            Նախագծի նյութեր
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-750 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <File className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={18} />
                    <div>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                        {resource.name}
                      </p>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        {resource.url}
                      </a>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveResource(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-center my-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Նյութեր չեն ավելացվել
            </p>
          )}
          
          {/* Add new resource */}
          {isEditing && (
            <div className={`mt-6 p-4 rounded ${
              theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'
            } border`}>
              <h4 className={`text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Ավելացնել նոր նյութ
              </h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={newResourceName}
                  onChange={(e) => setNewResourceName(e.target.value)}
                  placeholder="Նյութի անվանում"
                  className={`w-full px-3 py-2 text-sm rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                
                <input
                  type="text"
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                  placeholder="Հղում"
                  className={`w-full px-3 py-2 text-sm rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                
                <Button
                  onClick={handleAddResource}
                  disabled={!newResourceName || !newResourceUrl}
                  size="sm"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> 
                  Ավելացնել նյութ
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* External Links Card */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
            Օգտակար հղումներ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {links.length > 0 ? (
            <ul className="space-y-3">
              {links.map((link, index) => (
                <li 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-750 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <LinkIcon className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={18} />
                    <div>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                        {link.name}
                      </p>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-center my-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Հղումներ չեն ավելացվել
            </p>
          )}
          
          {/* Add new link */}
          {isEditing && (
            <div className={`mt-6 p-4 rounded ${
              theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'
            } border`}>
              <h4 className={`text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Ավելացնել նոր հղում
              </h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  placeholder="Հղման անվանում"
                  className={`w-full px-3 py-2 text-sm rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL հղում"
                  className={`w-full px-3 py-2 text-sm rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                
                <Button
                  onClick={handleAddLink}
                  disabled={!newLinkName || !newLinkUrl}
                  size="sm"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> 
                  Ավելացնել հղում
                </Button>
              </div>
            </div>
          )}
          
          {isEditing && (
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveResources} className="gap-1.5">
                <Save size={16} />
                Պահպանել փոփոխությունները
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectResourcesTab;
