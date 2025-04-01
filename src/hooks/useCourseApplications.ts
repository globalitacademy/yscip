
import { useState, useEffect } from 'react';
import { CourseApplication } from '@/components/courses/types/CourseApplication';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useCourseApplications = () => {
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Temporary implementation using localStorage
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

      // Store in localStorage for now
      const existingApplications = JSON.parse(localStorage.getItem('course_applications') || '[]');
      existingApplications.push(newApplication);
      localStorage.setItem('course_applications', JSON.stringify(existingApplications));
      
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
      // Update in localStorage
      const storedApplications = JSON.parse(localStorage.getItem('course_applications') || '[]');
      const updatedApplications = storedApplications.map((app: CourseApplication) => 
        app.id === id ? { ...app, status } : app
      );
      
      localStorage.setItem('course_applications', JSON.stringify(updatedApplications));
      setApplications(updatedApplications);
      
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
