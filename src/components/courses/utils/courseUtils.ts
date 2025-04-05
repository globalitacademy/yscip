
// Այս ֆայլը ծառայում է որպես միասնական կետ դասընթացների գործառույթների համար

// Ներմուծում ենք բոլոր դասընթացի գործողությունները
import { getCourseById } from './course-operations/getCourseById';
import { getCourseBySlug } from './course-operations/getCourseBySlug';
import { saveCourseChanges } from './course-operations/saveCourseChanges';

// Արտահանում ենք բոլոր գործողությունները
export { 
  getCourseById, 
  getCourseBySlug, 
  saveCourseChanges 
};
