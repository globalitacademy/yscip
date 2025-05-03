
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  showEditButton?: boolean;
  className?: string;
  inputClassName?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  placeholder = 'Մուտքագրեք արժեքը',
  showEditButton = true,
  className = '',
  inputClassName = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={inputClassName}
            autoFocus
          />
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={handleSave}
            >
              <Save size={16} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleCancel}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <div className="flex-1 min-h-[24px]">
            {value || <span className="text-muted-foreground italic">{placeholder}</span>}
          </div>
          
          {showEditButton && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleStartEdit}
            >
              <Pencil size={14} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableField;
