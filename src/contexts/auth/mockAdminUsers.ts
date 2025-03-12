
import { User } from '@/data/userRoles';

// Admin users that need to be available by default
export const superAdminUser: User = {
  id: 'superadmin',
  name: 'Սուպերադմին',
  email: 'superadmin@example.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
  department: 'Ադմինիստրացիա',
  registrationApproved: true
};

// Main admin user data
export const mainAdminUser: User = {
  id: 'mainadmin',
  name: 'Ադմինիստրատոր',
  email: 'gitedu@bk.ru',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giteduadmin',
  department: 'Ադմինիստրացիա',
  registrationApproved: true
};

// Function to ensure admin users are in the mockUsers array
export const ensureAdminUsersExist = (mockUsers: User[]): User[] => {
  const updatedMockUsers = [...mockUsers];
  
  // Check if admins already exist
  if (!mockUsers.some(user => user.email === superAdminUser.email)) {
    updatedMockUsers.push(superAdminUser);
  }

  if (!mockUsers.some(user => user.email === mainAdminUser.email)) {
    updatedMockUsers.push(mainAdminUser);
  }
  
  return updatedMockUsers;
};
