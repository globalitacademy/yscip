
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CourseEnrollmentProps {
  courseId: string;
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = ({ courseId }) => {
  const { user } = useAuth();
  
  const handleEnrollment = () => {
    // This would typically call an API to enroll the user in the course
    toast.success('Դուք հաջողությամբ գրանցվել եք դասընթացին');
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
              <Button 
                onClick={handleEnrollment} 
                className="w-full"
              >
                Գրանցվել դասընթացին
              </Button>
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
