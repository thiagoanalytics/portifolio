
import React from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const ContactSection: React.FC = () => {
  const { siteSettings } = usePortfolio();

  if (!siteSettings?.contact) {
    return null;
  }

  const { email, phone, linkedin, github, address } = siteSettings.contact;

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: email,
      link: `mailto:${email}`,
      show: email
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: phone,
      link: `tel:${phone}`,
      show: phone
    },
    {
      icon: MapPin,
      label: 'Localização',
      value: address,
      link: null,
      show: address
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'LinkedIn',
      link: linkedin,
      show: linkedin
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'GitHub',
      link: github,
      show: github
    }
  ].filter(item => item.show);

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-portfolio-dark mb-4">
            Contato
          </h2>
          <p className="text-lg text-portfolio-secondary max-w-2xl mx-auto">
            Estou sempre interessado em novos projetos e oportunidades. 
            Entre em contato e vamos conversar!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-portfolio-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-portfolio-dark">{item.label}</h3>
                  <p className="text-portfolio-secondary">{item.value}</p>
                </div>
              </div>
            );

            return item.link ? (
              <a
                key={index}
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block hover:scale-105 transition-transform"
              >
                {content}
              </a>
            ) : (
              <div key={index}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
