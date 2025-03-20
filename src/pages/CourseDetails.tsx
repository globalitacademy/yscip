
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import EditProfessionalCourseDialog from '@/components/courses/EditProfessionalCourseDialog';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseById, saveCourseChanges } from '@/components/courses/utils/courseUtils';
import CourseHeader from '@/components/courses/details/CourseHeader';
import CourseBanner from '@/components/courses/details/CourseBanner';
import CourseCurriculum from '@/components/courses/details/CourseCurriculum';
import CourseLearningOutcomes from '@/components/courses/details/CourseLearningOutcomes';
import CourseRequirements from '@/components/courses/details/CourseRequirements';
import CourseSidebar from '@/components/courses/details/CourseSidebar';
import { Book, BookText, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState<ProfessionalCourse | null>(null);
  const [newLesson, setNewLesson] = useState({ title: '', duration: '' });
  const [newRequirement, setNewRequirement] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const { user } = useAuth();

  // Listen for course updates from other components
  useEffect(() => {
    const handleCourseUpdate = (event: CustomEvent<ProfessionalCourse>) => {
      const updatedCourse = event.detail;
      if (updatedCourse && updatedCourse.id === id) {
        console.log("Course updated event received:", updatedCourse);
        setCourse(updatedCourse);
        setEditedCourse(updatedCourse);
      }
    };

    window.addEventListener('courseUpdated', handleCourseUpdate as EventListener);
    
    return () => {
      window.removeEventListener('courseUpdated', handleCourseUpdate as EventListener);
    };
  }, [id]);

  // Function to convert iconName to React element
  const getIconElement = (iconName: string) => {
    console.log("Converting iconName to element:", iconName);
    switch (iconName?.toLowerCase()) {
      case 'book':
        return <BookText className="w-16 h-16" />;
      case 'code':
        return <Code className="w-16 h-16" />;
      case 'ai':
      case 'braincircuit':
      case 'brain':
        return <BrainCircuit className="w-16 h-16" />;
      case 'database':
        return <Database className="w-16 h-16" />;
      case 'files':
      case 'filecode':
      case 'file':
        return <FileCode className="w-16 h-16" />;
      case 'web':
      case 'globe':
        return <Globe className="w-16 h-16" />;
      default:
        console.log("Unknown icon name:", iconName);
        return <Book className="w-16 h-16" />;
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      if (id) {
        try {
          console.log("Attempting to fetch course with ID:", id);
          const courseData = await getCourseById(id);
          
          // Try to create a sample course in localStorage if none found
          if (!courseData) {
            console.log("No course found, creating sample course");
            // Create a sample course for testing if we can't fetch one
            const sampleCourse: ProfessionalCourse = {
              id: id,
              title: "Web Development Fundamentals",
              subtitle: "ԴԱՍԸՆԹԱՑ",
              icon: React.createElement(Book, { className: "w-16 h-16" }),
              iconName: "book", // Adding iconName property
              duration: "8 շաբաթ",
              price: "65,000 ֏",
              buttonText: "Դիմել",
              color: "text-blue-500",
              createdBy: "John Smith",
              institution: "Web Academy",
              imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
              description: "Learn the fundamentals of web development including HTML, CSS and JavaScript.",
              lessons: [
                { title: "HTML Basics", duration: "2 ժամ" },
                { title: "CSS Styling", duration: "2 ժամ" },
                { title: "JavaScript Introduction", duration: "3 ժամ" }
              ],
              requirements: [
                "Basic computer skills",
                "No prior programming experience required"
              ],
              outcomes: [
                "Build simple websites with HTML and CSS",
                "Add interactivity with JavaScript",
                "Understand web development principles"
              ]
            };
            
            // Save to localStorage
            saveToLocalStorage(sampleCourse);
            
            setCourse(sampleCourse);
            setEditedCourse(sampleCourse);
          } else {
            console.log("Course loaded successfully:", courseData);
            
            // Ensure icon element is properly set based on iconName
            if (courseData.iconName && (!courseData.icon || typeof courseData.icon === 'string')) {
              courseData.icon = getIconElement(courseData.iconName);
            }
            
            setCourse(courseData);
            setEditedCourse(courseData);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          toast.error("Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել");
        }
      }
      setLoading(false);
    };
    
    fetchCourse();
  }, [id]);

  const handleApply = () => {
    toast.success("Դիմումը հաջողությամբ ուղարկված է", {
      description: "Մենք կապ կհաստատենք ձեզ հետ",
      duration: 5000,
    });
  };

  const handleEditCourse = () => {
    if (!course) return;

    // Update the course in Supabase and localStorage
    try {
      saveCourseChanges(course).then(success => {
        if (success) {
          toast.success('Դասընթացը հաջողությամբ թարմացվել է');
          setIsEditDialogOpen(false);
        } else {
          toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
        }
      });
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // Save changes
      if (!editedCourse) return;
      
      console.log("Saving changes to course:", editedCourse);
      
      // Ensure iconName is correctly set
      if (!editedCourse.iconName && editedCourse.icon) {
        // Try to determine iconName from icon
        // This is a fallback and might not be accurate
        // Fix the error by safely accessing the type property
        const iconComponent = editedCourse.icon.type;
        let iconString = '';
        
        // Check if iconComponent exists and has a name or displayName property
        if (iconComponent && typeof iconComponent !== 'string') {
          iconString = (iconComponent as any).displayName || (iconComponent as any).name || '';
        }
        
        if (iconString.includes('Book')) editedCourse.iconName = 'book';
        else if (iconString.includes('Code')) editedCourse.iconName = 'code';
        else if (iconString.includes('Brain')) editedCourse.iconName = 'ai';
        else if (iconString.includes('Database')) editedCourse.iconName = 'database';
        else if (iconString.includes('File')) editedCourse.iconName = 'files';
        else if (iconString.includes('Globe')) editedCourse.iconName = 'web';
        else editedCourse.iconName = 'book'; // Default
        
        console.log("Determined iconName from icon:", editedCourse.iconName);
      }
      
      // Պահպանում ենք փոփոխությունները
      const success = await saveCourseChanges(editedCourse);
      if (success) {
        setCourse(editedCourse);
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
      } else {
        // Եթե պահպանումը չի հաջողվել, ապա վերականգնում ենք նախկին արժեքները
        setEditedCourse(course);
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } else {
      // Enter edit mode
      console.log("Entering edit mode with course:", course);
      
      if (course) {
        // Ensure we always have the latest icon element
        const editCopy = { ...course };
        if (editCopy.iconName) {
          editCopy.icon = getIconElement(editCopy.iconName);
        }
        
        // Deep clone to avoid reference issues
        setEditedCourse(JSON.parse(JSON.stringify(editCopy)));
      }
    }
    
    setIsEditing(!isEditing);
  };

  const cancelEditing = () => {
    // Երբ չեղարկում ենք, ապա վերադարձնում ենք նախկին արժեքները
    setEditedCourse(course);
    setIsEditing(false);
    toast.info('Փոփոխությունները չեղարկվեցին');
  };

  const handleAddLesson = () => {
    if (!editedCourse || !newLesson.title || !newLesson.duration) return;
    
    const updatedLessons = [...(editedCourse.lessons || []), newLesson];
    setEditedCourse({
      ...editedCourse,
      lessons: updatedLessons
    });
    setNewLesson({ title: '', duration: '' });
  };

  const handleRemoveLesson = (index: number) => {
    if (!editedCourse) return;
    
    const updatedLessons = [...(editedCourse.lessons || [])];
    updatedLessons.splice(index, 1);
    setEditedCourse({
      ...editedCourse,
      lessons: updatedLessons
    });
  };

  const handleAddRequirement = () => {
    if (!editedCourse || !newRequirement) return;
    
    const updatedRequirements = [...(editedCourse.requirements || []), newRequirement];
    setEditedCourse({
      ...editedCourse,
      requirements: updatedRequirements
    });
    setNewRequirement('');
  };

  const handleRemoveRequirement = (index: number) => {
    if (!editedCourse) return;
    
    const updatedRequirements = [...(editedCourse.requirements || [])];
    updatedRequirements.splice(index, 1);
    setEditedCourse({
      ...editedCourse,
      requirements: updatedRequirements
    });
  };

  const handleAddOutcome = () => {
    if (!editedCourse || !newOutcome) return;
    
    const updatedOutcomes = [...(editedCourse.outcomes || []), newOutcome];
    setEditedCourse({
      ...editedCourse,
      outcomes: updatedOutcomes
    });
    setNewOutcome('');
  };

  const handleRemoveOutcome = (index: number) => {
    if (!editedCourse) return;
    
    const updatedOutcomes = [...(editedCourse.outcomes || [])];
    updatedOutcomes.splice(index, 1);
    setEditedCourse({
      ...editedCourse,
      outcomes: updatedOutcomes
    });
  };

  // Check if user can edit this course
  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Բեռնում...</div>;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h2>
            <Link to="/" className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded">
              Վերադառնալ գլխավոր էջ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayCourse = isEditing ? editedCourse : course;
  if (!displayCourse) return null;

  // Ensure icon is present based on iconName
  if (displayCourse.iconName && (!displayCourse.icon || typeof displayCourse.icon === 'string')) {
    displayCourse.icon = getIconElement(displayCourse.iconName);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <CourseHeader 
            canEdit={canEdit} 
            isEditing={isEditing} 
            toggleEditMode={toggleEditMode} 
            cancelEditing={cancelEditing} 
          />
          
          <CourseBanner 
            displayCourse={displayCourse} 
            isEditing={isEditing} 
            editedCourse={editedCourse} 
            setEditedCourse={setEditedCourse} 
            handleApply={handleApply} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <CourseCurriculum 
                displayCourse={displayCourse} 
                isEditing={isEditing} 
                newLesson={newLesson} 
                setNewLesson={setNewLesson} 
                handleAddLesson={handleAddLesson} 
                handleRemoveLesson={handleRemoveLesson} 
              />
              
              <CourseLearningOutcomes 
                displayCourse={displayCourse} 
                isEditing={isEditing} 
                newOutcome={newOutcome} 
                setNewOutcome={setNewOutcome} 
                handleAddOutcome={handleAddOutcome} 
                handleRemoveOutcome={handleRemoveOutcome} 
              />
              
              <CourseRequirements 
                displayCourse={displayCourse} 
                isEditing={isEditing} 
                newRequirement={newRequirement} 
                setNewRequirement={setNewRequirement} 
                handleAddRequirement={handleAddRequirement} 
                handleRemoveRequirement={handleRemoveRequirement} 
              />
            </div>
            
            <div>
              <CourseSidebar 
                displayCourse={displayCourse} 
                isEditing={isEditing} 
                editedCourse={editedCourse} 
                setEditedCourse={setEditedCourse} 
                handleApply={handleApply} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {course && (
        <EditProfessionalCourseDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          selectedCourse={course}
          setSelectedCourse={setCourse}
          handleEditCourse={handleEditCourse}
        />
      )}
    </div>
  );
};

// Helper function to add the missing saveToLocalStorage function
const saveToLocalStorage = (course: ProfessionalCourse): void => {
  try {
    // Թարմացնում ենք կամ ավելացնում ենք կուրսը localStorage-ում
    console.log("Saving course to localStorage:", course);
    
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const existingCourseIndex = courses.findIndex(c => c.id === course.id);
      
      if (existingCourseIndex !== -1) {
        courses[existingCourseIndex] = course;
      } else {
        courses.push(course);
      }
      
      localStorage.setItem('professionalCourses', JSON.stringify(courses));
    } else {
      localStorage.setItem('professionalCourses', JSON.stringify([course]));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    toast.error('Տեղային պահեստում պահպանման սխալ։');
  }
};

export default CourseDetails;
