import { useState, useEffect } from 'react';
import { Course, ProfessionalCourse } from '@/components/courses/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type UseCourseManagerProps = {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  professionalCourses: ProfessionalCourse[];
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useCourseManager = ({
  courses,
  setCourses,
  professionalCourses,
  setProfessionalCourses,
  isCreateDialogOpen,
  setIsCreateDialogOpen
}: UseCourseManagerProps) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateProfessionalDialogOpen, setIsCreateProfessionalDialogOpen] = useState(false);
  const [isEditProfessionalDialogOpen, setIsEditProfessionalDialogOpen] = useState(false);
  const [isDeleteProfessionalDialogOpen, setIsDeleteProfessionalDialogOpen] = useState(false);
  
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [professionalCourseToEdit, setProfessionalCourseToEdit] = useState<ProfessionalCourse | null>(null);
  const [professionalCourseToDelete, setProfessionalCourseToDelete] = useState<ProfessionalCourse | null>(null);
  
  const { user } = useAuth();

  
  
  const userCourses = courses.filter(course => course.instructor_id === user?.id);
  const userProfessionalCourses = professionalCourses.filter(course => course.partner_id === user?.id);

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? course.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredProfessionalCourses = professionalCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Sort courses if a sort option is selected
  if (selectedSort) {
    filteredCourses.sort((a, b) => {
      if (selectedSort === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (selectedSort === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (selectedSort === 'name_asc') {
        return a.title.localeCompare(b.title);
      } else if (selectedSort === 'name_desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }

  const loadCourses = async () => {
    
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to load from localStorage first
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        if (Array.isArray(parsedCourses) && parsedCourses.length > 0) {
          setCourses(parsedCourses);
          console.info(`Loaded courses from localStorage: ${parsedCourses.length}`);
        }
      }
      
      // Then try to fetch from Supabase
      console.info('Fetching all courses from Supabase');
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
        
      if (coursesError) {
        console.error('Error fetching courses from Supabase:', coursesError);
        setError(`Error fetching courses: ${coursesError.message}`);
        toast.error('Դասընթացները բեռնելիս սխալ է տեղի ունեցել։');
      } else if (coursesData) {
        setCourses(coursesData as Course[]);
        localStorage.setItem('courses', JSON.stringify(coursesData));
        console.info(`Loaded ${coursesData.length} courses from Supabase`);
      }
      
      // Load professional courses
      const { data: profCoursesData, error: profCoursesError } = await supabase
        .from('professional_courses')
        .select('*');
        
      if (profCoursesError) {
        console.error('Error fetching professional courses:', profCoursesError);
      } else if (profCoursesData) {
        setProfessionalCourses(profCoursesData as ProfessionalCourse[]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in loadCourses:', errorMessage);
      setError(errorMessage);
      toast.error('Դասընթացները բեռնելիս սխալ է տեղի ունեցել։');
    } finally {
      setIsLoading(false);
    }
  };

  // Load courses on initial render
  useEffect(() => {
    loadCourses();
  }, []);

  // Filter handling functions
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value);
  };

  const handleDifficultyChange = (value: string | null) => {
    setSelectedDifficulty(value);
  };

  const handleSortChange = (value: string | null) => {
    setSelectedSort(value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedSort(null);
  };

  // Dialog management functions
  const handleOpenEditDialog = (course: Course) => {
    setCourseToEdit(course);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setCourseToEdit(null);
    setIsEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setCourseToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleOpenCreateProfessionalDialog = () => {
    setIsCreateProfessionalDialogOpen(true);
  };

  const handleCloseCreateProfessionalDialog = () => {
    setIsCreateProfessionalDialogOpen(false);
  };

  const handleOpenEditProfessionalDialog = (course: ProfessionalCourse) => {
    setProfessionalCourseToEdit(course);
    setIsEditProfessionalDialogOpen(true);
  };

  const handleCloseEditProfessionalDialog = () => {
    setProfessionalCourseToEdit(null);
    setIsEditProfessionalDialogOpen(false);
  };

  const handleOpenDeleteProfessionalDialog = (course: ProfessionalCourse) => {
    setProfessionalCourseToDelete(course);
    setIsDeleteProfessionalDialogOpen(true);
  };

  const handleCloseDeleteProfessionalDialog = () => {
    setProfessionalCourseToDelete(null);
    setIsDeleteProfessionalDialogOpen(false);
  };

  // CRUD operations
  const handleCreateCourse = async (course: Omit<Course, 'id' | 'created_at'>) => {
    
    
    try {
      setIsLoading(true);
      
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...course,
        instructor_id: user?.id || '',
        instructor_name: user?.name || 'Unknown Instructor',
      };
      
      // Optimistically update local state
      setCourses(prev => [...prev, newCourse]);
      setIsCreateDialogOpen(false);
      
      // Attempt to save to Supabase
      const { error } = await supabase.from('courses').insert(newCourse);
      
      if (error) {
        console.error('Error creating course:', error);
        // Revert optimistic update if there's an error
        setCourses(prev => prev.filter(c => c.id !== newCourse.id));
        toast.error('Դասընթացը ստեղծելիս սխալ է տեղի ունեցել։');
        return false;
      }
      
      toast.success('Դասընթացը հաջողությամբ ստեղծվել է։');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in handleCreateCourse:', errorMessage);
      toast.error('Դասընթացը ստեղծելիս սխալ է տեղի ունեցել։');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async (id: string, courseData: Partial<Course>) => {
    
    
    try {
      setIsLoading(true);
      
      // Optimistically update local state
      setCourses(prev => 
        prev.map(course => 
          course.id === id ? { ...course, ...courseData } : course
        )
      );
      
      // Close dialog
      handleCloseEditDialog();
      
      // Attempt to update in Supabase
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating course:', error);
        // Reload courses to revert changes if there's an error
        loadCourses();
        toast.error('Դասընթացը թարմացնելիս սխալ է տեղի ունեցել։');
        return false;
      }
      
      toast.success('Դասընթացը հաջողությամբ թարմացվել է։');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in handleUpdateCourse:', errorMessage);
      toast.error('Դասընթացը թարմացնելիս սխալ է տեղի ունեցել։');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    
    
    try {
      setIsLoading(true);
      
      // Optimistically update local state
      const courseToRemove = courses.find(course => course.id === id);
      setCourses(prev => prev.filter(course => course.id !== id));
      
      // Close dialog
      handleCloseDeleteDialog();
      
      // Attempt to delete from Supabase
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting course:', error);
        // Restore course if there's an error
        if (courseToRemove) {
          setCourses(prev => [...prev, courseToRemove]);
        }
        toast.error('Դասընթացը ջնջելիս սխալ է տեղի ունեցել։');
        return false;
      }
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է։');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in handleDeleteCourse:', errorMessage);
      toast.error('Դասընթացը ջնջելիս սխալ է տեղի ունեցել։');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfessionalCourse = async (course: Omit<ProfessionalCourse, 'id' | 'created_at'>) => {
    
    
    try {
      setIsLoading(true);
      
      const newCourse: ProfessionalCourse = {
        id: `prof-course-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...course,
        partner_id: user?.id || '',
        partner_name: user?.name || 'Unknown Partner',
      };
      
      // Optimistically update local state
      setProfessionalCourses(prev => [...prev, newCourse]);
      setIsCreateProfessionalDialogOpen(false);
      
      // Attempt to save to Supabase
      const { error } = await supabase.from('professional_courses').insert(newCourse);
      
      if (error) {
        console.error('Error creating professional course:', error);
        // Revert optimistic update if there's an error
        setProfessionalCourses(prev => prev.filter(c => c.id !== newCourse.id));
        toast.error('Մասնագիտական դասընթացը ստեղծելիս սխալ է տեղի ունեցել։');
        return false;
      }
      
      toast.success('Մասնագիտական դասընթացը հաջողությամբ ստեղծվել է։');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in handleCreateProfessionalCourse:', errorMessage);
      toast.error('Մասնագիտական դասընթացը ստեղծելիս սխալ է տեղի ունեցել։');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfessionalCourse = async (id: string, courseData: Partial<ProfessionalCourse>) => {
    
    
    try {
      setIsLoading(true);
      
      // Optimistically update local state
      setProfessionalCourses(prev => 
        prev.map(course => 
          course.id === id ? { ...course, ...courseData } : course
        )
      );
      
      // Close dialog
      handleCloseEditProfessionalDialog();
      
      // Attempt to update in Supabase
      const { error } = await supabase
        .from('professional_courses')
        .update(courseData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating professional course:', error);
        // Reload courses to revert changes if there's an error
        loadCourses();
        toast.error('Մասնագիտական դասընթացը թարմացնելիս սխալ է տեղի ունեցել։');
        return false;
      }
      
      toast.success('Մասնագիտական դասընթացը հաջողությամբ թարմացվել է։');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in handleUpdateProfessionalCourse:', errorMessage);
      toast.error('Մասնագիտական դասընթացը թարմացնելիս սխալ է տեղի ունեցել։');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfessionalCourse = async (id: string) => {
    
    
    try {
      setIsLoading(true);
      
      // Optimistically update local state
      const courseToRemove = professionalCourses.find(course => course.id === id);
      setProfessionalCourses(prev => prev.filter(course => course.id !== id));
      
      // Close dialog
      handleCloseDeleteProfessionalDialog();
      
      // Attempt to delete from Supabase
      const { error } = await supabase
        .from('professional_courses')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting professional course:', error);
        // Restore course if there's an error
        if (courseToRemove) {
          setProfessionalCourses(prev => [...prev, courseToRemove]);
        }
        toast.error('Մասնագիտական դասընթացը ջնջելիս սխալ է տեղի ունեցել։');
        return false;
      }
      
      toast.success('Մասնագիտական դասընթացը հաջողությամբ ջնջվել է։');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in handleDeleteProfessionalCourse:', errorMessage);
      toast.error('Մասնագիտական դասընթացը ջնջելիս սխալ է տեղի ունեցել։');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courses,
    userCourses,
    professionalCourses,
    userProfessionalCourses,
    isLoading,
    error,
    activeCourse,
    filteredCourses,
    filteredProfessionalCourses,
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedSort,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isCreateProfessionalDialogOpen,
    isEditProfessionalDialogOpen,
    isDeleteProfessionalDialogOpen,
    courseToEdit,
    courseToDelete,
    professionalCourseToEdit,
    professionalCourseToDelete,
    loadCourses,
    handleSearchChange,
    handleCategoryChange,
    handleDifficultyChange,
    handleSortChange,
    resetFilters,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenCreateProfessionalDialog,
    handleCloseCreateProfessionalDialog,
    handleOpenEditProfessionalDialog,
    handleCloseEditProfessionalDialog,
    handleOpenDeleteProfessionalDialog,
    handleCloseDeleteProfessionalDialog,
    handleCreateCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    handleCreateProfessionalCourse,
    handleUpdateProfessionalCourse,
    handleDeleteProfessionalCourse
  };
};
