import { useState, useEffect } from 'react';
import { Course } from '@/components/courses/types';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
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
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [professionalCourse, setProfessionalCourse] = useState<Partial<ProfessionalCourse> | null>(null);
  const [courseType, setCourseType] = useState<'standard' | 'professional'>('standard');
  const [newModule, setNewModule] = useState('');
  
  const { user } = useAuth();

  const userCourses = courses.filter(course => course.createdBy === user?.id);
  const userProfessionalCourses = professionalCourses.filter(course => course.createdBy === user?.id);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? course.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredProfessionalCourses = professionalCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? (course.category ? course.category === selectedCategory : false) : true;
    return matchesSearch && matchesCategory;
  });

  if (selectedSort) {
    filteredCourses.sort((a, b) => {
      if (selectedSort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (selectedSort === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (selectedSort === 'name_asc') {
        return (a.title || a.name).localeCompare(b.title || b.name);
      } else if (selectedSort === 'name_desc') {
        return (b.title || b.name).localeCompare(a.title || a.name);
      }
      return 0;
    });
  }

  const loadCourses = async () => {
    
    setIsLoading(true);
    setError(null);
    
    try {
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        if (Array.isArray(parsedCourses) && parsedCourses.length > 0) {
          setCourses(parsedCourses);
          console.info(`Loaded courses from localStorage: ${parsedCourses.length}`);
        }
      }
      
      console.info('Fetching all courses from Supabase');
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_public', false);
        
      if (coursesError) {
        console.error('Error fetching courses from Supabase:', coursesError);
        setError(`Error fetching courses: ${coursesError.message}`);
        toast.error('Դասընթացները բեռնելիս սխալ է տեղի ունեցել։');
      } else if (coursesData) {
        const formattedCourses: Course[] = coursesData
          .filter(item => !item.is_public)
          .map(item => ({
            id: item.id,
            name: item.title,
            title: item.title,
            description: item.description || '',
            specialization: item.specialization || '',
            instructor: item.created_by || '',
            duration: item.duration,
            modules: item.modules || [],
            prerequisites: [],
            category: '',
            createdBy: item.created_by || '',
            is_public: item.is_public,
            imageUrl: item.image_url,
            difficulty: '',
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));
        
        setCourses(formattedCourses);
        localStorage.setItem('courses', JSON.stringify(formattedCourses));
        console.info(`Loaded ${formattedCourses.length} courses from Supabase`);
      }
      
      try {
        const { data: profCoursesData, error: profCoursesError } = await supabase
          .from('courses')
          .select('*')
          .eq('is_public', true);
            
        if (profCoursesError) {
          console.error('Error fetching professional courses:', profCoursesError);
        } else if (profCoursesData) {
          const professionalCoursesData = profCoursesData
            .filter(item => item.is_public)
            .map(item => ({
              id: item.id,
              title: item.title,
              subtitle: item.subtitle || 'ԴԱՍԸՆԹԱՑ',
              icon: null,
              iconName: item.icon_name,
              duration: item.duration,
              price: item.price || 'Free',
              buttonText: item.button_text || 'Դիտել',
              color: item.color || 'text-amber-500',
              createdBy: item.created_by || '',
              institution: item.institution || '',
              description: item.description,
              imageUrl: item.image_url,
              organizationLogo: item.organization_logo,
              is_public: item.is_public,
              createdAt: item.created_at,
              updatedAt: item.updated_at,
              category: ''
            })) as ProfessionalCourse[];
          
          setProfessionalCourses(professionalCoursesData);
        }
      } catch (profError) {
        console.error('Error processing professional courses:', profError);
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

  useEffect(() => {
    loadCourses();
  }, []);

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

  const handleCreateCourse = async (course: Omit<Course, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        ...course as Course,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        instructor: user?.name || 'Unknown Instructor',
        name: course.title || course.name || '',
        specialization: course.specialization || '',
      };
      
      setCourses(prev => [...prev, newCourse]);
      setIsCreateDialogOpen(false);
      
      const supabaseCourseData = {
        id: newCourse.id,
        title: newCourse.title || newCourse.name,
        description: newCourse.description,
        specialization: newCourse.specialization,
        created_by: newCourse.createdBy,
        duration: newCourse.duration,
        modules: newCourse.modules,
        prerequisites: newCourse.prerequisites || [],
        category: newCourse.category || '',
        is_public: false,
        difficulty: newCourse.difficulty || '',
        image_url: newCourse.imageUrl,
        created_at: newCourse.createdAt,
        updated_at: newCourse.updatedAt,
        icon_name: 'book',
        price: 'Free',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        button_text: 'Դիտել',
        color: 'text-amber-500',
        institution: 'ՀՊՏՀ'
      };
      
      const { error } = await supabase.from('courses').insert(supabaseCourseData);
      
      if (error) {
        console.error('Error creating course:', error);
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
      
      setCourses(prev => 
        prev.map(course => 
          course.id === id ? { ...course, ...courseData } : course
        )
      );
      
      handleCloseEditDialog();
      
      const supabaseData: Record<string, any> = {};
      
      if (courseData.title) supabaseData.title = courseData.title;
      if (courseData.description) supabaseData.description = courseData.description;
      if (courseData.specialization) supabaseData.specialization = courseData.specialization;
      if (courseData.duration) supabaseData.duration = courseData.duration;
      if (courseData.modules) supabaseData.modules = courseData.modules;
      if (courseData.prerequisites) supabaseData.prerequisites = courseData.prerequisites;
      if (courseData.is_public !== undefined) supabaseData.is_public = courseData.is_public;
      if (courseData.imageUrl) supabaseData.image_url = courseData.imageUrl;
      
      supabaseData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('courses')
        .update(supabaseData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating course:', error);
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
      
      const courseToRemove = courses.find(course => course.id === id);
      setCourses(prev => prev.filter(course => course.id !== id));
      
      handleCloseDeleteDialog();
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting course:', error);
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

  const handleCreateProfessionalCourse = async (course: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      
      const newCourse: ProfessionalCourse = {
        id: `prof-course-${Date.now()}`,
        ...course as ProfessionalCourse,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.name || 'Unknown Partner',
      };
      
      setProfessionalCourses(prev => [...prev, newCourse]);
      
      const supabaseCourseData = {
        id: newCourse.id,
        title: newCourse.title,
        subtitle: newCourse.subtitle,
        icon_name: newCourse.iconName,
        duration: newCourse.duration,
        price: newCourse.price,
        button_text: newCourse.buttonText,
        color: newCourse.color,
        created_by: newCourse.createdBy,
        institution: newCourse.institution,
        image_url: newCourse.imageUrl,
        organization_logo: newCourse.organizationLogo,
        description: newCourse.description,
        is_public: true,
        created_at: newCourse.createdAt,
        updated_at: newCourse.updatedAt
      };
      
      const { error } = await supabase.from('courses').insert(supabaseCourseData);
      
      if (error) {
        console.error('Error creating professional course:', error);
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
      
      setProfessionalCourses(prev => 
        prev.map(course => 
          course.id === id ? { ...course, ...courseData } : course
        )
      );
      
      handleCloseEditProfessionalDialog();
      
      const supabaseData: Record<string, any> = {};
      
      if (courseData.title) supabaseData.title = courseData.title;
      if (courseData.subtitle) supabaseData.subtitle = courseData.subtitle;
      if (courseData.iconName) supabaseData.icon_name = courseData.iconName;
      if (courseData.duration) supabaseData.duration = courseData.duration;
      if (courseData.price) supabaseData.price = courseData.price;
      if (courseData.buttonText) supabaseData.button_text = courseData.buttonText;
      if (courseData.color) supabaseData.color = courseData.color;
      if (courseData.institution) supabaseData.institution = courseData.institution;
      if (courseData.imageUrl) supabaseData.image_url = courseData.imageUrl;
      if (courseData.organizationLogo) supabaseData.organization_logo = courseData.organizationLogo;
      if (courseData.description) supabaseData.description = courseData.description;
      if (courseData.is_public !== undefined) supabaseData.is_public = courseData.is_public;
      
      supabaseData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('courses')
        .update(supabaseData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating professional course:', error);
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
      
      const courseToRemove = professionalCourses.find(course => course.id === id);
      setProfessionalCourses(prev => prev.filter(course => course.id !== id));
      
      handleCloseDeleteProfessionalDialog();
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting professional course:', error);
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

  const handleAddModuleToEdit = () => {
    if (!newModule || !selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: [...selectedCourse.modules, newModule]
    });
    setNewModule('');
  };

  const handleRemoveModuleFromEdit = (index: number) => {
    if (!selectedCourse) return;
    const updatedModules = [...selectedCourse.modules];
    updatedModules.splice(index, 1);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  };

  const handleEditCourse = async () => {
    if (courseType === 'standard' && selectedCourse) {
      return await handleUpdateCourse(selectedCourse.id, selectedCourse);
    } else if (courseType === 'professional' && professionalCourse && professionalCourseToEdit) {
      return await handleUpdateProfessionalCourse(
        professionalCourseToEdit.id, 
        professionalCourse as Partial<ProfessionalCourse>
      );
    }
    return false;
  };

  const handleEditInit = (course: Course | ProfessionalCourse, type: 'standard' | 'professional' = 'standard') => {
    setCourseType(type);
    if (type === 'standard') {
      setSelectedCourse(course as Course);
      setCourseToEdit(course as Course);
    } else {
      setProfessionalCourse(course as ProfessionalCourse);
      setProfessionalCourseToEdit(course as ProfessionalCourse);
    }
    setIsEditDialogOpen(true);
  };

  const handleCreateInit = (type: 'standard' | 'professional') => {
    setCourseType(type);
    if (type === 'standard') {
      setSelectedCourse({
        id: '',
        title: '',
        name: '',
        description: '',
        instructor: user?.name || '',
        duration: '',
        modules: [],
        prerequisites: [],
        createdBy: user?.id || ''
      });
    } else {
      setProfessionalCourse({
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        iconName: 'book',
        duration: '',
        price: '',
        buttonText: 'Դիտել',
        color: 'text-amber-500',
        createdBy: user?.name || '',
        institution: 'ՀՊՏՀ',
        description: '',
        icon: null
      });
    }
    setIsCreateDialogOpen(true);
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
    
    setCourses,
    setProfessionalCourses,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    
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
    handleDeleteProfessionalCourse,
    
    selectedCourse,
    setSelectedCourse,
    professionalCourse,
    setProfessionalCourse,
    courseType,
    setCourseType,
    newModule,
    setNewModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleEditCourse,
    handleEditInit,
    handleCreateInit
  };
};
