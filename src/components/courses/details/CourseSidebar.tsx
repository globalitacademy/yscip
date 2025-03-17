
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { ExternalLink, User, Clock, Building, DollarSign, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseSidebarProps {
  displayCourse: ProfessionalCourse;
  isEditing: boolean;
  editedCourse: ProfessionalCourse | null;
  setEditedCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>;
  handleApply: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  displayCourse,
  isEditing,
  editedCourse,
  setEditedCourse,
  handleApply
}) => {
  // Create safe fallback values
  const courseImageUrl = displayCourse?.imageUrl || '';
  const courseTitle = displayCourse?.title || 'Դասընթաց';
  const coursePrice = displayCourse?.price || 'Անվճար';
  const courseDuration = displayCourse?.duration || 'Նշված չէ';
  const courseLessonsCount = displayCourse?.lessons ? displayCourse.lessons.length : 0;
  const courseInstitution = displayCourse?.institution || 'Նշված չէ';
  const courseCreator = displayCourse?.createdBy || 'Անանուն դասախոս';
  const courseButtonText = displayCourse?.buttonText || 'Դիմել դասընթացին';
  const courseColor = displayCourse?.color || 'text-blue-500';
  
  return (
    <FadeIn delay="delay-200">
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {courseImageUrl ? (
          <div className="w-full h-48 relative">
            <img 
              src={courseImageUrl} 
              alt={courseTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load and we have an icon, display it instead
                if (displayCourse.icon) {
                  e.currentTarget.style.display = 'none';
                  const iconContainer = e.currentTarget.parentElement?.querySelector('.course-icon-fallback');
                  if (iconContainer) {
                    iconContainer.className = `course-icon-fallback flex items-center justify-center h-full w-full ${courseColor}`;
                  }
                }
              }}
            />
            {displayCourse.icon && (
              <div className="course-icon-fallback hidden items-center justify-center h-full w-full absolute top-0 left-0">
                {displayCourse.icon}
              </div>
            )}
          </div>
        ) : displayCourse.icon ? (
          <div className={`w-full h-48 flex items-center justify-center ${courseColor}`}>
            {displayCourse.icon}
          </div>
        ) : null}
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Դասընթացի մանրամասներ</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-blue-500" />
              {isEditing ? (
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">Արժեք</span>
                  <Input 
                    value={editedCourse?.price || ''}
                    onChange={(e) => setEditedCourse(prev => prev ? {...prev, price: e.target.value} : prev)}
                    className="w-32 text-right"
                  />
                </div>
              ) : (
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">Արժեք</span>
                  <span className="font-bold">{coursePrice}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              {isEditing ? (
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">Տևողություն</span>
                  <Input 
                    value={editedCourse?.duration || ''}
                    onChange={(e) => setEditedCourse(prev => prev ? {...prev, duration: e.target.value} : prev)}
                    className="w-32 text-right"
                  />
                </div>
              ) : (
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">Տևողություն</span>
                  <span>{courseDuration}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-blue-500" />
              <div className="flex flex-1 justify-between">
                <span className="text-muted-foreground">Դասերի քանակ</span>
                <span>{courseLessonsCount}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Building size={18} className="text-blue-500" />
              {isEditing ? (
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">Հաստատություն</span>
                  <Input 
                    value={editedCourse?.institution || ''}
                    onChange={(e) => setEditedCourse(prev => prev ? {...prev, institution: e.target.value} : prev)}
                    className="w-32 text-right"
                  />
                </div>
              ) : (
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">Հաստատություն</span>
                  <span>{courseInstitution}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              {isEditing ? (
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">Դասախոս</span>
                  <Input 
                    value={editedCourse?.createdBy || ''}
                    onChange={(e) => setEditedCourse(prev => prev ? {...prev, createdBy: e.target.value} : prev)}
                    className="w-32 text-right"
                  />
                </div>
              ) : (
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">Դասախոս</span>
                  <span>{courseCreator}</span>
                </div>
              )}
            </div>
          </div>
          
          {!isEditing && (
            <>
              <Button onClick={handleApply} className="w-full mb-3 bg-blue-600 hover:bg-blue-700">
                {courseButtonText}
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <a href="#" className="flex items-center justify-center">
                  Ներբեռնել ծրագիրը <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default CourseSidebar;
