
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CourseEnrollmentProps {
  courseId: string;
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = ({ courseId }) => {
  const { user } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Check if user is already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking enrollment:', error);
          return;
        }
        
        setIsEnrolled(!!data);
      } catch (err) {
        console.error('Error checking enrollment status:', err);
      }
    };
    
    checkEnrollment();
  }, [courseId, user]);
  
  const handleEnrollment = async () => {
    if (!user) {
      toast.error('Խնդրում ենք մուտք գործել համակարգ՝ դասընթացին գրանցվելու համար');
      return;
    }
    
    setIsEnrolling(true);
    
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          status: 'enrolled'
        });
      
      if (error) throw error;
      
      setIsEnrolled(true);
      toast.success('Դուք հաջողությամբ գրանցվել եք դասընթացին');
    } catch (err) {
      console.error('Error enrolling in course:', err);
      toast.error('Չհաջողվեց գրանցվել դասընթացին');
    } finally {
      setIsEnrolling(false);
    }
  };

  const isStudent = user && user.role === 'student';

  return (
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <h3 className="font-medium flex items-center mb-3">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          Դասընթացի գրանցում
        </h3>
        
        {isStudent ? (
          <>
            <div className="text-sm mb-4">
              Գրանցվեք այս դասընթացին՝ ուսումը սկսելու համար։ Դասընթացը հասանելի կլինի գրանցումից հետո։
            </div>
            
            <div className="mt-auto">
              {isEnrolled ? (
                <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Դուք արդեն գրանցված եք այս դասընթացին
                </div>
              ) : (
                <Button 
                  onClick={handleEnrollment} 
                  className="w-full"
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Գրանցում...
                    </>
                  ) : (
                    'Գրանցվել դասընթացին'
                  )}
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-md text-sm mt-2">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Գրանցվելու համար դուք պետք է լինեք ուսանող։</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>Գրանցումը բաց է</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseEnrollment;
