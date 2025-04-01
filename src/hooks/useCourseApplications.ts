
import { useState, useEffect } from 'react';
import { CourseApplication } from '@/components/courses/types/CourseApplication';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export const useCourseApplications = () => {
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // First try to get from Supabase if connected
      try {
        const { data, error } = await supabase
          .from('course_applications')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setApplications(data as CourseApplication[]);
          return;
        }
      } catch (dbError) {
        console.error('Database error, falling back to localStorage:', dbError);
      }
      
      // Fallback to localStorage if Supabase is not available
      const storedApplications = localStorage.getItem('course_applications');
      if (storedApplications) {
        setApplications(JSON.parse(storedApplications));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Չհաջողվեց բեռնել դիմումների տվյալները');
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async (applicationData: Omit<CourseApplication, 'id' | 'created_at' | 'status'>) => {
    try {
      // Create a new application object
      const newApplication: CourseApplication = {
        ...applicationData,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        status: 'new'
      };

      // Try to store in Supabase if connected
      try {
        const { error } = await supabase
          .from('course_applications')
          .insert(newApplication);
          
        if (error) throw error;
        
        // Send notification email via edge function
        try {
          const { error: emailError } = await supabase.functions.invoke('notify-course-application', {
            body: {
              application: newApplication
            }
          });
          
          if (emailError) {
            console.error('Failed to send notification email:', emailError);
          }
        } catch (emailError) {
          console.error('Error invoking email function:', emailError);
        }
      } catch (dbError) {
        console.error('Database error, falling back to localStorage:', dbError);
        
        // Fallback to localStorage
        const existingApplications = JSON.parse(localStorage.getItem('course_applications') || '[]');
        existingApplications.push(newApplication);
        localStorage.setItem('course_applications', JSON.stringify(existingApplications));
      }
      
      toast.success('Դիմումն ուղարկված է', {
        description: 'Շուտով կապ կհաստատենք ձեզ հետ'
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Սխալ տեղի ունեցավ դիմում ուղարկելիս');
      return false;
    }
  };

  const updateApplicationStatus = async (id: string, status: 'contacted' | 'enrolled' | 'rejected') => {
    try {
      // Try to update in Supabase if connected
      try {
        const { error } = await supabase
          .from('course_applications')
          .update({ status })
          .eq('id', id);
          
        if (error) throw error;
      } catch (dbError) {
        console.error('Database error, falling back to localStorage:', dbError);
        
        // Fallback to localStorage
        const storedApplications = JSON.parse(localStorage.getItem('course_applications') || '[]');
        const updatedApplications = storedApplications.map((app: CourseApplication) => 
          app.id === id ? { ...app, status } : app
        );
        
        localStorage.setItem('course_applications', JSON.stringify(updatedApplications));
      }
      
      // Update local state
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
      
      toast.success('Կարգավիճակը թարմացված է');
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Սխալ տեղի ունեցավ կարգավիճակը թարմացնելիս');
      return false;
    }
  };
  
  // Load applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);
  
  return {
    applications,
    loading,
    fetchApplications,
    submitApplication,
    updateApplicationStatus
  };
};
