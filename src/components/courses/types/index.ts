
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

// Export ProfessionalCourse from its module
export type { ProfessionalCourse, LessonItem } from './ProfessionalCourse';

// CourseContextType with all required properties
export interface CourseContextType {
  // Collection states
  courses: Course[];
  userCourses: Course[];
  professionalCourses: ProfessionalCourse[];
  userProfessionalCourses: ProfessionalCourse[];
  
  // UI states
  isLoading: boolean;
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
  
  // Current editing states
  selectedCourse: Course | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  professionalCourse: Partial<ProfessionalCourse> | null;
  setProfessionalCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse> | null>>;
  courseType: 'standard' | 'professional';
  setCourseType: (type: 'standard' | 'professional') => void;
  newModule: string;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  
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
  
  // Data operations
  loadCourses: () => Promise<void>;
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
  
  // Additional state management
  handleAddModuleToEdit: () => void;
  handleRemoveModuleFromEdit: (index: number) => void;
  handleEditCourse: () => void;
  handleEditInit: (course: Course | ProfessionalCourse, type?: 'standard' | 'professional') => void;
  handleCreateInit: (type: 'standard' | 'professional') => void;
}
