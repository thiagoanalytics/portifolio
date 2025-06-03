
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { Project, ProjectFormData } from '@/types/portfolio';

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    image_url: '',
    external_link: '',
    category_id: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { categories, addProject, updateProject } = usePortfolio();
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        image_url: project.image_url || '',
        external_link: project.external_link || '',
        category_id: project.category_id
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (project) {
        updateProject(project.id, formData);
        toast({
          title: "Projeto atualizado!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        addProject(formData);
        toast({
          title: "Projeto criado!",
          description: "O novo projeto foi adicionado ao portfólio.",
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o projeto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-portfolio-dark">
          {project ? 'Editar Projeto' : 'Novo Projeto'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Projeto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="Digite o nome do projeto"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleChange('category_id', value)}
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              placeholder="Descreva o projeto..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL da Imagem</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="h-11"
            />
            <p className="text-sm text-portfolio-secondary">
              Cole o link de uma imagem para representar o projeto
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_link">Link Externo</Label>
            <Input
              id="external_link"
              type="url"
              value={formData.external_link}
              onChange={(e) => handleChange('external_link', e.target.value)}
              placeholder="https://github.com/projeto ou https://projeto.com"
              className="h-11"
            />
            <p className="text-sm text-portfolio-secondary">
              Link para o projeto (GitHub, Behance, site, etc.)
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-portfolio-primary hover:bg-portfolio-primary/90"
            >
              {isLoading ? 'Salvando...' : (project ? 'Atualizar' : 'Criar Projeto')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
