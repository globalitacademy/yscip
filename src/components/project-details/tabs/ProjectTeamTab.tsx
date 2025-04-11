
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, ExternalLink, Mail } from 'lucide-react';

interface ProjectTeamTabProps {
  projectMembers: any[];
  organization: any;
  isEditing: boolean;
}

const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({
  projectMembers,
  organization,
  isEditing
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      {/* Team Members Card */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
            Նախագծի թիմ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectMembers.map((member, index) => (
              <div 
                key={index}
                className={`p-4 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-750 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                } flex gap-4`}
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                    {member.name}
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {member.role}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <a 
                      href={`mailto:${member.email || 'example@mail.com'}`}
                      className={`text-xs flex items-center gap-1 ${
                        theme === 'dark' 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      <Mail size={12} /> Ուղարկել նամակ
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {projectMembers.length === 0 && (
            <p className={`text-center my-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Թիմի անդամներ չեն ավելացվել
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Organization Card */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
            Նախագիծը կատարող կազմակերպություն
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-6 rounded border ${
            theme === 'dark' 
              ? 'bg-gray-750 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          } flex gap-6`}>
            <div className="shrink-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={organization.logo} alt={organization.name} />
                <AvatarFallback>
                  <Building size={24} />
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div>
              <h3 className={`text-xl font-medium mb-2 ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                {organization.name}
              </h3>
              
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Կազմակերպությունը մասնագիտացած է ծրագրային լուծումների և տեխնոլոգիական նախագծերի ոլորտում։
              </p>
              
              <a 
                href={organization.website} 
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm flex items-center gap-1 ${
                  theme === 'dark' 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                <ExternalLink size={14} /> Այցելել կայք
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTeamTab;
