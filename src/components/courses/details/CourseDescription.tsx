
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { AlertCircle, UserCircle } from 'lucide-react';

interface CourseDescriptionProps {
  course: ProfessionalCourse;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ course }) => {
  return (
    <div className="space-y-8">
      {/* Course author information */}
      {course.createdBy && (
        <div className="mb-8 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex-shrink-0">
            <UserCircle className="h-10 w-10 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{course.createdBy}</h3>
            {course.instructor && (
              <p className="text-sm text-gray-500">{course.instructor}</p>
            )}
          </div>
        </div>
      )}

      <div className="prose max-w-none">
        {course.description ? (
          <div className="space-y-4">
            {course.description.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-8">Դասընթացի մանրամասն նկարագրությունը բացակայում է։</p>
        )}
      </div>
      
      {course.requirements && course.requirements.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Նախնական պահանջներ
          </h2>
          <ul className="space-y-3">
            {course.requirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1.5 mr-3 bg-amber-200 rounded-full p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-600"></div>
                </div>
                <span className="text-amber-800">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseDescription;
