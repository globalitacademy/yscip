
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import CourseBanner from './CourseBanner';
import CourseCurriculum from './CourseCurriculum';
import CourseLearningOutcomes from './CourseLearningOutcomes';
import CourseRequirements from './CourseRequirements';
import CourseSidebar from './CourseSidebar';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseDetailsContentProps {
  displayCourse: ProfessionalCourse;
  isEditing: boolean;
  editedCourse: ProfessionalCourse | null;
  setEditedCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>;
  newLesson: { title: string; duration: string };
  setNewLesson: React.Dispatch<React.SetStateAction<{ title: string; duration: string }>>;
  newRequirement: string;
  setNewRequirement: React.Dispatch<React.SetStateAction<string>>;
  newOutcome: string;
  setNewOutcome: React.Dispatch<React.SetStateAction<string>>;
  handleApply: () => void;
  handleAddLesson: () => void;
  handleRemoveLesson: (index: number) => void;
  handleAddRequirement: () => void;
  handleRemoveRequirement: (index: number) => void;
  handleAddOutcome: () => void;
  handleRemoveOutcome: (index: number) => void;
}

const CourseDetailsContent: React.FC<CourseDetailsContentProps> = ({
  displayCourse,
  isEditing,
  editedCourse,
  setEditedCourse,
  newLesson,
  setNewLesson,
  newRequirement,
  setNewRequirement,
  newOutcome,
  setNewOutcome,
  handleApply,
  handleAddLesson,
  handleRemoveLesson,
  handleAddRequirement,
  handleRemoveRequirement,
  handleAddOutcome,
  handleRemoveOutcome
}) => {
  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8">
        <CourseBanner 
          displayCourse={displayCourse} 
          isEditing={isEditing} 
          editedCourse={editedCourse} 
          setEditedCourse={setEditedCourse} 
          handleApply={handleApply} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CourseCurriculum 
              displayCourse={displayCourse} 
              isEditing={isEditing} 
              newLesson={newLesson} 
              setNewLesson={setNewLesson} 
              handleAddLesson={handleAddLesson} 
              handleRemoveLesson={handleRemoveLesson} 
            />
            
            <CourseLearningOutcomes 
              displayCourse={displayCourse} 
              isEditing={isEditing} 
              newOutcome={newOutcome} 
              setNewOutcome={setNewOutcome} 
              handleAddOutcome={handleAddOutcome} 
              handleRemoveOutcome={handleRemoveOutcome} 
            />
            
            <CourseRequirements 
              displayCourse={displayCourse} 
              isEditing={isEditing} 
              newRequirement={newRequirement} 
              setNewRequirement={setNewRequirement} 
              handleAddRequirement={handleAddRequirement} 
              handleRemoveRequirement={handleRemoveRequirement} 
            />
          </div>
          
          <div>
            <CourseSidebar 
              displayCourse={displayCourse} 
              isEditing={isEditing} 
              editedCourse={editedCourse} 
              setEditedCourse={setEditedCourse} 
              handleApply={handleApply} 
            />
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default CourseDetailsContent;
