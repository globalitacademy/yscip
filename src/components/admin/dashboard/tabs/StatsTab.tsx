
import React from 'react';
import UsersRoleChart from '../charts/UsersRoleChart';
import RegistrationChart from '../charts/RegistrationChart';
import ProjectsStatusChart from '../charts/ProjectsStatusChart';
import SystemStatusCard from '../SystemStatusCard';

const StatsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UsersRoleChart />
      <RegistrationChart />
      <ProjectsStatusChart />
      <SystemStatusCard />
    </div>
  );
};

export default StatsTab;
