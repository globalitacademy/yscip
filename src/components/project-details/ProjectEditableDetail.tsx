
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Edit } from 'lucide-react';
import EditableField from '@/components/common/EditableField';

interface ProjectEditableDetailProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  isEditing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  multiline?: boolean;
}

const ProjectEditableDetail: React.FC<ProjectEditableDetailProps> = ({
  label,
  value,
  onChange,
  isEditing = false,
  size = 'md',
  multiline = false
}) => {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <EditableField
        value={value}
        onChange={onChange || (() => {})}
        className={cn("bg-transparent", !isEditing && "cursor-default hover:bg-transparent")}
        isEditing={isEditing}
        multiline={multiline}
        size={size as 'sm' | 'md' | 'lg' | 'xl'}
        showEditButton={false}
      />
    </div>
  );
};

export default ProjectEditableDetail;
