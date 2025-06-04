
import React from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import SafeContent from '@/components/security/SafeContent';

const ContactSection: React.FC = () => {
  const { siteSettings } = usePortfolio();

  // Validate external links before rendering
  const isValidUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-portfolio-dark mb-8">
            Entre em Contato
          </h2>
          <p className="text-lg text-portfolio-secondary mb-12">
            Vamos conversar sobre seu próximo projeto
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {isValidEmail(siteSettings.contact.email) && (
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <div className="bg-portfolio-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-portfolio-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-portfolio-dark">Email</h3>
                  <a 
                    href={`mailto:${siteSettings.contact.email}`} 
                    className="text-portfolio-secondary hover:text-portfolio-primary transition-colors"
                  >
                    {siteSettings.contact.email}
                  </a>
                </div>
              </div>
            )}
            
            {siteSettings.contact.phone && (
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <div className="bg-portfolio-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-portfolio-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-portfolio-dark">Telefone</h3>
                  <SafeContent 
                    content={siteSettings.contact.phone} 
                    className="text-portfolio-secondary"
                    as="span"
                  />
                </div>
              </div>
            )}
            
            {siteSettings.contact.address && (
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <div className="bg-portfolio-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-portfolio-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-portfolio-dark">Localização</h3>
                  <SafeContent 
                    content={siteSettings.contact.address} 
                    className="text-portfolio-secondary"
                    as="span"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-6">
            {siteSettings.contact.linkedin && isValidUrl(siteSettings.contact.linkedin) && (
              <Button
                variant="outline"
                asChild
                className="border-portfolio-primary text-portfolio-primary hover:bg-portfolio-primary hover:text-white"
              >
                <a
                  href={siteSettings.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            
            {siteSettings.contact.github && isValidUrl(siteSettings.contact.github) && (
              <Button
                variant="outline"
                asChild
                className="border-portfolio-primary text-portfolio-primary hover:bg-portfolio-primary hover:text-white"
              >
                <a
                  href={siteSettings.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <span>GitHub</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
