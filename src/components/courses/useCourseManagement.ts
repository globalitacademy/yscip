import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe, Book } from 'lucide-react';
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  saveCourseChanges, 
  getAllCoursesFromSupabase, 
  getAllCoursesFromLocalStorage,
  syncCoursesToSupabase
} from './utils/courseUtils';

export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

const initialCourses: Course[] = [];

const initializeProfessionalCourses = async (): Promise<ProfessionalCourse[]> => {
  try {
    const supabaseCourses = await getAllCoursesFromSupabase();
    if (supabaseCourses && supabaseCourses.length > 0) {
      return supabaseCourses;
    }
    
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        for (const course of parsedCourses) {
          await saveCourseChanges(course);
        }
        return parsedCourses;
      } catch (e) {
        console.error('Error parsing stored professional courses:', e);
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error initializing professional courses:', error);
    return [];
  }
};

const initializeCourses = (): Course[] => {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    try {
      return JSON.parse(storedCourses);
    } catch (e) {
      console.error('Error parsing stored courses:', e);
    }
  }
  return initialCourses;
};

export const useCourseManagement = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(initializeCourses());
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProfessionalCourse, setSelectedProfessionalCourse] = useState<ProfessionalCourse | null>(null);
  const [professionalCourse, setProfessionalCourse] = useState<Partial<ProfessionalCourse>>({});
  const [courseType, setCourseType] = useState<'standard' | 'professional'>('standard');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    specialization: '',
    instructor: '',
    duration: '',
    modules: [],
    prerequisites: [],
    category: '',
    createdBy: user?.id || '',
    is_public: false
  });
  
  const [newProfessionalCourse, setNewProfessionalCourse] = useState<Partial<ProfessionalCourse>>({
    title: '',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Code, { className: "w-16 h-16" }),
    duration: '',
    price: '',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: user?.name || '',
    institution: 'ՀՊՏՀ',
    imageUrl: undefined,
    description: '',
    lessons: [],
    requirements: [],
    outcomes: [],
    is_public: false,
    show_on_homepage: false,
    display_order: 0
  });
  
  const [newModule, setNewModule] = useState('');

  useEffect(() => {
    const loadInitialCourses = async () => {
      setLoading(true);
      try {
        const initialCourses = await initializeProfessionalCourses();
        setProfessionalCourses(initialCourses);
      } catch (error) {
        console.error('Error loading initial courses:', error);
        toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialCourses();
  }, []);

  const loadCoursesFromDatabase = useCallback(async () => {
    try {
      setLoading(true);
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
      
      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        toast.error('Սխալ դասընթացների ստացման ժամանակ, օգտագործվում են լոկալ տվյալները');
        await loadCoursesFromLocalStorage();
        return;
      }
      
      if (!coursesData || coursesData.length === 0) {
        console.log('No courses found in database, checking local storage');
        const storedCourses = localStorage.getItem('professionalCourses');
        if (storedCourses) {
          const parsedCourses: ProfessionalCourse[] = JSON.parse(storedCourses);
          setProfessionalCourses(parsedCourses);
          for (const course of parsedCourses) {
            await saveCourseChanges(course);
          }
          toast.success('Տեղական դասընթացները համաժամեցվել են բազայի հետ');
        } else {
          setProfessionalCourses([]);
          toast.info('Դասընթացներ չկան, ավելացրեք նոր դասընթացներ');
        }
        setLoading(false);
        return;
      }
      
      const completeCourses = await Promise.all(coursesData.map(async (course) => {
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', course.id);
        
        const { data: requirementsData } = await supabase
          .from('course_requirements')
          .select('*')
          .eq('course_id', course.id);
        
        const { data: outcomesData } = await supabase
          .from('course_outcomes')
          .select('*')
          .eq('course_id', course.id);
        
        let iconComponent;
        switch ((course.icon_name || '').toLowerCase()) {
          case 'book':
            iconComponent = React.createElement(Book, { className: "w-16 h-16" });
            break;
          case 'code':
            iconComponent = React.createElement(Code, { className: "w-16 h-16" });
            break;
          case 'braincircuit':
          case 'brain':
            iconComponent = React.createElement(BrainCircuit, { className: "w-16 h-16" });
            break;
          case 'database':
            iconComponent = React.createElement(Database, { className: "w-16 h-16" });
            break;
          case 'filecode':
          case 'file':
            iconComponent = React.createElement(FileCode, { className: "w-16 h-16" });
            break;
          case 'globe':
            iconComponent = React.createElement(Globe, { className: "w-16 h-16" });
            break;
          default:
            iconComponent = React.createElement(Book, { className: "w-16 h-16" });
        }
        
        return {
          id: course.id,
          title: course.title,
          subtitle: course.subtitle,
          icon: iconComponent,
          iconName: course.icon_name,
          duration: course.duration,
          price: course.price,
          buttonText: course.button_text,
          color: course.color,
          createdBy: course.created_by,
          institution: course.institution,
          imageUrl: course.image_url,
          organizationLogo: course.organization_logo,
          description: course.description,
          is_public: course.is_public,
          lessons: lessonsData?.map(lesson => ({
            title: lesson.title, 
            duration: lesson.duration
          })) || [],
          requirements: requirementsData?.map(req => req.requirement) || [],
          outcomes: outcomesData?.map(outcome => outcome.outcome) || []
        } as ProfessionalCourse;
      }));
      
      setProfessionalCourses(completeCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(completeCourses));
    } catch (error) {
      console.error('Error loading courses from database:', error);
      toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
      await loadCoursesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCoursesFromLocalStorage = useCallback(async () => {
    try {
      const storedCourses = localStorage.getItem('professionalCourses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        if (parsedCourses && parsedCourses.length > 0) {
          console.log('Loaded courses from localStorage:', parsedCourses.length);
          setProfessionalCourses(parsedCourses);
          return true;
        }
      }
      
      console.log('No courses in localStorage');
      setProfessionalCourses([]);
      
      return false;
    } catch (error) {
      console.error('Error loading courses from localStorage:', error);
      setProfessionalCourses([]);
      return false;
    }
  }, []);

  const userCourses = courses.filter(course => course.createdBy === user?.id);
  
  const userProfessionalCourses = professionalCourses.filter(course => course.createdBy === user?.name);

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const courseToAdd: Course = {
      id: uuidv4(),
      title: newCourse.title,
      description: newCourse.description,
      specialization: newCourse.specialization || '',
      instructor: newCourse.instructor || '',
      duration: newCourse.duration,
      modules: newCourse.modules || [],
      prerequisites: newCourse.prerequisites || [],
      category: newCourse.category || '',
      createdBy: user?.id || 'unknown',
      is_public: newCourse.is_public || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedCourses = [...courses, courseToAdd];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    setNewCourse({
      title: '',
      description: '',
      specialization: '',
      instructor: '',
      duration: '',
      modules: [],
      prerequisites: [],
      category: '',
      createdBy: user?.id || '',
      is_public: false
    });
    setIsAddDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ ավելացվել է');
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;
    
    if (!selectedCourse.title || !selectedCourse.description || !selectedCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id ? selectedCourse : course
    );
    
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setIsEditDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ թարմացվել է');
  };

  const handleEditInit = (course: Course) => {
    setSelectedCourse({...course});
    setIsEditDialogOpen(true);
  };

  const handleEditProfessionalCourseInit = (course: ProfessionalCourse) => {
    setSelectedProfessionalCourse({...course});
    setIsEditDialogOpen(true);
  };

  const handleAddModule = () => {
    if (!newModule) return;
    setNewCourse({
      ...newCourse,
      modules: [...(newCourse.modules || []), newModule]
    });
    setNewModule('');
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...(newCourse.modules || [])];
    updatedModules.splice(index, 1);
    setNewCourse({
      ...newCourse,
      modules: updatedModules
    });
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

  const handleDeleteCourse = (id: string) => {
    const courseToDelete = courses.find(course => course.id === id);
    
    if (courseToDelete && (user?.role === 'admin' || courseToDelete.createdBy === user?.id)) {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      toast.success('Կուրսը հաջողությամբ հեռացվել է');
    } else {
      toast.error('Դուք չունեք իրավունք ջնջելու այս կուրսը');
    }
  };

  const handleCreateProfessionalCourse = async (courseData: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => {
    if (!courseData.title || !courseData.duration || !courseData.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return false;
    }

    // Generate slug if not provided
    if (!courseData.slug && courseData.title) {
      courseData.slug = courseData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    }

    const courseToAdd: ProfessionalCourse = {
      ...(courseData as ProfessionalCourse),
      id: uuidv4(),
      createdBy: user?.name || 'Unknown',
      buttonText: courseData.buttonText || 'Դիտել',
      subtitle: courseData.subtitle || 'ԴԱՍԸՆԹԱՑ',
      color: courseData.color || 'text-amber-500',
      institution: courseData.institution || 'ՀՊՏՀ',
      iconName: 'book',
      is_public: courseData.is_public || false,
      show_on_homepage: courseData.show_on_homepage || false,
      display_order: courseData.display_order || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const success = await saveCourseChanges(courseToAdd);
    
    if (success) {
      const updatedCourses = [...professionalCourses, courseToAdd];
      setProfessionalCourses(updatedCourses);
      
      setNewProfessionalCourse({
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        icon: React.createElement(Code, { className: "w-16 h-16" }),
        duration: '',
        price: '',
        buttonText: 'Դիտել',
        color: 'text-amber-500',
        createdBy: user?.name || '',
        institution: 'ՀՊՏՀ',
        imageUrl: undefined,
        description: '',
        lessons: [],
        requirements: [],
        outcomes: [],
        is_public: false,
        show_on_homepage: false,
        display_order: 0
      });
      setIsAddDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ ավելացվել է');
    } else {
      toast.error('Դասընթացի ավելացման ժամանակ սխալ է տեղի ունեցել');
    }
    
    return success;
  };

  const handleUpdateProfessionalCourse = async (id: string, courseData: Partial<ProfessionalCourse>) => {
    if (!selectedProfessionalCourse) return false;
    
    // Update the course
    const updatedCourse = { ...selectedProfessionalCourse, ...courseData };
    
    // Generate or update slug if title changed
    if (courseData.title && (!updatedCourse.slug || selectedProfessionalCourse.title !== courseData.title)) {
      updatedCourse.slug = courseData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    }
    
    const success = await saveCourseChanges(updatedCourse);
    
    if (success) {
      const updatedCourses = professionalCourses.map(course => 
        course.id === id ? updatedCourse : course
      );
      
      setProfessionalCourses(updatedCourses);
      setIsEditDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } else {
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    }
    
    return success;
  };

  const handleDeleteProfessionalCourse = (id: string) => {
    const courseToDelete = professionalCourses.find(course => course.id === id);
    
    if (courseToDelete && user?.role === 'admin') {
      const updatedCourses = professionalCourses.filter(course => course.id !== id);
      setProfessionalCourses(updatedCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      toast.success('Դասընթացը հաջողությամբ հեռացվել է');
    } else {
      toast.error('Դուք չունեք իրավունք ջնջելու այս դասընթացը');
    }
  };

  const syncCoursesWithDatabase = async () => {
    setLoading(true);
    toast.info('Դասընթացների համաժամեցում...');
    
    try {
      await syncCoursesToSupabase();
      await loadCoursesFromDatabase();
      toast.success('Դասընթացները հաջողությամբ համաժամեցվել են');
    } catch (error) {
      console.error('Error syncing courses with database:', error);
      toast.error('Դասընթացների համաժամեցման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    userCourses,
    professionalCourses,
    userProfessionalCourses,
    selectedCourse,
    selectedProfessionalCourse,
    setSelectedCourse,
    setSelectedProfessionalCourse,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    newCourse,
    newProfessionalCourse,
    newModule,
    loading,
    setNewCourse,
    setNewProfessionalCourse,
    setNewModule,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleAddCourse,
    handleAddProfessionalCourse,
    handleEditCourse,
    handleEditProfessionalCourse,
    handleEditInit,
    handleEditProfessionalCourseInit,
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse,
    handleDeleteProfessionalCourse,
    loadCoursesFromDatabase,
    syncCoursesWithDatabase,
    loadCoursesFromLocalStorage,
    professionalCourse,
    setProfessionalCourse,
    courseType,
    setCourseType
  };
};
