
import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectDetailSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  isEditing?: boolean;
  onSave?: () => Promise<void>;
}

const ProjectDetailSection: React.FC<ProjectDetailSectionProps> = ({
  title,
  icon,
  children,
  isEditing = false,
  onSave
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave();
    } catch (error) {
      console.error(`Error saving ${title}:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className={`${isEditing ? 'space-y-4' : ''}`}>
            {children}
            
            {isEditing && onSave && (
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? 'Պահպանվում է...' : `Պահպանել ${title}`}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ProjectDetailSection;
