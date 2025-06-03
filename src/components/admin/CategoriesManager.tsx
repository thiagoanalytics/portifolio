
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Category } from '@/types/portfolio';

const CategoriesManager: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [formData, setFormData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { categories, projects, addCategory, updateCategory, deleteCategory } = usePortfolio();
  const { toast } = useToast();

  const getCategoryProjectCount = (categoryId: string) => {
    return projects.filter(project => project.category_id === categoryId).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trim()) return;

    setIsLoading(true);

    try {
      if (editingCategory) {
        updateCategory(editingCategory.id, { name: formData.trim() });
        toast({
          title: "Categoria atualizada!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        addCategory({ name: formData.trim() });
        toast({
          title: "Categoria criada!",
          description: "A nova categoria foi adicionada.",
        });
      }
      handleFormClose();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a categoria.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category.name);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    const projectCount = getCategoryProjectCount(category.id);
    
    if (projectCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: `Esta categoria possui ${projectCount} projeto${projectCount > 1 ? 's' : ''} vinculado${projectCount > 1 ? 's' : ''}. Remova ou altere a categoria dos projetos primeiro.`,
        variant: "destructive",
      });
      return;
    }

    deleteCategory(category.id);
    toast({
      title: "Categoria excluída!",
      description: `A categoria "${category.name}" foi removida.`,
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(undefined);
    setFormData('');
  };

  const handleNewCategory = () => {
    setEditingCategory(undefined);
    setFormData('');
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-portfolio-dark mb-2">Gerenciar Categorias</h1>
          <p className="text-portfolio-secondary">
            Organize seus projetos em categorias
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleNewCategory}
              className="bg-portfolio-primary hover:bg-portfolio-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                  placeholder="Digite o nome da categoria"
                  required
                  className="h-11"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFormClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.trim()}
                  className="bg-portfolio-primary hover:bg-portfolio-primary/90"
                >
                  {isLoading ? 'Salvando...' : (editingCategory ? 'Atualizar' : 'Criar')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-portfolio-dark mb-2">
                Nenhuma categoria cadastrada
              </h3>
              <p className="text-portfolio-secondary mb-4">
                Comece criando categorias para organizar seus projetos.
              </p>
              <Button
                onClick={handleNewCategory}
                className="bg-portfolio-primary hover:bg-portfolio-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Categoria
              </Button>
            </div>
          </div>
        ) : (
          categories.map((category) => {
            const projectCount = getCategoryProjectCount(category.id);
            return (
              <Card key={category.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-portfolio-primary/10 rounded-lg flex items-center justify-center">
                        <Tag className="h-5 w-5 text-portfolio-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-portfolio-dark">
                          {category.name}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1 border-portfolio-primary/20 text-portfolio-primary">
                          {projectCount} projeto{projectCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>
                      Criada em {new Date(category.created_at || '').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
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
                          disabled={projectCount > 0}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a categoria "{category.name}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category)}
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoriesManager;
