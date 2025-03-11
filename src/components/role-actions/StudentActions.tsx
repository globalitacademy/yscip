
import React from 'react';
import { ClipboardList, FileText } from 'lucide-react';
import ActionCard from '../ActionCard';

const StudentActions: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
    <ActionCard 
      title="Նախագծեր"
      description="Դիտել հասանելի նախագծերը"
      icon={<ClipboardList className="h-6 w-6 text-primary" />}
      href="/student-dashboard"
      buttonText="Մուտք"
    />
    <ActionCard 
      title="Պորտֆոլիո"
      description="Կառավարել պորտֆոլիոն"
      icon={<FileText className="h-6 w-6 text-primary" />}
      href="/portfolio"
      buttonText="Դիտել"
    />
  </div>
);

export default StudentActions;
