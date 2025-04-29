
import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import EditableList from '@/components/common/EditableList';

interface PrerequisitesProps {
  prerequisites: string[] | undefined;
  isEditing: boolean;
  onChange: (prerequisites: string[]) => void;
}

const Prerequisites: React.FC<PrerequisitesProps> = ({
  prerequisites,
  isEditing,
  onChange
}) => {
  return (
    <div className="border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <BookOpen size={18} className="mr-2 text-primary" />
        Նախապայմաններ
      </h3>
      <Separator className="mb-4" />
      
      {isEditing ? (
        <EditableList 
          items={prerequisites || []}
          onChange={onChange}
          placeholder="Մուտքագրեք նոր նախապայման..."
          listType="bulleted"
          disabled={!isEditing}
        />
      ) : (
        prerequisites && prerequisites.length > 0 ? (
          <ul className="space-y-2">
            {prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <span>{prereq}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic text-sm">Նախապայմաններ չեն նշված</p>
        )
      )}
    </div>
  );
};

export default Prerequisites;
