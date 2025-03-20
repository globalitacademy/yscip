
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CourseEnrollmentProps {
  courseId: string;
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = ({ courseId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Խնդրում ենք մուտք գործել հաշիվ՝ դասընթացին գրանցվելու համար');
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Դուք հաջողությամբ գրանցվել եք դասընթացին');
    } catch (err) {
      console.error('Error enrolling in course:', err);
      toast.error('Չհաջողվեց գրանցվել դասընթացին');
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col h-full justify-between">
        <div>
          <h3 className="font-medium mb-3">Գրանցվելու համար</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Գրանցվեք հիմա և սկսեք ձեր ուսումնական ճանապարհորդությունը։
          </p>
        </div>
        <Button 
          className="w-full" 
          onClick={handleEnroll}
        >
          Գրանցվել դասընթացին
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseEnrollment;
