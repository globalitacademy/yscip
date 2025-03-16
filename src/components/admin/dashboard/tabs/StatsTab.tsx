
import React from 'react';
import UsersRoleChart from '../charts/UsersRoleChart';
import RegistrationChart from '../charts/RegistrationChart';
import ProjectsStatusChart from '../charts/ProjectsStatusChart';
import SystemStatusCard from '../SystemStatusCard';
import FeaturedCourses from '@/components/courses/FeaturedCourses';

const StatsTab: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersRoleChart />
        <RegistrationChart />
        <ProjectsStatusChart />
        <SystemStatusCard />
      </div>
      
      <div className="border-t pt-8">
        <FeaturedCourses />
      </div>
    </div>
  );
};

export default StatsTab;
