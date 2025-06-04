
import React from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Badge } from '@/components/ui/badge';
import SafeContent from '@/components/security/SafeContent';

const AboutSection: React.FC = () => {
  const { siteSettings } = usePortfolio();

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-portfolio-dark mb-8">
            <SafeContent content={siteSettings.about.title} as="span" />
          </h2>
          
          <div className="text-lg text-portfolio-secondary leading-relaxed mb-8">
            <SafeContent content={siteSettings.about.description} as="p" />
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-portfolio-dark mb-4">
              Tecnologias
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {siteSettings.about.skills.map((skill, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-portfolio-primary/10 text-portfolio-primary border-0 px-4 py-2"
                >
                  <SafeContent content={skill} as="span" />
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="text-portfolio-secondary">
            <span className="font-semibold text-portfolio-primary">
              {siteSettings.about.experience_years}+ anos
            </span> de experiência em desenvolvimento
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
