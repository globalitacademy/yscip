
import { User, UserRole } from '@/types/user';

// Function to map database user to application user model
export const mapDatabaseUserToUserModel = (userData: any): User => {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role as UserRole,
    avatar: userData.avatar,
    department: userData.department,
    registrationApproved: userData.registration_approved,
    organization: userData.organization,
    group: userData.group_name // Note: mapping from group_name to group
  };
};
