
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { MessageSquare, Search, Clipboard } from 'lucide-react';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { loadProjectReservations, ProjectReservation } from '@/utils/reservationUtils';
import SupervisorProjectManagement from '@/components/supervisor/SupervisorProjectManagement';
import SupervisorRequestsTab from '@/components/supervisor/SupervisorRequestsTab';
import SupervisorRejectDialog from '@/components/supervisor/SupervisorRejectDialog';
import SupervisorEmptyState from '@/components/supervisor/SupervisorEmptyState';

// Inner component that uses ProjectContext
const SupervisedStudentsContent: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<ProjectReservation | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  
  const projectReservations = loadProjectReservations();
  
  const pendingReservations = projectReservations.filter(
    res => res.supervisorId === user?.id && res.status === 'pending'
  );
  
  const approvedReservations = projectReservations.filter(
    res => res.supervisorId === user?.id && res.status === 'approved'
  );
  
  const filteredPendingReservations = pendingReservations.filter(res => 
    (res.projectTitle || `Project #${res.projectId}`).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredApprovedReservations = approvedReservations.filter(res => 
    (res.projectTitle || `Project #${res.projectId}`).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleApprove = (reservation: ProjectReservation) => {
    // We're not using the useProject hook here anymore
    // Instead, we'll implement the approval functionality directly
    const updatedReservations = projectReservations.map(res => 
      res.id === reservation.id ? { ...res, status: 'approved', responseDate: new Date().toISOString() } : res
    );
    localStorage.setItem('projectReservations', JSON.stringify(updatedReservations));
    
    toast(`Դուք հաստատել եք ${reservation.projectTitle || `Project #${reservation.projectId}`} նախագծի ղեկավարումը։`);
  };
  
  const handleOpenRejectDialog = (reservation: ProjectReservation) => {
    setSelectedReservation(reservation);
    setShowRejectDialog(true);
  };
  
  const handleReject = () => {
    if (selectedReservation && rejectFeedback) {
      // Implement rejection functionality directly instead of using useProject
      const updatedReservations = projectReservations.map(res => 
        res.id === selectedReservation.id ? 
        { ...res, status: 'rejected', feedback: rejectFeedback, responseDate: new Date().toISOString() } : res
      );
      localStorage.setItem('projectReservations', JSON.stringify(updatedReservations));
      
      setShowRejectDialog(false);
      setRejectFeedback('');
      setSelectedReservation(null);
      toast("Հարցումը մերժված է։ Ուսանողը կստանա ձեր մերժման պատճառը։");
    }
  };
  
  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-2">Մուտքն արգելված է</h2>
        <p className="text-muted-foreground">
          Այս էջը հասանելի է միայն նախագծերի ղեկավարների համար։
        </p>
      </div>
    );
  }
  
  return (
    <>
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <MessageSquare size={16} /> Հարցումներ 
            {pendingReservations.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingReservations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="supervised" className="flex items-center gap-2">
            <Clipboard size={16} /> Ղեկավարվող նախագծեր
            {approvedReservations.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {approvedReservations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Փնտրել ըստ նախագծի կամ ուսանողի..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <TabsContent value="requests" className="mt-0">
          <h2 className="text-xl font-semibold mb-4">Սպասող հարցումներ</h2>
          
          <SupervisorRequestsTab 
            pendingReservations={filteredPendingReservations}
            onApprove={handleApprove}
            onReject={handleOpenRejectDialog}
          />
        </TabsContent>
        
        <TabsContent value="supervised" className="mt-0">
          <h2 className="text-xl font-semibold mb-4">Ղեկավարվող նախագծեր</h2>
          
          {filteredApprovedReservations.length === 0 ? (
            <SupervisorEmptyState 
              icon={<Clipboard className="h-12 w-12" />}
              title="Չկան ղեկավարվող նախագծեր"
              description="Դուք դեռ չեք հաստատել որևէ նախագծի ղեկավարում։ Հաստատելուց հետո նախագծերը կհայտնվեն այստեղ։"
            />
          ) : (
            <SupervisorProjectManagement reservations={filteredApprovedReservations} />
          )}
        </TabsContent>
      </Tabs>
      
      <SupervisorRejectDialog 
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        selectedReservation={selectedReservation}
        rejectFeedback={rejectFeedback}
        setRejectFeedback={setRejectFeedback}
        onReject={handleReject}
      />
    </>
  );
};

// Outer component wrapper
const SupervisedStudentsPage: React.FC = () => {
  // Since we don't have a specific project, we'll use a mock one
  const mockProject = {
    id: 0,
    title: "Supervised Projects",
  };

  return (
    <AdminLayout pageTitle="Ուսանողների ղեկավարում">
      <ProjectProvider projectId={0} initialProject={mockProject}>
        <SupervisedStudentsContent />
      </ProjectProvider>
    </AdminLayout>
  );
};

export default SupervisedStudentsPage;
