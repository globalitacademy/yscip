
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProject } from '@/contexts/ProjectContext';
import { getUsersByRole } from '@/data/userRoles';
import { Briefcase, Users } from 'lucide-react';

const ProjectTeamSection: React.FC = () => {
  const { project } = useProject();
  
  // Get a list of team members (for demo purposes)
  const getTeamMembers = () => {
    if (!project) return [];
    
    // Get a couple of users from different roles
    const supervisor = getUsersByRole('supervisor')[0];
    const students = getUsersByRole('student').slice(0, 2);
    
    return [
      {
        id: supervisor.id,
        name: supervisor.name,
        role: 'Ղեկավար',
        avatar: supervisor.avatar || '',
      },
      ...students.map(student => ({
        id: student.id,
        name: student.name,
        role: 'Ուսանող',
        avatar: student.avatar || '',
      }))
    ];
  };
  
  // Sample team members
  const teamMembers = getTeamMembers();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Թիմ
        </h3>
        
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <div 
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic">Թիմի անդամներ չկան</div>
        )}
        
        {project?.organizationName && (
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Կազմակերպություն:</span>
              <span className="text-sm">{project.organizationName}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTeamSection;
