import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { RecentActivity } from '../../components/admin/RecentActivity';
import { PerformanceChart } from '../../components/admin/PerformanceChart';
import { UserAttempts } from '../../components/admin/UserAttempts';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do sistema e estatísticas"
      />

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <PerformanceChart />
      </div>

      <UserAttempts />
    </div>
  );
}