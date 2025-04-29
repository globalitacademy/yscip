
import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OverviewActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
}

const OverviewActions: React.FC<OverviewActionsProps> = ({
  isEditing,
  isSaving,
  onSave
}) => {
  if (!isEditing) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button 
        variant="outline" 
        className="border-green-200 bg-green-100 text-green-700 hover:bg-green-200"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Պահպանվում է...</>
        ) : (
          <><Save className="h-4 w-4 mr-2" /> Պահպանել</>
        )}
      </Button>
    </div>
  );
};

export default OverviewActions;
