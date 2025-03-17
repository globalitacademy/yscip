
import React from 'react';
import { User, Clock, Building, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/LocalTransitions';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseBannerProps {
  displayCourse: ProfessionalCourse;
  isEditing: boolean;
  editedCourse: ProfessionalCourse | null;
  setEditedCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>;
  handleApply: () => void;
}

const CourseBanner: React.FC<CourseBannerProps> = ({
  displayCourse,
  isEditing,
  editedCourse,
  setEditedCourse,
  handleApply
}) => {
  // For safety, create fallback values in case displayCourse properties are missing
  const courseTitle = displayCourse?.title || "Դասընթաց";
  const courseDescription = displayCourse?.description || "";
  const courseCreator = displayCourse?.createdBy || "Անանուն դասախոս";
  const courseDuration = displayCourse?.duration || "Նշված չէ";
  const courseInstitution = displayCourse?.institution || "Նշված չէ";
  const coursePrice = displayCourse?.price || "Անվճար";
  const courseImageUrl = displayCourse?.imageUrl || "";
  
  return (
    <FadeIn>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10 relative overflow-hidden">
        {courseImageUrl ? (
          <div className="absolute right-0 top-0 h-full overflow-hidden rounded-r-xl w-2/5">
            <img 
              src={courseImageUrl} 
              alt={courseTitle}
              className="object-cover h-full w-full opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-50"></div>
          </div>
        ) : displayCourse.icon && (
          <div className="absolute right-0 top-0 h-full flex items-center justify-center rounded-r-xl w-2/5">
            <div className={`${displayCourse.color || 'text-blue-500'} opacity-10 transform scale-150`}>
              {displayCourse.icon}
            </div>
          </div>
        )}
        
        <div className="relative z-10 max-w-3xl">
          {isEditing ? (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Նկար URL</label>
                <Input 
                  value={editedCourse?.imageUrl || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, imageUrl: e.target.value} : prev)}
                  placeholder="https://example.com/image.jpg"
                  className="mb-3"
                />
              </div>
              <Input 
                value={editedCourse?.title || ''}
                onChange={(e) => setEditedCourse(prev => prev ? {...prev, title: e.target.value} : prev)}
                className="text-3xl md:text-4xl font-bold mb-3"
              />
              <Textarea 
                value={editedCourse?.description || ''}
                onChange={(e) => setEditedCourse(prev => prev ? {...prev, description: e.target.value} : prev)}
                className="text-lg mb-6"
                rows={4}
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{courseTitle}</h1>
              <p className="text-lg text-muted-foreground mb-6">{courseDescription}</p>
            </>
          )}
          
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              {isEditing ? (
                <Input 
                  value={editedCourse?.createdBy || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, createdBy: e.target.value} : prev)}
                  className="w-48"
                />
              ) : (
                <span>Դասախոս՝ {courseCreator}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              {isEditing ? (
                <Input 
                  value={editedCourse?.duration || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, duration: e.target.value} : prev)}
                  className="w-48"
                />
              ) : (
                <span>Տևողություն՝ {courseDuration}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Building size={18} className="text-blue-500" />
              {isEditing ? (
                <Input 
                  value={editedCourse?.institution || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, institution: e.target.value} : prev)}
                  className="w-48"
                />
              ) : (
                <span>Հաստատություն՝ {courseInstitution}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-blue-500" />
              {isEditing ? (
                <Input 
                  value={editedCourse?.price || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, price: e.target.value} : prev)}
                  className="w-48"
                />
              ) : (
                <span>Արժեք՝ {coursePrice}</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            {!isEditing && (
              <>
                <Button onClick={handleApply} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  {displayCourse?.buttonText || "Դիմել դասընթացին"}
                </Button>
                <Button variant="outline" size="lg">
                  Կապ հաստատել
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default CourseBanner;
