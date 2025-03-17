
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { getCourseById, saveCourseChanges } from '../utils/courseUtils';
import { useNavigate } from 'react-router-dom';

export const useCourseDetails = (id: string | undefined) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState<ProfessionalCourse | null>(null);
  const [newLesson, setNewLesson] = useState({ title: '', duration: '' });
  const [newRequirement, setNewRequirement] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const handleCourseUpdate = (event: CustomEvent<ProfessionalCourse>) => {
      const updatedCourse = event.detail;
      if (updatedCourse && updatedCourse.id === id) {
        setCourse(updatedCourse);
        setEditedCourse(updatedCourse);
      }
    };

    window.addEventListener('courseUpdated', handleCourseUpdate as EventListener);
    
    return () => {
      window.removeEventListener('courseUpdated', handleCourseUpdate as EventListener);
    };
  }, [id]);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      if (id) {
        try {
          const courseData = await getCourseById(id);
          
          if (!courseData) {
            const sampleCourse: ProfessionalCourse = {
              id: id,
              title: "Web Development Fundamentals",
              subtitle: "ԴԱՍԸՆԹԱՑ",
              icon: React.createElement(Book, { className: "w-16 h-16" }),
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
            
            saveToLocalStorage(sampleCourse);
            
            setCourse(sampleCourse);
            setEditedCourse(sampleCourse);
          } else {
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
      if (!editedCourse) return;
      
      const success = await saveCourseChanges(editedCourse);
      if (success) {
        setCourse(editedCourse);
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } else {
      setEditedCourse(course);
    }
    
    setIsEditing(!isEditing);
  };

  const cancelEditing = () => {
    setEditedCourse(course);
    setIsEditing(false);
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

  return {
    course,
    setCourse,
    loading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isEditing,
    editedCourse,
    setEditedCourse,
    newLesson,
    setNewLesson,
    newRequirement,
    setNewRequirement,
    newOutcome,
    setNewOutcome,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleApply,
    handleEditCourse,
    toggleEditMode,
    cancelEditing,
    handleAddLesson,
    handleRemoveLesson,
    handleAddRequirement,
    handleRemoveRequirement,
    handleAddOutcome,
    handleRemoveOutcome
  };
};

const saveToLocalStorage = (course: ProfessionalCourse): void => {
  try {
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
  }
};

// Need to import the Book icon which is used in the sample course
import { Book } from 'lucide-react';
import React from 'react';
