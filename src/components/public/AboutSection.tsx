
import React from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const AboutSection: React.FC = () => {
  const { siteSettings } = usePortfolio();

  if (!siteSettings?.about) {
    return null;
  }

  const { title, description, skills, experience_years } = siteSettings.about;

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-portfolio-dark mb-4">
            {title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-portfolio-secondary leading-relaxed mb-6">
              {description}
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-portfolio-dark mb-3">
                Experiência
              </h3>
              <p className="text-portfolio-secondary">
                {experience_years} {experience_years === 1 ? 'ano' : 'anos'} de experiência
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-portfolio-dark mb-4">
              Habilidades
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-portfolio-primary text-white rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
