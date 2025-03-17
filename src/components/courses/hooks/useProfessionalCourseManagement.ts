
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { Code } from 'lucide-react';
import React from 'react';
import { fetchAllCourses } from '../utils/courseUtils';
import { supabase } from '@/integrations/supabase/client';
import { getIconNameFromComponent } from '../utils/courseIconUtils';

export const useProfessionalCourseManagement = () => {
  // State for professional courses
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [userProfessionalCourses, setUserProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [selectedProfessionalCourse, setSelectedProfessionalCourse] = useState<ProfessionalCourse | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProfessionalCourse, setNewProfessionalCourse] = useState<ProfessionalCourse>({
    id: '',
    title: '',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Code, { className: "w-16 h-16" }),
    duration: '',
    price: '',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: '',
    institution: '',
  });

  const { user } = useAuth();

  // Load professional courses from database
  useEffect(() => {
    const loadProfessionalCourses = async () => {
      try {
        const courses = await fetchAllCourses();
        setProfessionalCourses(courses);
        
        if (user) {
          const userCourses = courses.filter(
            (course) => course.createdBy === user.name
          );
          setUserProfessionalCourses(userCourses);
        }
      } catch (error) {
        console.error('Error loading professional courses:', error);
        
        // Fallback to localStorage
        const storedCourses = localStorage.getItem('professionalCourses');
        if (storedCourses) {
          const parsedCourses = JSON.parse(storedCourses);
          setProfessionalCourses(parsedCourses);
          
          if (user) {
            const userCourses = parsedCourses.filter(
              (course: ProfessionalCourse) => course.createdBy === user.name
            );
            setUserProfessionalCourses(userCourses);
          }
        }
      }
    };
    
    loadProfessionalCourses();
  }, [user]);
  
  // Set up real-time subscription for course changes
  useEffect(() => {
    const subscription = supabase
      .channel('courses-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        // Reload courses when changes occur
        fetchAllCourses().then(courses => {
          setProfessionalCourses(courses);
          
          if (user) {
            const userCourses = courses.filter(
              (course) => course.createdBy === user.name
            );
            setUserProfessionalCourses(userCourses);
          }
        });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);
  
  // Handlers for professional courses
  const handleEditProfessionalCourseInit = useCallback((course: ProfessionalCourse) => {
    setSelectedProfessionalCourse(course);
  }, []);

  const handleAddProfessionalCourse = useCallback(async () => {
    if (!user) return;

    try {
      const newId = uuidv4();
      const courseToAdd: ProfessionalCourse = {
        ...newProfessionalCourse,
        id: newId,
        createdBy: user.name,
      };
      
      // Save to Supabase
      const { data, error } = await supabase.from('courses').insert({
        id: newId,
        title: courseToAdd.title,
        subtitle: courseToAdd.subtitle,
        icon_name: getIconNameFromComponent(courseToAdd.icon),
        duration: courseToAdd.duration,
        price: courseToAdd.price,
        button_text: courseToAdd.buttonText,
        color: courseToAdd.color,
        created_by: courseToAdd.createdBy,
        institution: courseToAdd.institution,
        image_url: courseToAdd.imageUrl,
        description: courseToAdd.description
      }).select();
      
      if (error) {
        console.error('Error adding course to Supabase:', error);
        throw new Error(error.message);
      }

      // Add to local state (in case we're offline)
      const updatedCourses = [...professionalCourses, courseToAdd];
      setProfessionalCourses(updatedCourses);
      
      // Update user courses
      const updatedUserCourses = [...userProfessionalCourses, courseToAdd];
      setUserProfessionalCourses(updatedUserCourses);
      
      // Update localStorage
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
      // Reset the form
      setNewProfessionalCourse({
        id: '',
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        icon: React.createElement(Code, { className: "w-16 h-16" }),
        duration: '',
        price: '',
        buttonText: 'Դիտել',
        color: 'text-amber-500',
        createdBy: '',
        institution: '',
      });
      
      setIsAddDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ ավելացվել է');
    } catch (error) {
      console.error('Error adding professional course:', error);
      toast.error('Սխալ դասընթացի ավելացման ժամանակ');
    }
  }, [newProfessionalCourse, professionalCourses, userProfessionalCourses, user]);

  const handleEditProfessionalCourse = useCallback(async () => {
    if (!selectedProfessionalCourse) return;
    
    // Don't allow editing persistent courses
    if (selectedProfessionalCourse.isPersistent) {
      toast.error('Հիմնական դասընթացները չեն կարող խմբագրվել');
      return;
    }

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('courses')
        .update({
          title: selectedProfessionalCourse.title,
          subtitle: selectedProfessionalCourse.subtitle,
          icon_name: getIconNameFromComponent(selectedProfessionalCourse.icon),
          duration: selectedProfessionalCourse.duration,
          price: selectedProfessionalCourse.price,
          button_text: selectedProfessionalCourse.buttonText,
          color: selectedProfessionalCourse.color,
          institution: selectedProfessionalCourse.institution,
          image_url: selectedProfessionalCourse.imageUrl,
          description: selectedProfessionalCourse.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProfessionalCourse.id);
        
      if (error) {
        console.error('Error updating course in Supabase:', error);
        throw new Error(error.message);
      }

      // Update local state
      const updatedCourses = professionalCourses.map((course) =>
        course.id === selectedProfessionalCourse.id ? selectedProfessionalCourse : course
      );
      setProfessionalCourses(updatedCourses);
      
      // Update user courses
      const updatedUserCourses = userProfessionalCourses.map((course) =>
        course.id === selectedProfessionalCourse.id ? selectedProfessionalCourse : course
      );
      setUserProfessionalCourses(updatedUserCourses);
      
      // Update localStorage
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } catch (error) {
      console.error('Error editing professional course:', error);
      toast.error('Սխալ դասընթացի թարմացման ժամանակ');
    }
  }, [selectedProfessionalCourse, professionalCourses, userProfessionalCourses]);

  const handleDeleteProfessionalCourse = useCallback(async (id: string) => {
    try {
      // Check if it's a persistent course
      const courseToDelete = professionalCourses.find(course => course.id === id);
      if (courseToDelete?.isPersistent) {
        toast.error('Հիմնական դասընթացները չեն կարող ջնջվել');
        return;
      }
      
      // Delete from Supabase
      const { error } = await supabase.from('courses').delete().eq('id', id);
      
      if (error) {
        console.error('Error deleting course from Supabase:', error);
        throw new Error(error.message);
      }
      
      // Clean up related data
      await Promise.all([
        supabase.from('course_lessons').delete().eq('course_id', id),
        supabase.from('course_requirements').delete().eq('course_id', id),
        supabase.from('course_outcomes').delete().eq('course_id', id)
      ]);

      // Update local state
      const updatedCourses = professionalCourses.filter((course) => course.id !== id);
      setProfessionalCourses(updatedCourses);
      
      // Update user courses
      const updatedUserCourses = userProfessionalCourses.filter((course) => course.id !== id);
      setUserProfessionalCourses(updatedUserCourses);
      
      // Update localStorage
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    } catch (error) {
      console.error('Error deleting professional course:', error);
      toast.error('Սխալ դասընթացի ջնջման ժամանակ');
    }
  }, [professionalCourses, userProfessionalCourses]);

  return {
    professionalCourses,
    setProfessionalCourses,
    userProfessionalCourses,
    selectedProfessionalCourse,
    setSelectedProfessionalCourse,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newProfessionalCourse,
    setNewProfessionalCourse,
    handleEditProfessionalCourseInit,
    handleAddProfessionalCourse,
    handleEditProfessionalCourse,
    handleDeleteProfessionalCourse,
  };
};
