
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Building, UserPlus, User } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { getUsersByRole } from '@/data/userRoles';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ParticipantRole {
  id: string;
  name: string;
  role: string;
  position?: string;
  avatar?: string;
  status?: 'active' | 'pending' | 'rejected';
}

const roleColors = {
  supervisor: "text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950",
  lecturer: "text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-950",
  student: "text-green-600 dark:text-green-400 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-950",
  employer: "text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950",
  instructor: "text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-600 bg-cyan-50 dark:bg-cyan-950"
};

const roleIcons = {
  supervisor: <User size={12} />,
  lecturer: <User size={12} />,
  student: <User size={12} />,
  employer: <Building size={12} />,
  instructor: <User size={12} />
};

const ProjectParticipants: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useProject();
  const { user } = useAuth();
  
  if (!project) return null;
  
  // Ստեղծում ենք կեղծ տվյալներ նախագծի մասնակիցների համար
  // Իրական կիրառման դեպքում այս տվյալները պետք է գալիս լինեն սերվերից
  const supervisors = getUsersByRole('supervisor').slice(0, 1);
  const students = getUsersByRole('student').slice(0, 2);
  const employer = project.organizationName ? {
    id: 'emp1',
    name: project.organizationName,
    role: 'employer',
    position: 'Կազմակերպություն',
    avatar: '/placeholder.svg'
  } : null;
  
  const participants: ParticipantRole[] = [
    ...supervisors.map(s => ({
      id: s.id,
      name: s.name,
      role: 'supervisor' as const,
      position: 'Ղեկավար',
      avatar: s.avatar,
      status: 'active' as const
    })),
    ...students.map(s => ({
      id: s.id,
      name: s.name,
      role: 'student' as const,
      position: 'Ուսանող',
      avatar: s.avatar,
      status: 'active' as const
    })),
    ...(employer ? [employer] : [])
  ];
  
  const handleAddParticipant = () => {
    // Տեղափոխել դեպի մասնակիցների ավելացման էջ
    navigate(`/project/${project.id}/participants/add`);
  };
  
  const handleViewParticipant = (participantId: string) => {
    // Տեղափոխել դեպի մասնակցի դիտման էջ
    navigate(`/users/${participantId}`);
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users size={20} /> Մասնակիցներ
        </CardTitle>
        
        {user && ['admin', 'lecturer', 'supervisor'].includes(user.role) && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddParticipant}
            className="flex items-center gap-1.5"
          >
            <UserPlus size={14} /> Ավելացնել
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {participants.length > 0 ? (
          <div className="space-y-4">
            {participants.map(participant => (
              <div 
                key={participant.id} 
                className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={participant.avatar || '/placeholder.svg'} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">{participant.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs px-1.5 py-0 flex items-center gap-1.5", 
                          roleColors[participant.role as keyof typeof roleColors])}
                      >
                        {roleIcons[participant.role as keyof typeof roleIcons]}
                        {participant.position}
                      </Badge>
                      
                      {participant.status && participant.role === 'student' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                variant={participant.status === 'active' ? 'default' : 
                                        participant.status === 'pending' ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {participant.status === 'active' ? 'Ակտիվ' : 
                                 participant.status === 'pending' ? 'Սպասում է' : 'Մերժված'}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{participant.status === 'active' ? 'Ամրագրումը հաստատված է' : 
                                 participant.status === 'pending' ? 'Սպասում է հաստատման' : 
                                 'Ամրագրումը մերժված է'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleViewParticipant(participant.id)}
                >
                  Դիտել
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Այս նախագծի համար դեռ մասնակիցներ չեն ավելացվել</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectParticipants;
