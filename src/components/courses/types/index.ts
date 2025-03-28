

export interface Course {
  id: string;
  name: string;
  title?: string;
  description: string;
  specialization: string;
  instructor: string;
  duration: string;
  modules: string[];
  prerequisites?: string[];
  category?: string;
  createdBy: string;
  is_public?: boolean;
  imageUrl?: string;
  learningOutcomes?: string[];
  createdAt: string;
  updatedAt: string;
  difficulty?: string;
}

// Use export type to fix isolatedModules compatibility
export type { ProfessionalCourse, LessonItem } from './ProfessionalCourse';

// Import the ProfessionalCourse type to use in the CourseContextType
import { ProfessionalCourse, LessonItem } from './ProfessionalCourse';

// Explicitly define the CourseContextType interface and export it
export interface CourseContextType {
  courses: Course[];
  userCourses: Course[];
  professionalCourses: ProfessionalCourse[];
  userProfessionalCourses: ProfessionalCourse[];
  isLoading: boolean;
  error: string | null;
  activeCourse: Course | null;
  filteredCourses: Course[];
  filteredProfessionalCourses: ProfessionalCourse[];
  searchTerm: string;
  selectedCategory: string | null;
  selectedDifficulty: string | null;
  selectedSort: string | null;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isCreateProfessionalDialogOpen: boolean;
  isEditProfessionalDialogOpen: boolean;
  isDeleteProfessionalDialogOpen: boolean;
  courseToEdit: Course | null;
  courseToDelete: Course | null;
  professionalCourseToEdit: ProfessionalCourse | null;
  professionalCourseToDelete: ProfessionalCourse | null;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>;
  loadCourses: () => Promise<void>;
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string | null) => void;
  handleDifficultyChange: (value: string | null) => void;
  handleSortChange: (value: string | null) => void;
  resetFilters: () => void;
  handleOpenEditDialog: (course: Course) => void;
  handleCloseEditDialog: () => void;
  handleOpenDeleteDialog: (course: Course) => void;
  handleCloseDeleteDialog: () => void;
  handleOpenCreateProfessionalDialog: () => void;
  handleCloseCreateProfessionalDialog: () => void;
  handleOpenEditProfessionalDialog: (course: ProfessionalCourse) => void;
  handleCloseEditProfessionalDialog: () => void;
  handleOpenDeleteProfessionalDialog: (course: ProfessionalCourse) => void;
  handleCloseDeleteProfessionalDialog: () => void;
  handleCreateCourse: (course: Omit<Course, 'id' | 'createdAt'>) => Promise<boolean>;
  handleUpdateCourse: (id: string, courseData: Partial<Course>) => Promise<boolean>;
  handleDeleteCourse: (id: string) => Promise<boolean>;
  handleCreateProfessionalCourse: (course: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => Promise<boolean>;
  handleUpdateProfessionalCourse: (id: string, courseData: Partial<ProfessionalCourse>) => Promise<boolean>;
  handleDeleteProfessionalCourse: (id: string) => Promise<boolean>;
}

