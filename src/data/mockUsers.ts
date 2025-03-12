
import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Ադմինիստրատոր',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    registrationApproved: true
  },
  {
    id: 'project_manager1',
    name: 'Նախագծի ղեկավար',
    email: 'manager@example.com',
    role: 'project_manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supervisor',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    supervisedStudents: ['student1', 'student2'],
    registrationApproved: true
  },
  {
    id: 'supervisor1',
    name: 'Ղեկավար',
    email: 'supervisor@example.com',
    role: 'supervisor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supervisor2',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    supervisedStudents: ['student1'],
    registrationApproved: true
  },
  {
    id: 'lecturer1',
    name: 'Դասախոս',
    email: 'lecturer@example.com',
    role: 'lecturer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    assignedProjects: [1, 2, 3],
    registrationApproved: true
  },
  {
    id: 'instructor1',
    name: 'Դասախոս 2',
    email: 'instructor@example.com',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor2',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    assignedProjects: [4, 5],
    registrationApproved: true
  },
  {
    id: 'employer1',
    name: 'Գործատու',
    email: 'employer@example.com',
    role: 'employer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=employer',
    organization: 'Տեխնոլոջի ՍՊԸ',
    registrationApproved: true
  },
  {
    id: 'student1',
    name: 'Ուսանող',
    email: 'student@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '2',
    group: 'ԿՄ-021',
    registrationApproved: true
  },
  {
    id: 'student2',
    name: 'Երկրորդ Ուսանող',
    email: 'student2@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    course: '3',
    group: 'ԿՄ-031',
    registrationApproved: true
  }
];
