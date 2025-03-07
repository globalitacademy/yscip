
import { User } from '@/data/userRoles';

// Add superadmin to mockUsers
export const superAdminUser: User = {
  id: 'superadmin',
  name: 'Սուպերադմին',
  email: 'superadmin@example.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
  registrationApproved: true
};

// Format date utility
export const formatDate = (timestamp: number) => {
  if (!timestamp) return 'Անհայտ';
  const date = new Date(timestamp);
  return date.toLocaleDateString('hy-AM');
};
