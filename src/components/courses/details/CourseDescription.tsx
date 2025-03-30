
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseDescriptionProps {
  course: ProfessionalCourse;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ course }) => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        {course.description ? (
          <div>
            {course.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Դասընթացի մանրամասն նկարագրությունը բացակայում է։</p>
        )}
      </div>
      
      {course.requirements && course.requirements.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Պահանջներ</h2>
          <ul className="space-y-2">
            {course.requirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-2 bg-red-100 rounded-full p-1">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseDescription;
