
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { ClipboardCheck, Clock } from 'lucide-react';
import { Course } from '@/components/courses/types';

interface CourseSectionProps {
  courses: Course[];
}

const CourseSection: React.FC<CourseSectionProps> = ({ courses }) => {
  if (courses.length === 0) return null;

  return (
    <div className="mt-24">
      <FadeIn delay="delay-100">
        <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
          Մեր կուրսերը
        </h2>
      </FadeIn>
      
      <FadeIn delay="delay-200">
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Տեսեք մեր առաջարկած կրթական ծրագրերը ուսումնական ցիկլի շրջանակներում
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2 text-foreground">{course.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <ClipboardCheck className="w-4 h-4 mr-1" />
              <span>{course.modules.length} մոդուլ</span>
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSection;
