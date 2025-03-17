
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Save, X, Trash, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseHeaderProps {
  canEdit: boolean;
  isEditing: boolean;
  toggleEditMode: () => void;
  cancelEditing: () => void;
  onDelete?: () => void;
  courseId: string;
  isPersistentCourse?: boolean;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  canEdit,
  isEditing,
  toggleEditMode,
  cancelEditing,
  onDelete,
  courseId,
  isPersistentCourse = false
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link to="/admin/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Վերադառնալ դասընթացների ցանկ
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
            <>
              {!isPersistentCourse && (
                <>
                  <Button 
                    variant="outline"
                    onClick={toggleEditMode}
                    className="flex items-center gap-2"
                  >
                    <Pencil size={16} />
                    Խմբագրել դասընթացը
                  </Button>
                  {onDelete && (
                    <Button 
                      variant="outline"
                      onClick={onDelete}
                      className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash size={16} />
                      Ջնջել
                    </Button>
                  )}
                </>
              )}
              
              {isPersistentCourse && (
                <div className="flex items-center gap-1 text-blue-500">
                  <Lock size={16} />
                  <span className="text-sm">Հիմնական դասընթաց</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseHeader;
