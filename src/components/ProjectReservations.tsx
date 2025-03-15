
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsersByRole } from '@/data/userRoles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const ProjectReservations: React.FC = () => {
  const { projectReservations, approveReservation, rejectReservation, reserveProject, project, isReserved, openSupervisorDialog } = useProject();
  const { user } = useAuth();
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [rejectProjectId, setRejectProjectId] = useState<string | null>(null);
  
  // Get supervisors and instructors for selection
  const supervisors = getUsersByRole('supervisor').concat(getUsersByRole('project_manager'));
  const instructors = getUsersByRole('instructor').concat(getUsersByRole('lecturer'));
  
  // Filter reservations based on user role
  const filteredReservations = projectReservations.filter(res => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    if (user.role === 'student') {
      return res.userId === user.id;
    }
    
    if (user.role === 'supervisor' || user.role === 'project_manager') {
      return res.supervisorId === user.id;
    }
    
    if (user.role === 'instructor' || user.role === 'lecturer') {
      return res.instructorId === user.id;
    }
    
    return false;
  });

  const handleReserveProject = () => {
    // Fixed: Instead of passing arguments to reserveProject, we now use openSupervisorDialog
    openSupervisorDialog();
  };

  const handleRejectOpen = (projectId: string) => {
    setRejectProjectId(projectId);
    setRejectFeedback("");
  };

  const handleRejectConfirm = () => {
    if (rejectProjectId === null) return;
    
    rejectReservation(rejectProjectId, rejectFeedback);
    setRejectProjectId(null);
    setRejectFeedback("");
  };

  // Only students can reserve projects
  const canReserve = user?.role === 'student' && !isReserved && project;
  
  return (
    <div className="space-y-6">
      {canReserve && (
        <Card>
          <CardHeader>
            <CardTitle>Պրոեկտի ամրագրում</CardTitle>
            <CardDescription>
              Ամրագրեք այս պրոեկտը և ընտրեք ձեր նախընտրած ղեկավարին կամ դասախոսին
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ընտրեք ղեկավար</label>
              <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք ղեկավար" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ոչ մեկը</SelectItem>
                  {supervisors.map(supervisor => (
                    <SelectItem key={supervisor.id} value={supervisor.id}>
                      {supervisor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ընտրեք դասախոս</label>
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք դասախոս" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ոչ մեկը</SelectItem>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleReserveProject}>Ամրագրել պրոեկտը</Button>
          </CardFooter>
        </Card>
      )}
      
      {filteredReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Պրոեկտների ամրագրումներ</CardTitle>
            <CardDescription>
              {user?.role === 'student' 
                ? "Ձեր ամրագրած պրոեկտները" 
                : "Ձեզ նշանակված ամրագրումները"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReservations.map((reservation, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{reservation.projectTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        Ամրագրված է: {new Date(reservation.timestamp).toLocaleDateString()} {new Date(reservation.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        reservation.status === 'approved' ? 'default' : 
                        reservation.status === 'rejected' ? 'destructive' : 
                        'outline'
                      }
                    >
                      {reservation.status === 'approved' ? (
                        <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Հաստատված</span>
                      ) : reservation.status === 'rejected' ? (
                        <span className="flex items-center"><XCircle className="w-3 h-3 mr-1" /> Մերժված</span>
                      ) : (
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Սպասման մեջ</span>
                      )}
                    </Badge>
                  </div>
                  
                  {reservation.feedback && (
                    <div className="bg-muted p-2 rounded text-sm">
                      <p className="font-medium">Մեկնաբանություն:</p>
                      <p>{reservation.feedback}</p>
                    </div>
                  )}
                  
                  {(user?.role === 'supervisor' || user?.role === 'project_manager' || user?.role === 'instructor' || user?.role === 'lecturer') && 
                   reservation.status === 'pending' && (
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => approveReservation(reservation.id)}
                      >
                        Հաստատել
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectOpen(reservation.id)}
                          >
                            Մերժել
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ամրագրման մերժում</DialogTitle>
                            <DialogDescription>
                              Մուտքագրեք մերժման պատճառը ուսանողին տեղեկացնելու համար:
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Textarea
                              placeholder="Մերժման պատճառը..."
                              value={rejectFeedback}
                              onChange={(e) => setRejectFeedback(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setRejectProjectId(null)}>Չեղարկել</Button>
                            <Button variant="destructive" onClick={handleRejectConfirm}>Մերժել ամրագրումը</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {user?.role === 'student' && filteredReservations.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ամրագրումներ չկան</CardTitle>
            <CardDescription>
              Դուք դեռ չեք ամրագրել որևէ պրոեկտ։
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6 text-muted-foreground">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
                <p>Ամրագրեք պրոեկտ՝ սկսելու համար:</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectReservations;
