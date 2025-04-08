
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  fieldName?: string;
  isEditing?: boolean;
  onStartEditing?: () => void;
  onCancelEditing?: () => void;
  onSaveEditing?: () => void;
  maxLength?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  showEditButton?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  className,
  multiline = false,
  placeholder = 'Մուտքագրեք տեքստը...',
  fieldName,
  isEditing: isEditingProp,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  maxLength,
  size = 'md',
  disabled = false,
  showEditButton = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Use controlled isEditing if provided
  const editing = isEditingProp !== undefined ? isEditingProp : isEditing;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleStartEditing = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value);
    if (onStartEditing) onStartEditing();
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
    if (onSaveEditing) onSaveEditing();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
    if (onCancelEditing) onCancelEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Size classes for different text displays
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl font-semibold'
  };

  if (editing) {
    return (
      <div className={cn("flex items-start gap-2", className)}>
        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[80px] resize-none"
            maxLength={maxLength}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )}
        <div className="flex flex-col gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={handleSave}
            className="h-8 w-8 bg-green-100 hover:bg-green-200 text-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel}
            className="h-8 w-8 bg-red-100 hover:bg-red-200 text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "group relative cursor-pointer rounded-md px-2 py-1 hover:bg-muted/50 transition-colors",
        disabled && "opacity-70 cursor-not-allowed", 
        className
      )}
      onClick={disabled || !isEditingProp ? undefined : handleStartEditing}
    >
      <div className={cn(
        value ? sizeClasses[size] : "text-muted-foreground italic",
        "min-h-[1.5em]",
        // Improve text visibility when in dark backgrounds
        className?.includes('text-white') ? "text-white" : ""
      )}>
        {value || placeholder}
      </div>
      
      {showEditButton && !disabled && isEditingProp && (
        <span className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={handleStartEditing}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
        </span>
      )}
    </div>
  );
};

export default EditableField;
