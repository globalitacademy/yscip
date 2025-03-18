
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

// Mock specializations for the form
export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

// Old mock data kept for reference (Legacy courses)
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Վեբ ծրագրավորում',
    description: 'HTML, CSS, JavaScript, React և Node.js օգտագործելով վեբ հավելվածների մշակում',
    specialization: 'Ծրագրավորում',
    duration: '4 ամիս',
    modules: ['HTML/CSS հիմունքներ', 'JavaScript', 'React', 'Node.js/Express', 'Վերջնական նախագիծ'],
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'Մեքենայական ուսուցում',
    description: 'Ներածություն մեքենայական ուսուցման մեջ՝ օգտագործելով Python և TensorFlow',
    specialization: 'Տվյալագիտություն',
    duration: '6 ամիս',
    modules: ['Python հիմունքներ', 'Տվյալների վերլուծություն', 'Վիճակագրություն', 'Մեքենայական ուսուցման մոդելներ', 'Խորը ուսուցում', 'Վերջնական նախագիծ'],
    createdBy: 'admin'
  }
];

// Initialize courses with mock data if localStorage is empty
const initializeCourses = (): Course[] => {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    try {
      return JSON.parse(storedCourses);
    } catch (e) {
      console.error('Error parsing stored courses:', e);
    }
  }
  return mockCourses;
};

// Function to convert icon name to React element
export const getIconFromName = (iconName: string): React.ReactElement => {
  switch (iconName) {
    case 'code':
      return React.createElement(Code, { className: "w-16 h-16" });
    case 'book':
      return React.createElement(BookText, { className: "w-16 h-16" });
    case 'ai':
      return React.createElement(BrainCircuit, { className: "w-16 h-16" });
    case 'database':
      return React.createElement(Database, { className: "w-16 h-16" });
    case 'files':
      return React.createElement(FileCode, { className: "w-16 h-16" });
    case 'web':
      return React.createElement(Globe, { className: "w-16 h-16" });
    default:
      return React.createElement(Code, { className: "w-16 h-16" });
  }
};

// Function to get icon name from React element
export const getIconNameFromElement = (icon: React.ReactElement): string => {
  const type = icon.type;
  if (type === Code) return 'code';
  if (type === BookText) return 'book';
  if (type === BrainCircuit) return 'ai';
  if (type === Database) return 'database';
  if (type === FileCode) return 'files';
  if (type === Globe) return 'web';
  return 'code';
};

export const useCourseManagement = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(initializeCourses());
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProfessionalCourse, setSelectedProfessionalCourse] = useState<ProfessionalCourse | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    description: '',
    specialization: '',
    duration: '',
    modules: [],
    createdBy: user?.id || ''
  });
  
  const [newProfessionalCourse, setNewProfessionalCourse] = useState<Partial<ProfessionalCourse>>({
    title: '',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Code, { className: "w-16 h-16" }),
    icon_name: 'code',
    duration: '',
    price: '',
    button_text: 'Դիտել',
    color: 'text-amber-500',
    created_by: user?.name || '',
    institution: 'ՀՊՏՀ',
    image_url: undefined,
    description: '',
    lessons: [],
    requirements: [],
    outcomes: []
  });
  
  const [newModule, setNewModule] = useState('');

  // Load courses from Supabase
  const fetchProfessionalCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
      
      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        toast.error('Սխալ դասընթացների բեռնման ժամանակ');
        setLoading(false);
        return;
      }

      const coursesList: ProfessionalCourse[] = [];
      
      // Fetch related data for each course
      for (const course of coursesData) {
        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', course.id);
          
        if (lessonsError) {
          console.error('Error fetching lessons:', lessonsError);
        }
        
        // Fetch requirements
        const { data: requirementsData, error: requirementsError } = await supabase
          .from('course_requirements')
          .select('*')
          .eq('course_id', course.id);
          
        if (requirementsError) {
          console.error('Error fetching requirements:', requirementsError);
        }
        
        // Fetch outcomes
        const { data: outcomesData, error: outcomesError } = await supabase
          .from('course_outcomes')
          .select('*')
          .eq('course_id', course.id);
          
        if (outcomesError) {
          console.error('Error fetching outcomes:', outcomesError);
        }
        
        // Transform to ProfessionalCourse format
        const professionalCourse: ProfessionalCourse = {
          id: course.id,
          title: course.title,
          subtitle: course.subtitle,
          icon: getIconFromName(course.icon_name),
          icon_name: course.icon_name,
          duration: course.duration,
          price: course.price,
          button_text: course.button_text,
          color: course.color,
          created_by: course.created_by,
          institution: course.institution,
          image_url: course.image_url,
          description: course.description,
          is_persistent: true,
          lessons: lessonsData?.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration
          })) || [],
          requirements: requirementsData?.map(req => req.requirement) || [],
          outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
          created_at: course.created_at,
          updated_at: course.updated_at
        };
        
        coursesList.push(professionalCourse);
      }
      
      setProfessionalCourses(coursesList);
    } catch (error) {
      console.error('Error fetching professional courses:', error);
      toast.error('Սխալ դասընթացների բեռնման ժամանակ');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchProfessionalCourses();
  }, []);
  
  // Get user's courses
  const userCourses = courses.filter(course => course.createdBy === user?.id);
  
  // Get user's professional courses
  const userProfessionalCourses = professionalCourses.filter(course => course.created_by === user?.name);

  // Legacy course functions
  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.description || !newCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const courseToAdd: Course = {
      id: uuidv4(),
      name: newCourse.name,
      description: newCourse.description,
      specialization: newCourse.specialization,
      duration: newCourse.duration,
      modules: newCourse.modules || [],
      createdBy: user?.id || 'unknown'
    };

    const updatedCourses = [...courses, courseToAdd];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    setNewCourse({
      name: '',
      description: '',
      specialization: '',
      duration: '',
      modules: [],
      createdBy: user?.id || ''
    });
    setIsAddDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ ավելացվել է');
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;
    
    if (!selectedCourse.name || !selectedCourse.description || !selectedCourse.duration) {
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
    
    // Only allow users to delete their own courses (admin can delete any)
    if (courseToDelete && (user?.role === 'admin' || courseToDelete.createdBy === user?.id)) {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      toast.success('Կուրսը հաջողությամբ հեռացվել է');
    } else {
      toast.error('Դուք չունեք իրավունք ջնջելու այս կուրսը');
    }
  };

  // Professional Courses Functions with Supabase
  const handleAddProfessionalCourse = async () => {
    if (!newProfessionalCourse.title || !newProfessionalCourse.duration || !newProfessionalCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      // Prepare the icon name
      const iconName = newProfessionalCourse.icon_name || getIconNameFromElement(newProfessionalCourse.icon as React.ReactElement);

      // Insert course into database
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: newProfessionalCourse.title,
          subtitle: newProfessionalCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
          icon_name: iconName,
          duration: newProfessionalCourse.duration,
          price: newProfessionalCourse.price,
          button_text: newProfessionalCourse.button_text || 'Դիտել',
          color: newProfessionalCourse.color || 'text-amber-500',
          created_by: user?.name || 'Unknown',
          institution: newProfessionalCourse.institution || 'ՀՊՏՀ',
          image_url: newProfessionalCourse.image_url,
          description: newProfessionalCourse.description,
          is_persistent: true
        })
        .select();

      if (courseError) {
        console.error('Error adding course:', courseError);
        toast.error('Սխալ դասընթացի ավելացման ժամանակ');
        return;
      }

      const newCourseId = courseData[0].id;

      // Add lessons if any
      if (newProfessionalCourse.lessons && newProfessionalCourse.lessons.length > 0) {
        const lessonsToAdd = newProfessionalCourse.lessons.map(lesson => ({
          course_id: newCourseId,
          title: lesson.title,
          duration: lesson.duration
        }));

        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(lessonsToAdd);

        if (lessonsError) {
          console.error('Error adding lessons:', lessonsError);
        }
      }

      // Add requirements if any
      if (newProfessionalCourse.requirements && newProfessionalCourse.requirements.length > 0) {
        const requirementsToAdd = newProfessionalCourse.requirements.map(req => ({
          course_id: newCourseId,
          requirement: req
        }));

        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(requirementsToAdd);

        if (requirementsError) {
          console.error('Error adding requirements:', requirementsError);
        }
      }

      // Add outcomes if any
      if (newProfessionalCourse.outcomes && newProfessionalCourse.outcomes.length > 0) {
        const outcomesToAdd = newProfessionalCourse.outcomes.map(outcome => ({
          course_id: newCourseId,
          outcome: outcome
        }));

        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(outcomesToAdd);

        if (outcomesError) {
          console.error('Error adding outcomes:', outcomesError);
        }
      }

      // Refresh the courses list
      await fetchProfessionalCourses();
      
      // Reset the form
      setNewProfessionalCourse({
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        icon: React.createElement(Code, { className: "w-16 h-16" }),
        icon_name: 'code',
        duration: '',
        price: '',
        button_text: 'Դիտել',
        color: 'text-amber-500',
        created_by: user?.name || '',
        institution: 'ՀՊՏՀ',
        image_url: undefined,
        description: '',
        lessons: [],
        requirements: [],
        outcomes: []
      });
      
      setIsAddDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ ավելացվել է');
    } catch (error) {
      console.error('Error in handleAddProfessionalCourse:', error);
      toast.error('Սխալ դասընթացի ավելացման ժամանակ');
    }
  };

  const handleEditProfessionalCourse = async () => {
    if (!selectedProfessionalCourse) return;
    
    if (!selectedProfessionalCourse.title || !selectedProfessionalCourse.duration || !selectedProfessionalCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      // Prepare the icon name
      const iconName = selectedProfessionalCourse.icon_name || 
                      getIconNameFromElement(selectedProfessionalCourse.icon as React.ReactElement);

      // Update the course in the database
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: selectedProfessionalCourse.title,
          subtitle: selectedProfessionalCourse.subtitle,
          icon_name: iconName,
          duration: selectedProfessionalCourse.duration,
          price: selectedProfessionalCourse.price,
          button_text: selectedProfessionalCourse.button_text,
          color: selectedProfessionalCourse.color,
          created_by: selectedProfessionalCourse.created_by,
          institution: selectedProfessionalCourse.institution,
          image_url: selectedProfessionalCourse.image_url,
          description: selectedProfessionalCourse.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProfessionalCourse.id);

      if (courseError) {
        console.error('Error updating course:', courseError);
        toast.error('Սխալ դասընթացի թարմացման ժամանակ');
        return;
      }

      // Handle lessons
      if (selectedProfessionalCourse.lessons) {
        // Delete existing lessons
        await supabase
          .from('course_lessons')
          .delete()
          .eq('course_id', selectedProfessionalCourse.id);
        
        // Add updated lessons
        if (selectedProfessionalCourse.lessons.length > 0) {
          const lessonsToAdd = selectedProfessionalCourse.lessons.map(lesson => ({
            course_id: selectedProfessionalCourse.id,
            title: lesson.title,
            duration: lesson.duration
          }));

          const { error: lessonsError } = await supabase
            .from('course_lessons')
            .insert(lessonsToAdd);

          if (lessonsError) {
            console.error('Error updating lessons:', lessonsError);
          }
        }
      }

      // Handle requirements
      if (selectedProfessionalCourse.requirements) {
        // Delete existing requirements
        await supabase
          .from('course_requirements')
          .delete()
          .eq('course_id', selectedProfessionalCourse.id);
        
        // Add updated requirements
        if (selectedProfessionalCourse.requirements.length > 0) {
          const requirementsToAdd = selectedProfessionalCourse.requirements.map(req => ({
            course_id: selectedProfessionalCourse.id,
            requirement: req
          }));

          const { error: requirementsError } = await supabase
            .from('course_requirements')
            .insert(requirementsToAdd);

          if (requirementsError) {
            console.error('Error updating requirements:', requirementsError);
          }
        }
      }

      // Handle outcomes
      if (selectedProfessionalCourse.outcomes) {
        // Delete existing outcomes
        await supabase
          .from('course_outcomes')
          .delete()
          .eq('course_id', selectedProfessionalCourse.id);
        
        // Add updated outcomes
        if (selectedProfessionalCourse.outcomes.length > 0) {
          const outcomesToAdd = selectedProfessionalCourse.outcomes.map(outcome => ({
            course_id: selectedProfessionalCourse.id,
            outcome: outcome
          }));

          const { error: outcomesError } = await supabase
            .from('course_outcomes')
            .insert(outcomesToAdd);

          if (outcomesError) {
            console.error('Error updating outcomes:', outcomesError);
          }
        }
      }

      // Refresh the courses list
      await fetchProfessionalCourses();
      
      setIsEditDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } catch (error) {
      console.error('Error in handleEditProfessionalCourse:', error);
      toast.error('Սխալ դասընթացի թարմացման ժամանակ');
    }
  };

  const handleEditProfessionalCourseInit = (course: ProfessionalCourse) => {
    setSelectedProfessionalCourse({...course});
    setIsEditDialogOpen(true);
  };

  const handleDeleteProfessionalCourse = async (id: string) => {
    // Only allow admins to delete courses
    if (user?.role !== 'admin') {
      toast.error('Դուք չունեք իրավունք ջնջելու այս դասընթացը');
      return;
    }

    try {
      // Delete the course (cascade will delete related records)
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Սխալ դասընթացի ջնջման ժամանակ');
        return;
      }

      // Refresh the courses list
      await fetchProfessionalCourses();
      
      toast.success('Դասընթացը հաջողությամբ հեռացվել է');
    } catch (error) {
      console.error('Error in handleDeleteProfessionalCourse:', error);
      toast.error('Սխալ դասընթացի ջնջման ժամանակ');
    }
  };

  // Migrate courses from localStorage to Supabase
  const migrateProfessionalCourses = async () => {
    try {
      // Get courses from localStorage
      const storedCourses = localStorage.getItem('professionalCourses');
      if (!storedCourses) return;
      
      const localCourses: ProfessionalCourse[] = JSON.parse(storedCourses);
      if (!localCourses.length) return;
      
      // Migrate each course
      for (const course of localCourses) {
        // Prepare the icon name
        const iconName = getIconNameFromElement(course.icon as React.ReactElement);
        
        // Insert course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .insert({
            title: course.title,
            subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
            icon_name: iconName,
            duration: course.duration,
            price: course.price,
            button_text: course.buttonText || 'Դիտել',
            color: course.color || 'text-amber-500',
            created_by: course.createdBy || 'Unknown',
            institution: course.institution || 'ՀՊՏՀ',
            image_url: course.imageUrl,
            description: course.description,
            is_persistent: true
          })
          .select();
        
        if (courseError) {
          console.error('Error migrating course:', courseError);
          continue;
        }
        
        const newCourseId = courseData[0].id;
        
        // Migrate lessons
        if (course.lessons && course.lessons.length > 0) {
          const lessonsToAdd = course.lessons.map(lesson => ({
            course_id: newCourseId,
            title: lesson.title,
            duration: lesson.duration
          }));
          
          const { error: lessonsError } = await supabase
            .from('course_lessons')
            .insert(lessonsToAdd);
          
          if (lessonsError) {
            console.error('Error migrating lessons:', lessonsError);
          }
        }
        
        // Migrate requirements
        if (course.requirements && course.requirements.length > 0) {
          const requirementsToAdd = course.requirements.map(req => ({
            course_id: newCourseId,
            requirement: req
          }));
          
          const { error: requirementsError } = await supabase
            .from('course_requirements')
            .insert(requirementsToAdd);
          
          if (requirementsError) {
            console.error('Error migrating requirements:', requirementsError);
          }
        }
        
        // Migrate outcomes
        if (course.outcomes && course.outcomes.length > 0) {
          const outcomesToAdd = course.outcomes.map(outcome => ({
            course_id: newCourseId,
            outcome: outcome
          }));
          
          const { error: outcomesError } = await supabase
            .from('course_outcomes')
            .insert(outcomesToAdd);
          
          if (outcomesError) {
            console.error('Error migrating outcomes:', outcomesError);
          }
        }
      }
      
      // Clear localStorage after migration
      localStorage.removeItem('professionalCourses');
      
      // Refresh courses
      await fetchProfessionalCourses();
      
      toast.success('Դասընթացները հաջողությամբ տեղափոխվել են տվյալների բազա');
    } catch (error) {
      console.error('Error migrating courses:', error);
      toast.error('Սխալ դասընթացների տեղափոխման ժամանակ');
    }
  };

  // Run migration on first load
  useEffect(() => {
    if (!loading && professionalCourses.length === 0) {
      migrateProfessionalCourses();
    }
  }, [loading, professionalCourses]);

  return {
    courses,
    userCourses,
    professionalCourses,
    userProfessionalCourses,
    selectedCourse,
    selectedProfessionalCourse,
    loading,
    setSelectedCourse,
    setSelectedProfessionalCourse,
    isAddDialogOpen,
    isEditDialogOpen,
    newCourse,
    newProfessionalCourse,
    newModule,
    setNewCourse,
    setNewProfessionalCourse,
    setNewModule,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
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
    fetchProfessionalCourses
  };
};
