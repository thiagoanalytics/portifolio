
import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ProjectsGrid from './ProjectsGrid';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProjectsGrid />
      <AboutSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-portfolio-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Vamos Conversar?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Estou sempre interessado em novos projetos e oportunidades de colaboração. 
            Entre em contato e vamos criar algo incrível juntos.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="mailto:contato@portfolio.com" className="text-portfolio-accent hover:text-white transition-colors">
              Email
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-portfolio-accent hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-portfolio-accent hover:text-white transition-colors">
              GitHub
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400">
            © 2024 Portfolio. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
