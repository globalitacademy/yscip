
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  placeholder?: string;
  as?: 'input' | 'textarea';
  className?: string;
  displayClassName?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  isEditing,
  placeholder = 'Enter text...',
  as = 'input',
  className = '',
  displayClassName = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  
  // Update local value when the prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Focus input when editing mode is activated
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const baseStyles = `bg-transparent outline-none ${
    theme === 'dark' 
      ? 'placeholder:text-gray-500 focus:border-gray-400' 
      : 'placeholder:text-gray-400 focus:border-gray-600'
  } w-full`;
  
  if (isEditing) {
    if (as === 'textarea') {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${baseStyles} border rounded-md p-2 ${className}`}
          rows={3}
        />
      );
    }
    
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${baseStyles} border-b py-1 ${className}`}
      />
    );
  }
  
  return <div className={displayClassName}>{value}</div>;
};

export default EditableField;
