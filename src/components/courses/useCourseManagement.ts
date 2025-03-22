import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe, Book } from 'lucide-react';
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveCourseChanges } from './utils/courseUtils';

// Mock professional courses data
const mockProfessionalCourses: ProfessionalCourse[] = [
  {
    id: '1',
    title: 'WEB Front-End',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Code, { className: "w-16 h-16" }),
    duration: '9 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: 'Արամ Հակոբյան',
    institution: 'ՀՊՏՀ',
    description: 'Սովորեք Web կայքերի մշակում՝ օգտագործելով արդի տեխնոլոգիաներ ինչպիսիք են HTML5, CSS3, JavaScript, React և Node.js։ Այս դասընթացը նախատեսված է սկսնակների համար և կօգնի ձեզ դառնալ պրոֆեսիոնալ Front-End ծրագրավորող։',
    lessons: [
      { title: 'Ներածություն Web ծրագրավորման մեջ', duration: '3 ժամ' },
      { title: 'HTML5 հիմունքներ', duration: '6 ժամ' },
      { title: 'CSS3 և ձևավորում', duration: '8 ժամ' },
      { title: 'JavaScript հիմունքներ', duration: '12 ժամ' }
    ],
    requirements: [
      'Համակարգչային հիմնական գիտելիքներ',
      'Տրամաբանական մտածելակերպ'
    ],
    outcomes: [
      'Մշակել ամբողջական ինտերակտիվ վեբ կայքեր',
      'Աշխատել React-ով միաէջանի հավելվածների հետ'
    ]
  },
  {
    id: '2',
    title: 'Python (ML / AI)',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(BrainCircuit, { className: "w-16 h-16" }),
    duration: '7 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-blue-500',
    createdBy: 'Լիլիթ Մարտիրոսյան',
    institution: 'ԵՊՀ',
    description: 'Սովորեք Python ծրագրավորում՝ մեքենայական ուսուցման և արհեստական բանականության հիմունքներով։ Այս ինտենսիվ դասընթացը կօգնի ձեզ ծանոթանալ AI/ML ժամանակակից գործիքների հետ։',
    lessons: [
      { title: 'Python հիմունքներ', duration: '10 ժամ' },
      { title: 'Տվյալների վերլուծություն NumPy-ով և Pandas-ով', duration: '12 ժամ' },
      { title: 'Մեքենայական ուսուցման ներածություն', duration: '6 ժամ' }
    ],
    requirements: [
      'Ծրագրավորման բազային իմացություն',
      'Մաթեմատիկայի և վիճակագրության հիմունքներ'
    ],
    outcomes: [
      'Մշակել մեքենայական ուսուցման մոդելներ',
      'Վերլուծել և վիզուալիզացնել մեծ տվյալներ'
    ]
  },
  {
    id: '3',
    title: 'Java',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(BookText, { className: "w-16 h-16" }),
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-red-500',
    createdBy: 'Գարիկ Սարգսյան',
    institution: 'ՀԱՊՀ'
  },
  {
    id: '4',
    title: 'JavaScript',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(FileCode, { className: "w-16 h-16" }),
    duration: '3.5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-yellow-500',
    createdBy: 'Անի Մուրադյան',
    institution: 'ՀԱՀ'
  },
  {
    id: '5',
    title: 'PHP',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Database, { className: "w-16 h-16" }),
    duration: '5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-purple-500',
    createdBy: 'Վահե Ղազարյան',
    institution: 'ՀՊՄՀ'
  },
  {
    id: '6',
    title: 'C#/.NET',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Globe, { className: "w-16 h-16" }),
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-green-500',
    createdBy: 'Տիգրան Դավթյան',
    institution: 'ՀՌԱՀ'
  }
];

export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

// Initialize professional courses with mock data if localStorage is empty
const initializeProfessionalCourses = (): ProfessionalCourse[] => {
  const storedCourses = localStorage.getItem('professionalCourses');
  if (storedCourses) {
    try {
      return JSON.parse(storedCourses);
    } catch (e) {
      console.error('Error parsing stored professional courses:', e);
    }
  }
  return mockProfessionalCourses;
};

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

export const useCourseManagement = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(initializeCourses());
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>(initializeProfessionalCourses());
  
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

  // Function to load courses from database
  const loadCoursesFromDatabase = useCallback(async () => {
    try {
      // Fetch courses from Supabase
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
      
      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        return;
      }
      
      if (!coursesData || coursesData.length === 0) {
        // If no courses in database, initialize with local data
        const storedCourses = localStorage.getItem('professionalCourses');
        if (storedCourses) {
          const parsedCourses: ProfessionalCourse[] = JSON.parse(storedCourses);
          // Save local courses to database
          for (const course of parsedCourses) {
            await saveCourseChanges(course);
          }
        }
        return;
      }
      
      // Process each course to add related data
      const completeCourses = await Promise.all(coursesData.map(async (course) => {
        // Fetch lessons
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', course.id);
        
        // Fetch requirements
        const { data: requirementsData } = await supabase
          .from('course_requirements')
          .select('*')
          .eq('course_id', course.id);
        
        // Fetch outcomes
        const { data: outcomesData } = await supabase
          .from('course_outcomes')
          .select('*')
          .eq('course_id', course.id);
        
        // Create icon based on icon_name
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
        
        // Format the course with all data
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
          lessons: lessonsData?.map(lesson => ({
            title: lesson.title, 
            duration: lesson.duration
          })) || [],
          requirements: requirementsData?.map(req => req.requirement) || [],
          outcomes: outcomesData?.map(outcome => outcome.outcome) || []
        } as ProfessionalCourse;
      }));
      
      // Update state with courses from database
      setProfessionalCourses(completeCourses);
      
      // Update localStorage for offline access
      localStorage.setItem('professionalCourses', JSON.stringify(completeCourses));
      
    } catch (error) {
      console.error('Error loading courses from database:', error);
      toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
    }
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

  const handleAddProfessionalCourse = async () => {
    if (!newProfessionalCourse.title || !newProfessionalCourse.duration || !newProfessionalCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const courseToAdd: ProfessionalCourse = {
      ...(newProfessionalCourse as ProfessionalCourse),
      id: uuidv4(),
      createdBy: user?.name || 'Unknown',
      buttonText: newProfessionalCourse.buttonText || 'Դիտել',
      subtitle: newProfessionalCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
      color: newProfessionalCourse.color || 'text-amber-500',
      institution: newProfessionalCourse.institution || 'ՀՊՏՀ',
      iconName: 'book' // Default icon name
    };

    // Save to database
    const success = await saveCourseChanges(courseToAdd);
    
    if (success) {
      // Update local state
      const updatedCourses = [...professionalCourses, courseToAdd];
      setProfessionalCourses(updatedCourses);
      
      // Update localStorage for offline access
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
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
    } else {
      toast.error('Դասընթացի ավելացման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const handleEditProfessionalCourse = async () => {
    if (!selectedProfessionalCourse) return;
    
    if (!selectedProfessionalCourse.title || !selectedProfessionalCourse.duration || !selectedProfessionalCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    // Save to database
    const success = await saveCourseChanges(selectedProfessionalCourse);
    
    if (success) {
      // Update local state
      const updatedCourses = professionalCourses.map(course => 
        course.id === selectedProfessionalCourse.id ? selectedProfessionalCourse : course
      );
      
      setProfessionalCourses(updatedCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      setIsEditDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } else {
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const handleDeleteProfessionalCourse = (id: string) => {
    const courseToDelete = professionalCourses.find(course => course.id === id);
    
    // Only allow admins to delete courses
    if (courseToDelete && user?.role === 'admin') {
      const updatedCourses = professionalCourses.filter(course => course.id !== id);
      setProfessionalCourses(updatedCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      toast.success('Դասընթացը հաջողությամբ հեռացվել է');
    } else {
      toast.error('Դուք չունեք իրավունք ջնջելու այս դասընթացը');
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
    loadCoursesFromDatabase
  };
};
