
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, ExternalLink, Users } from 'lucide-react';
import EditableField from '@/components/common/EditableField';

interface ProjectMembersProps {
  members: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  isEditing?: boolean;
  onOrganizationChange?: (value: string) => void;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ 
  members, 
  organization,
  isEditing = false,
  onOrganizationChange = () => {}
}) => {
  return (
    <div className="border border-border rounded-lg p-6">
      {/* Organization section */}
      {organization && (
        <>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Building size={18} className="mr-2 text-primary" />
            Կազմակերպություն
          </h3>
          <Separator className="mb-4" />
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              <img 
                src={organization.logo} 
                alt={organization.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Org';
                }}
              />
            </div>
            <div>
              {isEditing ? (
                <EditableField 
                  value={organization.name}
                  onChange={onOrganizationChange}
                  placeholder="Մուտքագրեք կազմակերպության անունը"
                  showEditButton={false}
                />
              ) : (
                <div className="font-medium">{organization.name}</div>
              )}
              {organization.website && !isEditing && (
                <a 
                  href={organization.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center mt-1"
                >
                  {organization.website.replace(/^https?:\/\//, '')}
                  <ExternalLink size={12} className="ml-1" />
                </a>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Members section */}
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <Users size={18} className="mr-2 text-primary" />
        Մասնակիցներ
      </h3>
      <Separator className="mb-4" />
      
      {members.length > 0 ? (
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground italic text-sm">Մասնակիցներ չեն նշված</p>
      )}
    </div>
  );
};

export default ProjectMembers;
