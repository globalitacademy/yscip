
import React from 'react';
import { ClipboardList, FileText, LayoutDashboard } from 'lucide-react';
import ActionCard from '../ActionCard';

const ProjectManagerActions: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    <ActionCard 
      title="Նախագծեր"
      description="Կառավարել նախագծերը"
      icon={<ClipboardList className="h-6 w-6 text-primary" />}
      href="/project-manager-dashboard"
      buttonText="Մուտք"
    />
    <ActionCard 
      title="Առաջադրանքներ"
      description="Կառավարել առաջադրանքները"
      icon={<FileText className="h-6 w-6 text-primary" />}
      href="/tasks"
      buttonText="Դիտել"
    />
    <ActionCard 
      title="Ժամանակացույց"
      description="Դիտել ժամանակացույցը"
      icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
      href="/gantt"
      buttonText="Դիտել"
    />
  </div>
);

export default ProjectManagerActions;
