
import React from 'react';
import { ClipboardList, FileText } from 'lucide-react';
import ActionCard from '../ActionCard';

const EmployerActions: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
    <ActionCard 
      title="Իմ նախագծերը"
      description="Դիտել իմ նախագծերը"
      icon={<ClipboardList className="h-6 w-6 text-primary" />}
      href="/employer-dashboard"
      buttonText="Մուտք"
    />
    <ActionCard 
      title="Նախագծի առաջարկ"
      description="Առաջարկել նոր նախագիծ"
      icon={<FileText className="h-6 w-6 text-primary" />}
      href="/projects/submit"
      buttonText="Առաջարկել"
    />
  </div>
);

export default EmployerActions;
