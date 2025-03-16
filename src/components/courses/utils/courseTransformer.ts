
import { Course } from '../types';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { courseColors } from './courseIcons';

// Transform courses from database to ProfessionalCourse format
export const transformCoursesToProfessional = (courses: Course[]): ProfessionalCourse[] => {
  return courses.map((course: Course) => {
    // Determine color based on course name or use default
    const color = courseColors[course.name] || 'text-gray-500';
    
    return {
      id: course.id,
      title: course.name,
      subtitle: 'ԴԱՍԸՆԹԱՑ',
      icon: course.name, // Will be mapped to actual icon in the component
      duration: course.duration || '6 ամիս',
      price: '58,000 ֏', // Default price, can be added to Course type if needed
      buttonText: 'Դիտել',
      color: color,
      createdBy: course.createdBy || 'Admin',
      institution: course.specialization || 'ԵՊՀ'
    };
  });
};
