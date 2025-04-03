
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X, Check, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  className?: string;
  title?: string;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  listType?: 'numbered' | 'bulleted' | 'steps';
  maxItems?: number;
  minItems?: number;
}

const EditableList: React.FC<EditableListProps> = ({
  items,
  onChange,
  className,
  title,
  placeholder = 'Մուտքագրեք նոր տարր...',
  emptyMessage = 'Դատարկ է',
  disabled = false,
  listType = 'bulleted',
  maxItems,
  minItems = 0,
}) => {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error('Տարրը չի կարող դատարկ լինել');
      return;
    }

    if (maxItems && items.length >= maxItems) {
      toast.error(`Առավելագույն թույլատրվող տարրերի քանակը ${maxItems} է`);
      return;
    }

    onChange([...items, newItem.trim()]);
    setNewItem('');
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= minItems) {
      toast.error(`Նվազագույն պահանջվող տարրերի քանակը ${minItems} է`);
      return;
    }
    
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleStartEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    
    if (!editValue.trim()) {
      toast.error('Տարրը չի կարող դատարկ լինել');
      return;
    }

    const newItems = [...items];
    newItems[editingIndex] = editValue.trim();
    onChange(newItems);
    setEditingIndex(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, isNewItem = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isNewItem) {
        handleAddItem();
      } else {
        handleSaveEdit();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (isNewItem) {
        setNewItem('');
      } else {
        handleCancelEdit();
      }
    }
  };

  // Determine the list style based on the type
  const getListStyle = () => {
    switch (listType) {
      case 'numbered':
        return 'list-decimal';
      case 'steps':
        return 'relative pl-8';
      case 'bulleted':
      default:
        return 'list-disc';
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {title && <h3 className="text-base font-medium">{title}</h3>}

      {items.length === 0 ? (
        <p className="text-muted-foreground italic text-sm">{emptyMessage}</p>
      ) : (
        <ul className={cn("ml-5 space-y-2", getListStyle())}>
          {items.map((item, index) => (
            <li key={index} className={listType === 'steps' ? 'ml-0' : ''}>
              {listType === 'steps' && (
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                  {index + 1}
                </div>
              )}
              
              {editingIndex === index ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    autoFocus
                  />
                  <div className="flex space-x-1">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleSaveEdit}
                      className="h-8 w-8 bg-green-100 hover:bg-green-200 text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCancelEdit}
                      className="h-8 w-8 bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="group flex justify-between items-start gap-2">
                  <div>{item}</div>
                  {!disabled && (
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground"
                        onClick={() => handleStartEditing(index)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!disabled && (!maxItems || items.length < maxItems) && (
        <div className="flex gap-2 mt-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => handleKeyDown(e, true)}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddItem}
            disabled={!newItem.trim()}
            className="whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Ավելացնել
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableList;
