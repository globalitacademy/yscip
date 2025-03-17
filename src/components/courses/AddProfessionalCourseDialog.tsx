
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { Code } from 'lucide-react';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { supabase } from '@/integrations/supabase/client';

interface AddProfessionalCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddCourse: (course: ProfessionalCourse) => void;
}

const AddProfessionalCourseDialog: React.FC<AddProfessionalCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  onAddCourse,
}) => {
  const { user } = useAuth();
  const [newCourse, setNewCourse] = useState<Partial<ProfessionalCourse>>({
    title: '',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Code className="w-16 h-16" />,
    duration: '',
    price: '',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: user?.name || '',
    institution: '',
  });

  const handleAddCourse = async () => {
    if (!user) return;

    try {
      const newId = uuidv4();
      const courseToAdd: ProfessionalCourse = {
        ...newCourse as ProfessionalCourse,
        id: newId,
        createdBy: user.name,
      };
      
      // Save to Supabase
      const { data, error } = await supabase.from('courses').insert({
        id: newId,
        title: courseToAdd.title,
        subtitle: courseToAdd.subtitle,
        icon_name: getIconNameFromComponent(courseToAdd.icon),
        duration: courseToAdd.duration,
        price: courseToAdd.price,
        button_text: courseToAdd.buttonText,
        color: courseToAdd.color,
        created_by: courseToAdd.createdBy,
        institution: courseToAdd.institution,
        image_url: courseToAdd.imageUrl,
        description: courseToAdd.description
      }).select();
      
      if (error) {
        console.error('Error adding course to Supabase:', error);
        throw new Error(error.message);
      }

      // Pass the new course back to parent component
      onAddCourse(courseToAdd);
      
      // Reset the form
      setNewCourse({
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        icon: <Code className="w-16 h-16" />,
        duration: '',
        price: '',
        buttonText: 'Դիտել',
        color: 'text-amber-500',
        createdBy: user.name || '',
        institution: '',
      });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  // Helper function to get icon name from component (simplified version)
  const getIconNameFromComponent = (icon: React.ReactElement): string => {
    if (!icon || !icon.type) return 'book';
    
    let iconTypeName = 'book';
    
    if (typeof icon.type === 'function') {
      iconTypeName = icon.type.name || 'book';
    } else if (typeof icon.type === 'object') {
      iconTypeName = String(icon.type) || 'book';
    } else if (typeof icon.type === 'string') {
      iconTypeName = icon.type;
    }
    
    switch (iconTypeName.toLowerCase()) {
      case 'code':
        return 'code';
      case 'braincircuit':
        return 'braincircuit';
      case 'database':
        return 'database';
      case 'filecode':
        return 'filecode';
      case 'globe':
        return 'globe';
      default:
        return 'book';
    }
  };

  // Update the setCourse prop type to match ProfessionalCourseForm expectations
  const handleCourseChange = (courseUpdates: Partial<ProfessionalCourse>) => {
    setNewCourse(prev => ({ ...prev, ...courseUpdates }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ավելացնել նոր դասընթաց</DialogTitle>
        </DialogHeader>
        
        <ProfessionalCourseForm 
          course={newCourse}
          setCourse={handleCourseChange}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Չեղարկել
          </Button>
          <Button onClick={handleAddCourse}>
            Ավելացնել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProfessionalCourseDialog;
