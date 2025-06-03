
import React from 'react';
import { PortfolioProvider, usePortfolio } from '@/contexts/PortfolioContext';
import PublicLayout from '@/components/public/PublicLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import LoginForm from '@/components/admin/LoginForm';

const AppContent: React.FC = () => {
  const { isAuthenticated } = usePortfolio();
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return isAuthenticated ? <AdminLayout /> : <LoginForm />;
  }

  return <PublicLayout />;
};

const Index: React.FC = () => {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
};

export default Index;
