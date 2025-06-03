
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Tag, 
  LogOut, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import Dashboard from './Dashboard';
import ProjectsManager from './ProjectsManager';
import CategoriesManager from './CategoriesManager';

type AdminPage = 'dashboard' | 'projects' | 'categories';

const AdminLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, currentUser } = usePortfolio();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const navigation = [
    {
      id: 'dashboard' as AdminPage,
      name: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'projects' as AdminPage,
      name: 'Projetos',
      icon: FolderOpen,
    },
    {
      id: 'categories' as AdminPage,
      name: 'Categorias',
      icon: Tag,
    },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectsManager />;
      case 'categories':
        return <CategoriesManager />;
      default:
        return <Dashboard />;
    }
  };

  const getCurrentPageTitle = () => {
    const page = navigation.find(nav => nav.id === currentPage);
    return page?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-portfolio-dark">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start h-12 ${
                    isActive 
                      ? 'bg-portfolio-primary text-white hover:bg-portfolio-primary/90' 
                      : 'text-portfolio-secondary hover:bg-gray-100 hover:text-portfolio-dark'
                  }`}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
          <div className="mb-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              asChild
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Site Público
              </a>
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-portfolio-dark">{currentUser?.username}</p>
              <p className="text-portfolio-secondary">Administrador</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-4"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold text-portfolio-dark">
              {getCurrentPageTitle()}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
