
import React from 'react';
import { LayoutDashboard, Users, Building } from 'lucide-react';
import ActionCard from '../ActionCard';

const AdminActions: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    <ActionCard 
      title="Կառավարման վահանակ"
      description="Կառավարել համակարգը"
      icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
      href="/admin"
      buttonText="Մուտք"
    />
    <ActionCard 
      title="Օգտատերեր"
      description="Կառավարել օգտատերերին"
      icon={<Users className="h-6 w-6 text-primary" />}
      href="/users"
      buttonText="Դիտել"
    />
    <ActionCard 
      title="Կազմակերպություններ"
      description="Կառավարել կազմակերպությունները"
      icon={<Building className="h-6 w-6 text-primary" />}
      href="/organizations"
      buttonText="Դիտել"
    />
  </div>
);

export default AdminActions;
