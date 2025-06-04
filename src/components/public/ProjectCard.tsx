
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/portfolio';
import { usePortfolio } from '@/contexts/PortfolioContext';
import SafeContent from '@/components/security/SafeContent';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { categories } = usePortfolio();
  const category = categories.find(cat => cat.id === project.category_id);

  // Validate external link before rendering
  const isValidUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-gray-200 bg-white">
      <div className="aspect-video overflow-hidden bg-gray-100">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback for broken images
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-portfolio-primary/10 to-portfolio-accent/10 flex items-center justify-center">
            <SafeContent 
              content={project.name}
              className="text-portfolio-secondary text-lg font-medium text-center px-4"
              as="span"
            />
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-portfolio-dark mb-2 group-hover:text-portfolio-primary transition-colors duration-200">
              <SafeContent content={project.name} as="span" />
            </h3>
            {category && (
              <Badge variant="secondary" className="mb-3 bg-portfolio-primary/10 text-portfolio-primary border-0">
                <SafeContent content={category.name} as="span" />
              </Badge>
            )}
          </div>
        </div>
        
        <div className="text-portfolio-secondary text-sm leading-relaxed mb-4 line-clamp-3">
          <SafeContent content={project.description} as="p" />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(project.created_at).toLocaleDateString('pt-BR')}
          </span>
          
          {project.external_link && isValidUrl(project.external_link) && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hover:bg-portfolio-primary hover:text-white hover:border-portfolio-primary transition-colors duration-200"
            >
              <a
                href={project.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <span>Ver Projeto</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
