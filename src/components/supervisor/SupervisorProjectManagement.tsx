
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { FileText, ClipboardList, Calendar } from 'lucide-react';
import { ProjectReservation } from '@/utils/projectUtils'; // Use from projectUtils to match types
import { getUsersByRole } from '@/data/userRoles';
import { Link } from 'react-router-dom';
import { calculateProjectProgress } from '@/utils/projectUtils';

interface SupervisorProjectManagementProps {
  reservations: ProjectReservation[];
}

const SupervisorProjectManagement: React.FC<SupervisorProjectManagementProps> = ({ 
  reservations 
}) => {
  const students = getUsersByRole('student');
  
  // Get student info by ID
  const getStudentInfo = (studentId: string) => {
    return students.find(student => student.id === studentId);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reservations.map(reservation => {
        const student = getStudentInfo(reservation.studentId || reservation.userId || '');
        // For demo purposes, generate a random progress value
        const progress = Math.floor(Math.random() * 100);
        const projectTitle = reservation.projectTitle || `Project #${reservation.projectId}`;
        
        return (
          <Card key={`${reservation.projectId}-${reservation.studentId || reservation.userId}`} className="overflow-hidden border border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 bg-card/5">
              <CardTitle className="text-lg font-medium">{projectTitle}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3 border border-primary/10">
                  <AvatarImage src={student?.avatar} alt={student?.name} />
                  <AvatarFallback>{student?.name?.substring(0, 2) || 'ՈՒ'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{student?.name || reservation.studentName || 'Անհայտ ուսանող'}</p>
                  <p className="text-sm text-muted-foreground">{student?.group || 'Անհայտ խումբ'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Առաջադիմություն</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Ուսանող
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={14} />
                    <span>{new Date(reservation.timestamp || reservation.requestDate || '').toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                    <Link to={`/projects/${reservation.projectId}`}>
                      <FileText className="h-4 w-4 mr-1" /> Դիտել նախագիծը
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                    <Link to={`/tasks`}>
                      <ClipboardList className="h-4 w-4 mr-1" /> Առաջադրանքներ
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SupervisorProjectManagement;
