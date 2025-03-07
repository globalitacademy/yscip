
import { User, UserRole, mockUsers } from '@/data/userRoles';

// Add superadmin to mockUsers
export const superAdminUser: User = {
  id: 'superadmin',
  name: 'Սուպերադմին',
  email: 'superadmin@example.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
  department: 'Ադմինիստրացիա',
  registrationApproved: true
};

// Initialize mockUsers with superadmin if not already present
export const initializeMockUsers = () => {
  // Clear mockUsers array if it's not empty
  if (mockUsers.length > 0) {
    mockUsers.length = 0;
  }
  
  // Add superadmin
  mockUsers.push(superAdminUser);
};

// Generate a verification token
export const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format date utility
export const formatDate = (timestamp: number) => {
  if (!timestamp) return 'Անհայտ';
  const date = new Date(timestamp);
  return date.toLocaleDateString('hy-AM');
};
