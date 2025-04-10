
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseHeaderProps {
  canEdit?: boolean;
  isEditing?: boolean;
  toggleEditMode?: () => void;
  cancelEditing?: () => void;
  course?: ProfessionalCourse;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  canEdit = false,
  isEditing = false,
  toggleEditMode = () => {},
  cancelEditing = () => {},
  course
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Վերադառնալ գլխավոր էջ
      </Link>
      
      {canEdit && (
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="default"
                onClick={toggleEditMode}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Պահպանել
              </Button>
              <Button 
                variant="outline"
                onClick={cancelEditing}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Չեղարկել
              </Button>
            </>
          ) : (
            <Button 
              variant="outline"
              onClick={toggleEditMode}
              className="flex items-center gap-2"
            >
              <Pencil size={16} />
              Խմբագրել դասընթացը
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseHeader;
