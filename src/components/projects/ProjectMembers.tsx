
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { User, Building, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

interface Organization {
  id: string;
  name: string;
  website?: string;
  logo?: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
}

interface ProjectMembersProps {
  members: Member[];
  organization?: Organization;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ members, organization }) => {
  return (
    <div className="border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <User size={18} className="mr-2 text-primary" />
        Մասնակիցներ
      </h3>
      <Separator className="mb-4" />
      
      <div className="space-y-4">
        {members.map(member => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            {member.email && (
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <a href={`mailto:${member.email}`}>Կապ հաստատել</a>
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {organization && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Building size={18} className="mr-2 text-primary" />
            Կազմակերպություն
          </h3>
          <Separator className="mb-4" />
          
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded overflow-hidden bg-accent flex-shrink-0">
              {organization.logo ? (
                <img src={organization.logo} alt={organization.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                  {organization.name.substring(0, 2)}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{organization.name}</p>
              {organization.website && (
                <a 
                  href={organization.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  {organization.website} <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMembers;
