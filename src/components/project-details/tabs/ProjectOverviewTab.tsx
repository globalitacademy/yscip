
import React, { useState } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useTheme } from '@/hooks/use-theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import EditableField from '../EditableField';

interface ProjectOverviewTabProps {
  project: ProjectTheme;
  isEditing: boolean;
  onSaveChanges: (updates: Partial<any>) => Promise<void>;
}

const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  isEditing,
  onSaveChanges
}) => {
  const { theme } = useTheme();
  const [description, setDescription] = useState(project.description || '');
  const [goal, setGoal] = useState(project.goal || '');
  const [techStack, setTechStack] = useState(project.techStack || []);
  const [newTech, setNewTech] = useState('');
  
  const handleAddTech = () => {
    if (newTech && !techStack.includes(newTech)) {
      const updatedTechStack = [...techStack, newTech];
      setTechStack(updatedTechStack);
      setNewTech('');
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };
  
  const handleSaveOverview = async () => {
    await onSaveChanges({
      description,
      goal,
      techStack
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Description Card */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Նախագծի նկարագրություն</CardTitle>
        </CardHeader>
        <CardContent>
          <EditableField
            value={description}
            onChange={setDescription}
            isEditing={isEditing}
            as="textarea"
            placeholder="Նախագծի մանրամասն նկարագրություն..."
            className={theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
            displayClassName={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}
          />
        </CardContent>
      </Card>
      
      {/* Project Goal Card */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Նախագծի նպատակը</CardTitle>
        </CardHeader>
        <CardContent>
          <EditableField
            value={goal}
            onChange={setGoal}
            isEditing={isEditing}
            as="textarea"
            placeholder="Նախագծի նպատակը..."
            className={theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
            displayClassName={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}
          />
        </CardContent>
      </Card>
      
      {/* Tech Stack Card */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Տեխնոլոգիաներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.map((tech, index) => (
              <Badge 
                key={index}
                variant={theme === 'dark' ? 'outline' : 'secondary'}
                className={`${theme === 'dark' ? 'border-gray-600 text-gray-300' : ''} py-1.5`}
              >
                {tech}
                {isEditing && (
                  <button 
                    onClick={() => handleRemoveTech(tech)} 
                    className="ml-2 text-xs hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Նոր տեխնոլոգիա..."
                className={`flex-1 px-3 py-2 text-sm rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
              <Button 
                size="sm" 
                onClick={handleAddTech}
              >
                Ավելացնել
              </Button>
            </div>
          )}
          
          {isEditing && (
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveOverview} className="gap-1.5">
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

export default ProjectOverviewTab;
