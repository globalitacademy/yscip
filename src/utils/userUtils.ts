
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';

export const getCurrentUser = (): User => {
  return mockUsers.find(user => user.role === 'student') || mockUsers[4];
};

export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getCourses = (): string[] => {
  const courses = mockUsers
    .filter(user => user.role === 'student' && user.course)
    .map(user => user.course as string);
  
  return [...new Set(courses)].sort();
};

export const getGroups = (course?: string): string[] => {
  const groups = mockUsers
    .filter(user => 
      user.role === 'student' && 
      user.group && 
      (!course || course === 'all' || user.course === course)
    )
    .map(user => user.group as string);
  
  return [...new Set(groups)].sort();
};

export const getStudentsByCourseAndGroup = (course?: string, group?: string): User[] => {
  return mockUsers.filter(user => 
    user.role === 'student' && 
    (!course || course === 'all' || user.course === course) && 
    (!group || group === 'all' || user.group === group)
  );
};
