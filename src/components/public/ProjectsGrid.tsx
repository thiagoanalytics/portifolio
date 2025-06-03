
import React, { useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { usePortfolio } from '@/contexts/PortfolioContext';

const ProjectsGrid: React.FC = () => {
  const { projects, selectedCategory, searchTerm, categories } = usePortfolio();

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = !selectedCategory || project.category_id === selectedCategory;
      const matchesSearch = !searchTerm || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchTerm]);

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name;

  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-portfolio-dark mb-4">
            {selectedCategoryName ? `Projetos - ${selectedCategoryName}` : 'Meus Projetos'}
          </h2>
          <p className="text-portfolio-secondary max-w-2xl mx-auto">
            {searchTerm 
              ? `Resultados da busca por "${searchTerm}" (${filteredProjects.length} projeto${filteredProjects.length !== 1 ? 's' : ''} encontrado${filteredProjects.length !== 1 ? 's' : ''})`
              : 'Explore meu trabalho e descubra soluções criativas e inovadoras.'
            }
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">📂</span>
              </div>
              <h3 className="text-lg font-medium text-portfolio-dark mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-portfolio-secondary">
                {searchTerm 
                  ? 'Tente ajustar sua busca ou filtros para encontrar projetos.'
                  : 'Não há projetos nesta categoria no momento.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsGrid;
