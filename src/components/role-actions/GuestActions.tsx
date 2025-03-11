
import React from 'react';
import { Users, ClipboardList, FileText } from 'lucide-react';
import ActionCard from '../ActionCard';

const GuestActions: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    <ActionCard 
      title="Մուտք գործել"
      description="Մուտք գործեք Ձեր հաշիվ"
      icon={<Users className="h-6 w-6 text-primary" />}
      href="/login"
      buttonText="Մուտք"
    />
    <ActionCard 
      title="Նախագծեր"
      description="Դիտել առկա նախագծերը"
      icon={<ClipboardList className="h-6 w-6 text-primary" />}
      href="/"
      buttonText="Դիտել"
    />
    <ActionCard 
      title="Գրանցվել"
      description="Ստեղծել նոր հաշիվ"
      icon={<FileText className="h-6 w-6 text-primary" />}
      href="/login"
      buttonText="Գրանցվել"
    />
  </div>
);

export default GuestActions;
