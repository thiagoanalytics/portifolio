
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { FolderOpen, Tag, TrendingUp, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { projects, categories } = usePortfolio();

  const recentProjects = projects.slice(0, 5);
  const projectsByCategory = categories.map(category => ({
    ...category,
    count: projects.filter(p => p.category_id === category.id).length
  }));

  const stats = [
    {
      title: 'Total de Projetos',
      value: projects.length,
      icon: FolderOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Categorias Ativas',
      value: categories.length,
      icon: Tag,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Projetos este Mês',
      value: projects.filter(p => {
        const projectDate = new Date(p.created_at);
        const now = new Date();
        return projectDate.getMonth() === now.getMonth() && 
               projectDate.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Último Projeto',
      value: projects.length > 0 ? new Date(projects[0].created_at).toLocaleDateString('pt-BR') : 'N/A',
      icon: Calendar,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-portfolio-dark mb-2">Dashboard</h1>
        <p className="text-portfolio-secondary">
          Visão geral do seu portfólio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-portfolio-secondary mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-portfolio-dark">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-portfolio-dark">Projetos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <p className="text-portfolio-secondary text-center py-4">
                  Nenhum projeto cadastrado ainda.
                </p>
              ) : (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-portfolio-primary/10 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-portfolio-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-portfolio-dark truncate">
                        {project.name}
                      </p>
                      <p className="text-sm text-portfolio-secondary">
                        {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-portfolio-primary/10 text-portfolio-primary border-0">
                      {categories.find(c => c.id === project.category_id)?.name || 'Sem categoria'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories Stats */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-portfolio-dark">Projetos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectsByCategory.length === 0 ? (
                <p className="text-portfolio-secondary text-center py-4">
                  Nenhuma categoria cadastrada ainda.
                </p>
              ) : (
                projectsByCategory.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-portfolio-accent/10 rounded-lg flex items-center justify-center">
                        <Tag className="h-4 w-4 text-portfolio-accent" />
                      </div>
                      <span className="font-medium text-portfolio-dark">
                        {category.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="border-portfolio-primary/20 text-portfolio-primary">
                      {category.count} projeto{category.count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
