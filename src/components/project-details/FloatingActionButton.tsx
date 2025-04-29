
import React, { useState } from 'react';
import { Plus, Edit, Save, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { canEdit, isEditing, setIsEditing, updateProject } = useProject();
  const [isSaving, setIsSaving] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = async (action: 'edit' | 'save' | 'cancel') => {
    switch (action) {
      case 'edit':
        setIsEditing(true);
        toast.info("Խմբագրման ռեժիմը միացված է");
        break;
      case 'save':
        setIsSaving(true);
        try {
          const success = await updateProject({});
          if (success) {
            setIsEditing(false);
            toast.success("Փոփոխությունները հաջողությամբ պահպանվել են");
          }
        } catch (error) {
          console.error('Error saving:', error);
          toast.error("Սխալ պահպանելիս");
        } finally {
          setIsSaving(false);
        }
        break;
      case 'cancel':
        setIsEditing(false);
        toast.info("Խմբագրման ռեժիմը անջատված է");
        break;
    }
    setIsOpen(false);
  };

  if (!canEdit) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons that appear when FAB is clicked */}
      <div className={cn(
        "flex flex-col-reverse gap-3 mb-4 transition-all duration-300 transform",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
      )}>
        {isEditing ? (
          <>
            <Button 
              size="icon"
              variant="outline" 
              className="rounded-full shadow-lg bg-green-500 hover:bg-green-600 border-0 text-white"
              onClick={() => handleAction('save')}
              disabled={isSaving}
            >
              {isSaving ? <Plus className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
            </Button>
            <Button 
              size="icon"
              variant="outline" 
              className="rounded-full shadow-lg bg-red-500 hover:bg-red-600 border-0 text-white"
              onClick={() => handleAction('cancel')}
            >
              <X className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Button 
            size="icon"
            variant="outline" 
            className="rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 border-0 text-white"
            onClick={() => handleAction('edit')}
          >
            <Edit className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Main floating action button */}
      <Button
        size="icon"
        onClick={toggleMenu}
        className={cn(
          "rounded-full shadow-lg w-14 h-14 transition-all duration-300",
          isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-primary hover:bg-primary/90"
        )}
      >
        <Plus 
          className={cn(
            "h-6 w-6 transition-transform duration-300", 
            isOpen && "rotate-45"
          )} 
        />
      </Button>
    </div>
  );
};

export default FloatingActionButton;
