
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Course } from '../types';

export const addCourse = (
  courses: Course[],
  newCourse: Partial<Course>,
  userId: string | undefined
): Course[] => {
  if (!newCourse.name || !newCourse.description || !newCourse.duration) {
    toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
    throw new Error('Missing required fields');
  }

  const courseToAdd: Course = {
    id: uuidv4(),
    name: newCourse.name,
    description: newCourse.description,
    specialization: newCourse.specialization,
    duration: newCourse.duration,
    modules: newCourse.modules || [],
    createdBy: userId || 'unknown'
  };

  const updatedCourses = [...courses, courseToAdd];
  localStorage.setItem('courses', JSON.stringify(updatedCourses));
  toast.success('Կուրսը հաջողությամբ ավելացվել է');
  
  return updatedCourses;
};

export const editCourse = (
  courses: Course[],
  selectedCourse: Course | null
): Course[] => {
  if (!selectedCourse) {
    throw new Error('No course selected');
  }
  
  if (!selectedCourse.name || !selectedCourse.description || !selectedCourse.duration) {
    toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
    throw new Error('Missing required fields');
  }

  const updatedCourses = courses.map(course => 
    course.id === selectedCourse.id ? selectedCourse : course
  );
  
  localStorage.setItem('courses', JSON.stringify(updatedCourses));
  toast.success('Կուրսը հաջողությամբ թարմացվել է');
  
  return updatedCourses;
};

export const deleteCourse = (
  courses: Course[],
  courseId: string,
  userId: string | undefined,
  userRole: string | undefined
): Course[] => {
  const courseToDelete = courses.find(course => course.id === courseId);
  
  // Only allow users to delete their own courses (admin can delete any)
  if (courseToDelete && (userRole === 'admin' || courseToDelete.createdBy === userId)) {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    toast.success('Կուրսը հաջողությամբ հեռացվել է');
    return updatedCourses;
  } else {
    toast.error('Դուք չունեք իրավունք ջնջելու այս կուրսը');
    return courses;
  }
};
