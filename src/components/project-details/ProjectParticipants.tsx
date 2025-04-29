
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Building, UserPlus, User, ExternalLink, ShieldCheck } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { getUsersByRole } from '@/data/userRoles';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

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
  instructor: "text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-600 bg-cyan-50 dark:bg-cyan-950",
  project_manager: "text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950",
};

const roleIcons = {
  supervisor: <ShieldCheck size={12} />,
  lecturer: <User size={12} />,
  student: <User size={12} />,
  employer: <Building size={12} />,
  instructor: <User size={12} />,
  project_manager: <ShieldCheck size={12} />
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ProjectParticipants: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useProject();
  const { user } = useAuth();
  
  if (!project) return null;
  
  // Ստեղծում ենք կեղծ տվյալներ նախագծի մասնակիցների համար
  // Իրական կիրառման դեպքում այս տվյալները պետք է գալիս լինեն սերվերից
  const supervisors = getUsersByRole('supervisor').slice(0, 1);
  const students = getUsersByRole('student').slice(0, 3); // Showing more students
  const lecturer = getUsersByRole('lecturer').slice(0, 1);
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
    ...lecturer.map(l => ({
      id: l.id,
      name: l.name,
      role: 'lecturer' as const,
      position: 'Դասախոս',
      avatar: l.avatar,
      status: 'active' as const
    })),
    ...students.map((s, index) => ({
      id: s.id,
      name: s.name,
      role: 'student' as const,
      position: 'Ուսանող',
      avatar: s.avatar,
      status: index === 0 ? 'active' as const : index === 1 ? 'pending' as const : 'rejected' as const
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
  
  const canManageParticipants = user && ['admin', 'lecturer', 'supervisor', 'project_manager'].includes(user.role);
  
  return (
    <Card className="mt-6 border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2 text-primary dark:text-primary-foreground">
          <Users size={20} /> Մասնակիցներ
        </CardTitle>
        
        {canManageParticipants && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddParticipant}
            className="flex items-center gap-1.5 border-primary/20 hover:bg-primary/10"
          >
            <UserPlus size={14} /> Ավելացնել
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {participants.length > 0 ? (
          <motion.div 
            className="space-y-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {participants.map(participant => (
              <motion.div 
                key={participant.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 border border-muted/30"
                variants={item}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-primary/20 h-10 w-10">
                    <AvatarImage src={participant.avatar || '/placeholder.svg'} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {participant.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">{participant.name}</div>
                    <div className="flex items-center gap-2 mt-1">
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
                  className="text-primary hover:text-primary-foreground hover:bg-primary/80 flex items-center gap-1.5"
                >
                  <ExternalLink size={14} className="mr-1" /> Դիտել
                </Button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users size={40} className="mx-auto opacity-20 mb-4" />
            <p>Այս նախագծի համար դեռ մասնակիցներ չեն ավելացվել</p>
            
            {canManageParticipants && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddParticipant}
                className="mt-4"
              >
                <UserPlus size={14} className="mr-1.5" /> Ավելացնել մասնակից
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectParticipants;
