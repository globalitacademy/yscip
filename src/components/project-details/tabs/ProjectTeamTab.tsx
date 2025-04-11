
import React from 'react';

interface ProjectTeamTabProps {
  projectMembers: any[];
  organization: any;
  isEditing: boolean;
}

const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({ projectMembers, organization, isEditing }) => {
  return (
    <div className="space-y-8">
      {/* Team members section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Թիմի անդամներ</h2>
        {projectMembers.length === 0 ? (
          <p className="text-muted-foreground">Այս նախագծի համար թիմի անդամներ նշված չեն:</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src={member.avatar || 'https://via.placeholder.com/150'} 
                    alt={member.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Organization section */}
      {organization && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Կազմակերպություն</h2>
          <div className="flex items-center space-x-4 p-4 border rounded-lg max-w-md">
            <div className="h-16 w-16 overflow-hidden">
              <img 
                src={organization.logo || 'https://via.placeholder.com/150'} 
                alt={organization.name} 
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-medium">{organization.name}</h3>
              {organization.website && (
                <a 
                  href={organization.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {organization.website}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTeamTab;
