
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ProjectDetailSectionProps {
  title: string;
  children: ReactNode;
  isEditing: boolean;
  onSave?: () => void;
  isSaving?: boolean;
}

const ProjectDetailSection: React.FC<ProjectDetailSectionProps> = ({ 
  title, 
  children, 
  isEditing,
  onSave,
  isSaving = false
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {isEditing && onSave && (
            <Button 
              onClick={onSave}
              disabled={isSaving}
              size="sm"
              className="h-8"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Պահպանվում է...' : 'Պահպանել'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ProjectDetailSection;
