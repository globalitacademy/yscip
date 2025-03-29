
// Unified Course interface
export interface Course {
  id: string;
  title: string;
  name?: string;
  description: string;
  instructor: string;
  specialization?: string;
  duration: string;
  modules: string[];
  prerequisites: string[];
  category?: string;
  createdBy?: string;
  is_public?: boolean;
  imageUrl?: string;
  learningOutcomes?: string[];
  createdAt?: string;
  updatedAt?: string;
  difficulty?: string;
}

// Import and export ProfessionalCourse from its module - using "export type" syntax
import type { ProfessionalCourse, LessonItem } from './ProfessionalCourse';
export type { ProfessionalCourse, LessonItem };

// CourseContextType with all required properties
export interface CourseContextType {
  // Collection states
  courses: Course[];
  userCourses: Course[];
  professionalCourses: ProfessionalCourse[];
  userProfessionalCourses: ProfessionalCourse[];
  
  // UI states
  isLoading: boolean;
  loading: boolean; // Added for compatibility
  error: string | null;
  activeCourse: Course | null;
  filteredCourses: Course[];
  filteredProfessionalCourses: ProfessionalCourse[];
  searchTerm: string;
  selectedCategory: string | null;
  selectedDifficulty: string | null;
  selectedSort: string | null;
  
  // Dialog states
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isCreateProfessionalDialogOpen: boolean;
  isEditProfessionalDialogOpen: boolean;
  isDeleteProfessionalDialogOpen: boolean;
  isCreateDialogOpen: boolean;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  
  // Current editing states
  selectedCourse: Course | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  professionalCourse: Partial<ProfessionalCourse> | null;
  setProfessionalCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse> | null>>;
  courseType: 'standard' | 'professional';
  setCourseType: (type: 'standard' | 'professional') => void;
  newModule: string;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  
  // Added missing properties
  newProfessionalCourse: Partial<ProfessionalCourse>;
  setNewProfessionalCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse> | null>>;
  
  // Edit object states
  courseToEdit: Course | null;
  courseToDelete: Course | null;
  professionalCourseToEdit: ProfessionalCourse | null;
  professionalCourseToDelete: ProfessionalCourse | null;
  
  // Collection setters
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>;
  setIsCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Data operations - updated loadCourses to have Promise<void> return type
  loadCourses: () => Promise<void>;
  loadCoursesFromDatabase: () => Promise<boolean>;
  loadCoursesFromLocalStorage: () => Promise<boolean>;
  syncCoursesWithDatabase: () => Promise<boolean>;
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string | null) => void;
  handleDifficultyChange: (value: string | null) => void;
  handleSortChange: (value: string | null) => void;
  resetFilters: () => void;
  
  // Dialog handlers
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
  
  // CRUD operations
  handleCreateCourse: (course: Omit<Course, 'id' | 'createdAt'>) => Promise<boolean>;
  handleUpdateCourse: (id: string, courseData: Partial<Course>) => Promise<boolean>;
  handleDeleteCourse: (id: string) => Promise<boolean>;
  handleCreateProfessionalCourse: (course: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => Promise<boolean>;
  handleUpdateProfessionalCourse: (id: string, courseData: Partial<ProfessionalCourse>) => Promise<boolean>;
  handleDeleteProfessionalCourse: (id: string) => Promise<boolean>;
  
  // New methods to match component usage
  handleAddProfessionalCourse: (course: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => Promise<boolean>;
  handleEditProfessionalCourse: (id: string, courseData: Partial<ProfessionalCourse>) => Promise<boolean>;
  
  // Additional state management
  handleAddModuleToEdit: () => void;
  handleRemoveModuleFromEdit: (index: number) => void;
  handleEditCourse: (id: string, courseData: Partial<Course>) => Promise<boolean>;
  handleEditInit: (course: Course | ProfessionalCourse, type?: 'standard' | 'professional') => void;
  handleCreateInit: (type: 'standard' | 'professional') => void;
}
