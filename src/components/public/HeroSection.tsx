
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-portfolio-primary/5 via-transparent to-portfolio-accent/5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-portfolio-dark mb-6 animate-fade-in">
            Portfolio
            <span className="text-portfolio-primary block mt-2">Criativo</span>
          </h1>
          
          <p className="text-xl text-portfolio-secondary max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up">
            Bem-vindo ao meu espaço criativo. Aqui você encontrará uma coleção cuidadosa dos meus projetos mais recentes, 
            cada um representando uma jornada única de inovação e design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="lg" 
              onClick={scrollToProjects}
              className="bg-portfolio-primary hover:bg-portfolio-primary/90 text-white px-8 py-3 text-lg"
            >
              Explorar Projetos
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToAbout}
              className="border-portfolio-primary text-portfolio-primary hover:bg-portfolio-primary hover:text-white px-8 py-3 text-lg"
            >
              Sobre Mim
            </Button>
          </div>
          
          <div className="animate-bounce">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToProjects}
              className="text-portfolio-secondary hover:text-portfolio-primary"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-portfolio-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-portfolio-accent/10 rounded-full blur-xl"></div>
    </section>
  );
};

export default HeroSection;
