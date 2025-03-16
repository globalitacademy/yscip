import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

// Mock specializations data
export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

// Old mock data kept for reference
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

// Helper function to map icon name to React component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Code':
      return React.createElement(Code, { className: "w-16 h-16" });
    case 'BookText':
      return React.createElement(BookText, { className: "w-16 h-16" });
    case 'BrainCircuit':
      return React.createElement(BrainCircuit, { className: "w-16 h-16" });
    case 'Database':
      return React.createElement(Database, { className: "w-16 h-16" });
    case 'FileCode':
      return React.createElement(FileCode, { className: "w-16 h-16" });
    case 'Globe':
      return React.createElement(Globe, { className: "w-16 h-16" });
    default:
      return React.createElement(Code, { className: "w-16 h-16" });
  }
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
    outcomes: []
  });
  
  const [newModule, setNewModule] = useState('');

  // Fetch professional courses from Supabase
  useEffect(() => {
    const fetchProfessionalCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedCourses: ProfessionalCourse[] = data.map(course => ({
            id: course.id,
            title: course.title,
            subtitle: course.subtitle,
            icon: getIconComponent(course.icon_name),
            duration: course.duration,
            price: course.price,
            buttonText: course.button_text,
            color: course.color,
            createdBy: course.created_by || 'Unknown',
            institution: course.institution || 'Unknown',
            description: course.description,
            lessons: [], // These would need to be stored in a separate table or as JSON
            requirements: [],
            outcomes: []
          }));
          
          setProfessionalCourses(formattedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Դասընթացները հնարավոր չէ բեռնել');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessionalCourses();
  }, []);

  // Get user's courses
  const userCourses = courses.filter(course => course.createdBy === user?.id);
  
  // Get user's professional courses
  const userProfessionalCourses = professionalCourses.filter(course => course.createdBy === user?.name);

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

  // Professional Courses Functions using Supabase
  const handleAddProfessionalCourse = async () => {
    if (!newProfessionalCourse.title || !newProfessionalCourse.duration || !newProfessionalCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      // Extract icon name for storage
      const iconName = 
        newProfessionalCourse.icon?.type?.name || 
        newProfessionalCourse.icon?.type || 
        'Code';

      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: newProfessionalCourse.title,
          subtitle: newProfessionalCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
          duration: newProfessionalCourse.duration,
          price: newProfessionalCourse.price,
          color: newProfessionalCourse.color || 'text-amber-500',
          institution: newProfessionalCourse.institution || 'ՀՊՏՀ',
          created_by: user?.name || 'Unknown',
          button_text: newProfessionalCourse.buttonText || 'Դիտել',
          icon_name: iconName,
          description: newProfessionalCourse.description
        })
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Convert the returned data to ProfessionalCourse format
        const newCourse: ProfessionalCourse = {
          id: data[0].id,
          title: data[0].title,
          subtitle: data[0].subtitle,
          icon: getIconComponent(data[0].icon_name),
          duration: data[0].duration,
          price: data[0].price,
          buttonText: data[0].button_text,
          color: data[0].color,
          createdBy: data[0].created_by || 'Unknown',
          institution: data[0].institution || 'Unknown',
          description: data[0].description,
          lessons: [],
          requirements: [],
          outcomes: []
        };

        setProfessionalCourses(prev => [...prev, newCourse]);
        
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
          outcomes: []
        });
        setIsAddDialogOpen(false);
        toast.success('Դասընթացը հաջողությամբ ավելացվել է');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Դասընթացը հնարավոր չէ ավելացնել');
    }
  };

  const handleEditProfessionalCourse = async () => {
    if (!selectedProfessionalCourse) return;
    
    if (!selectedProfessionalCourse.title || !selectedProfessionalCourse.duration || !selectedProfessionalCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      // Extract icon name for storage
      const iconName = 
        selectedProfessionalCourse.icon?.type?.name || 
        selectedProfessionalCourse.icon?.type || 
        'Code';

      const { error } = await supabase
        .from('courses')
        .update({
          title: selectedProfessionalCourse.title,
          subtitle: selectedProfessionalCourse.subtitle,
          duration: selectedProfessionalCourse.duration,
          price: selectedProfessionalCourse.price,
          color: selectedProfessionalCourse.color,
          institution: selectedProfessionalCourse.institution,
          button_text: selectedProfessionalCourse.buttonText,
          icon_name: iconName,
          description: selectedProfessionalCourse.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProfessionalCourse.id);

      if (error) throw error;

      // Update local state
      setProfessionalCourses(prev => 
        prev.map(course => 
          course.id === selectedProfessionalCourse.id ? selectedProfessionalCourse : course
        )
      );
      
      setIsEditDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Դասընթացը հնարավոր չէ թարմացնել');
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
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setProfessionalCourses(prev => prev.filter(course => course.id !== id));
      toast.success('Դասընթացը հաջողությամբ հեռացվել է');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Դասընթացը հնարավոր չէ հեռացնել');
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
    newCourse,
    newProfessionalCourse,
    newModule,
    loading,
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
    handleDeleteProfessionalCourse
  };
};
