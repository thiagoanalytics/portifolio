
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
import ProjectForm from './ProjectForm';
import { Project } from '@/types/portfolio';

const ProjectsManager: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const { projects, categories, deleteProject } = usePortfolio();
  const { toast } = useToast();

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (project: Project) => {
    deleteProject(project.id);
    toast({
      title: "Projeto excluído!",
      description: `O projeto "${project.name}" foi removido.`,
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Sem categoria';
  };

  if (isFormOpen) {
    return (
      <ProjectForm
        project={editingProject}
        onSave={handleFormClose}
        onCancel={handleFormClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-portfolio-dark mb-2">Gerenciar Projetos</h1>
          <p className="text-portfolio-secondary">
            Cadastre, edite e organize seus projetos
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-portfolio-primary hover:bg-portfolio-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar projetos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-portfolio-dark mb-2">
                {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto cadastrado'}
              </h3>
              <p className="text-portfolio-secondary mb-4">
                {searchTerm 
                  ? 'Tente ajustar sua busca.'
                  : 'Comece adicionando seu primeiro projeto.'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-portfolio-primary hover:bg-portfolio-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              )}
            </div>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg text-portfolio-dark truncate">
                      {project.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-portfolio-primary/10 text-portfolio-primary border-0">
                      {getCategoryName(project.category_id)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {project.image_url && (
                  <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={project.image_url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <p className="text-portfolio-secondary text-sm line-clamp-3 mb-4">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                  {project.external_link && (
                    <a
                      href={project.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-portfolio-primary hover:text-portfolio-primary/80"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Link
                    </a>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(project)}
                    className="hover:bg-portfolio-primary hover:text-white hover:border-portfolio-primary"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o projeto "{project.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(project)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;
