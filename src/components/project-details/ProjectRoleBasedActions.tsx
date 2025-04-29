
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PenLine, 
  Info, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  School,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
  tooltip?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  variant = "default",
  disabled = false,
  tooltip
}) => {
  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={variant} 
              size="sm" 
              onClick={onClick} 
              disabled={disabled}
              className="flex items-center gap-1.5"
            >
              {icon}
              {label}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Button 
      variant={variant} 
      size="sm" 
      onClick={onClick} 
      disabled={disabled}
      className="flex items-center gap-1.5"
    >
      {icon}
      {label}
    </Button>
  );
};

const ProjectRoleBasedActions: React.FC = () => {
  const { 
    project, 
    projectStatus, 
    isEditing, 
    setIsEditing,
    canEdit,
    submitProject,
    approveProject,
    rejectProject,
    openSupervisorDialog,
    reserveProject,
    isReserved,
    getReservationStatus
  } = useProject();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!project || !user) return null;
  
  const reservationStatus = getReservationStatus();
  const projectId = project.id;
  
  const handleEditClick = () => {
    if (isEditing) {
      setIsEditing(false);
      toast({
        title: "Խմբագրումը կասեցված է",
        description: "Նախագծի խմբագրման ռեժիմը կասեցված է։"
      });
    } else {
      setIsEditing(true);
      toast({
        title: "Խմբագրման ռեժիմ",
        description: "Այժմ դուք կարող եք խմբագրել նախագիծը։"
      });
    }
  };
  
  const handleAdvancedEditClick = () => {
    navigate(`/projects/edit/${projectId}`);
  };
  
  const handleReserveClick = () => {
    if (reservationStatus === 'approved') {
      toast({
        title: "Արդեն ամրագրված է",
        description: "Դուք արդեն ամրագրել եք այս նախագիծը։"
      });
      return;
    }
    
    openSupervisorDialog();
  };
  
  const handleSubmitProject = () => {
    const feedback = prompt("Խնդրում ենք ներկայացնել նախագիծը հաստատող տեքստ:");
    if (feedback) {
      submitProject(feedback);
      toast({
        title: "Նախագիծը ներկայացված է",
        description: "Նախագիծը հաջողությամբ ներկայացվել է հաստատման։"
      });
    }
  };
  
  const handleApproveProject = () => {
    const feedback = prompt("Խնդրում ենք ներկայացնել հաստատող տեքստ:");
    if (feedback) {
      approveProject(feedback);
      toast({
        title: "Նախագիծը հաստատված է",
        description: "Նախագիծը հաջողությամբ հաստատվել է։"
      });
    }
  };
  
  const handleRejectProject = () => {
    const feedback = prompt("Խնդրում ենք ներկայացնել մերժման պատճառը:");
    if (feedback) {
      rejectProject(feedback);
      toast({
        title: "Նախագիծը մերժված է",
        description: "Նախագիծը մերժվել է։"
      });
    }
  };
  
  // Ուսանողի գործողություններ
  const renderStudentActions = () => {
    const canReserve = !isReserved && !reservationStatus;
    const isPending = reservationStatus === 'pending';
    const isApproved = reservationStatus === 'approved';
    const isRejected = reservationStatus === 'rejected';
    
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Ուսանողի գործողություններ</h3>
        
        <div className="flex flex-wrap gap-2">
          {canReserve && (
            <ActionButton 
              icon={<Calendar size={16} />} 
              label="Ամրագրել" 
              onClick={handleReserveClick}
              variant="default"
              tooltip="Ամրագրել նախագիծը ղեկավարի հետ"
            />
          )}
          
          {isPending && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 px-2.5 py-1 flex items-center gap-1.5">
              <Clock size={14} /> Սպասում է հաստատման
            </Badge>
          )}
          
          {isApproved && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-2.5 py-1 flex items-center gap-1.5">
              <CheckCircle size={14} /> Հաստատված է
            </Badge>
          )}
          
          {isRejected && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 px-2.5 py-1 flex items-center gap-1.5">
              <XCircle size={14} /> Մերժված է
            </Badge>
          )}
          
          {isApproved && projectStatus !== 'approved' && projectStatus !== 'pending' && (
            <ActionButton 
              icon={<FileText size={16} />} 
              label="Ներկայացնել" 
              onClick={handleSubmitProject}
              variant="outline"
              tooltip="Ներկայացնել նախագիծը հաստատման"
            />
          )}
          
          {projectStatus === 'pending' && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 px-2.5 py-1 flex items-center gap-1.5">
              <Clock size={14} /> Սպասում է հաստատման
            </Badge>
          )}
          
          {projectStatus === 'approved' && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-2.5 py-1 flex items-center gap-1.5">
              <CheckCircle size={14} /> Հաստատված է
            </Badge>
          )}
        </div>
      </div>
    );
  };
  
  // Դասախոսի գործողություններ
  const renderLecturerActions = () => {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Դասախոսի գործողություններ</h3>
        
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <>
              <ActionButton 
                icon={<PenLine size={16} />} 
                label={isEditing ? "Ավարտել" : "Խմբագրել"} 
                onClick={handleEditClick}
                variant={isEditing ? "secondary" : "outline"}
                tooltip={isEditing ? "Ավարտել խմբագրումը" : "Խմբագրել նախագիծը"}
              />
              
              <ActionButton 
                icon={<PenLine size={16} />} 
                label="Լայն խմբագրում" 
                onClick={handleAdvancedEditClick}
                variant="outline"
                tooltip="Լայն խմբագրման տարբերակ"
              />
            </>
          )}
          
          {projectStatus === 'pending' && (
            <>
              <ActionButton 
                icon={<CheckCircle size={16} />} 
                label="Հաստատել" 
                onClick={handleApproveProject}
                variant="default"
                tooltip="Հաստատել նախագիծը"
              />
              
              <ActionButton 
                icon={<XCircle size={16} />} 
                label="Մերժել" 
                onClick={handleRejectProject}
                variant="destructive"
                tooltip="Մերժել նախագիծը"
              />
            </>
          )}
        </div>
      </div>
    );
  };
  
  // Ղեկավարի գործողություններ
  const renderSupervisorActions = () => {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Ղեկավարի գործողություններ</h3>
        
        <div className="flex flex-wrap gap-2">
          {projectStatus === 'pending' && (
            <>
              <ActionButton 
                icon={<CheckCircle size={16} />} 
                label="Հաստատել" 
                onClick={handleApproveProject}
                variant="default"
                tooltip="Հաստատել նախագիծը"
              />
              
              <ActionButton 
                icon={<XCircle size={16} />} 
                label="Մերժել" 
                onClick={handleRejectProject}
                variant="destructive"
                tooltip="Մերժել նախագիծը"
              />
            </>
          )}
          
          <ActionButton 
            icon={<Users size={16} />} 
            label="Ուսանողներ" 
            onClick={() => navigate(`/supervisor/students?project=${projectId}`)}
            variant="outline"
            tooltip="Դիտել ամրագրված ուսանողներին"
          />
        </div>
      </div>
    );
  };
  
  // Ադմինի գործողություններ
  const renderAdminActions = () => {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Ադմին գործողություններ</h3>
        
        <div className="flex flex-wrap gap-2">
          <ActionButton 
            icon={<PenLine size={16} />} 
            label={isEditing ? "Ավարտել" : "Խմբագրել"} 
            onClick={handleEditClick}
            variant={isEditing ? "secondary" : "outline"}
            tooltip={isEditing ? "Ավարտել խմբագրումը" : "Խմբագրել նախագիծը"}
          />
          
          <ActionButton 
            icon={<PenLine size={16} />} 
            label="Լայն խմբագրում" 
            onClick={handleAdvancedEditClick}
            variant="outline"
            tooltip="Լայն խմբագրման տարբերակ"
          />
          
          {projectStatus === 'pending' && (
            <>
              <ActionButton 
                icon={<CheckCircle size={16} />} 
                label="Հաստատել" 
                onClick={handleApproveProject}
                variant="default"
                tooltip="Հաստատել նախագիծը"
              />
              
              <ActionButton 
                icon={<XCircle size={16} />} 
                label="Մերժել" 
                onClick={handleRejectProject}
                variant="destructive"
                tooltip="Մերժել նախագիծը"
              />
            </>
          )}
          
          <ActionButton 
            icon={<Users size={16} />} 
            label="Կառավարել" 
            onClick={() => navigate(`/admin/projects/manage/${projectId}`)}
            variant="outline"
            tooltip="Կառավարել նախագիծը"
          />
        </div>
      </div>
    );
  };
  
  // Գործատուի գործողություններ
  const renderEmployerActions = () => {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Գործատուի գործողություններ</h3>
        
        <div className="flex flex-wrap gap-2">
          {project.createdBy === user.id && (
            <>
              <ActionButton 
                icon={<PenLine size={16} />} 
                label={isEditing ? "Ավարտել" : "Խմբագրել"} 
                onClick={handleEditClick}
                variant={isEditing ? "secondary" : "outline"}
                tooltip={isEditing ? "Ավարտել խմբագրումը" : "Խմբագրել նախագիծը"}
              />
              
              <ActionButton 
                icon={<PenLine size={16} />} 
                label="Լայն խմբագրում" 
                onClick={handleAdvancedEditClick}
                variant="outline"
                tooltip="Լայն խմբագրման տարբերակ"
              />
            </>
          )}
          
          <ActionButton 
            icon={<Users size={16} />} 
            label="Թեկնածուներ" 
            onClick={() => navigate(`/employer/projects/${projectId}/candidates`)}
            variant="outline"
            tooltip="Դիտել ուսանող թեկնածուներին"
          />
        </div>
      </div>
    );
  };
  
  // Կառուցում դերի հիման վրա
  const renderActionsByRole = () => {
    switch (user.role) {
      case 'student':
        return renderStudentActions();
      case 'lecturer':
        return renderLecturerActions();
      case 'supervisor':
      case 'project_manager':
        return renderSupervisorActions();
      case 'admin':
        return renderAdminActions();
      case 'employer':
        return renderEmployerActions();
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-muted/50 border rounded-lg p-4 space-y-4">
      <h2 className="font-semibold flex items-center gap-1.5">
        <Info size={16} /> Գործողություններ
      </h2>
      <Separator />
      {renderActionsByRole()}
    </div>
  );
};

export default ProjectRoleBasedActions;
