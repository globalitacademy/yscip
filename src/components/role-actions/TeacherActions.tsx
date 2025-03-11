
import React from 'react';
import { BookOpen, ClipboardList, Users } from 'lucide-react';
import ActionCard from '../ActionCard';

const TeacherActions: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    <ActionCard 
      title="Կուրսեր"
      description="Կառավարել կուրսերը"
      icon={<BookOpen className="h-6 w-6 text-primary" />}
      href="/teacher-dashboard"
      buttonText="Մուտք"
    />
    <ActionCard 
      title="Առաջադրանքներ"
      description="Կառավարել առաջադրանքները"
      icon={<ClipboardList className="h-6 w-6 text-primary" />}
      href="/tasks"
      buttonText="Դիտել"
    />
    <ActionCard 
      title="Խմբեր"
      description="Կառավարել խմբերը"
      icon={<Users className="h-6 w-6 text-primary" />}
      href="/groups"
      buttonText="Դիտել"
    />
  </div>
);

export default TeacherActions;
