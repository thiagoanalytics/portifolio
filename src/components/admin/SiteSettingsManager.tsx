
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, X } from 'lucide-react';
import type { AboutSection, ContactSection } from '@/types/portfolio';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, updateSiteSettings } = usePortfolio();
  const { toast } = useToast();
  
  const [aboutData, setAboutData] = useState<AboutSection>(siteSettings?.about || {
    title: '',
    description: '',
    skills: [],
    experience_years: 0
  });
  
  const [contactData, setContactData] = useState<ContactSection>(siteSettings?.contact || {
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    address: ''
  });
  
  const [newSkill, setNewSkill] = useState('');

  const handleSaveAbout = () => {
    updateSiteSettings({
      ...siteSettings,
      about: aboutData
    });
    toast({
      title: "Seção Sobre atualizada",
      description: "As informações foram salvas com sucesso.",
    });
  };

  const handleSaveContact = () => {
    updateSiteSettings({
      ...siteSettings,
      contact: contactData
    });
    toast({
      title: "Seção Contato atualizada", 
      description: "As informações foram salvas com sucesso.",
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !aboutData.skills.includes(newSkill.trim())) {
      setAboutData({
        ...aboutData,
        skills: [...aboutData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setAboutData({
      ...aboutData,
      skills: aboutData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-portfolio-dark">Configurações do Site</h1>
        <p className="text-portfolio-secondary mt-2">
          Gerencie as seções "Sobre" e "Contato" do seu portfólio.
        </p>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="about">Sobre</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seção Sobre</CardTitle>
              <CardDescription>
                Configure as informações que aparecerão na seção "Sobre" do seu portfólio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="about-title">Título</Label>
                <Input
                  id="about-title"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  placeholder="Ex: Sobre mim"
                />
              </div>

              <div>
                <Label htmlFor="about-description">Descrição</Label>
                <Textarea
                  id="about-description"
                  value={aboutData.description}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  placeholder="Conte um pouco sobre você, sua experiência e paixões..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="experience-years">Anos de Experiência</Label>
                <Input
                  id="experience-years"
                  type="number"
                  value={aboutData.experience_years}
                  onChange={(e) => setAboutData({ ...aboutData, experience_years: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 5"
                />
              </div>

              <div>
                <Label>Habilidades</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Digite uma habilidade"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aboutData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-portfolio-primary text-white rounded-full text-sm"
                    >
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-white hover:bg-portfolio-primary/80"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveAbout} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Seção Sobre
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seção Contato</CardTitle>
              <CardDescription>
                Configure as informações de contato que aparecerão no seu portfólio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact-email">Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact-phone">Telefone</Label>
                <Input
                  id="contact-phone"
                  value={contactData.phone || ''}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="contact-linkedin">LinkedIn</Label>
                <Input
                  id="contact-linkedin"
                  value={contactData.linkedin || ''}
                  onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/seuperfil"
                />
              </div>

              <div>
                <Label htmlFor="contact-github">GitHub</Label>
                <Input
                  id="contact-github"
                  value={contactData.github || ''}
                  onChange={(e) => setContactData({ ...contactData, github: e.target.value })}
                  placeholder="https://github.com/seuusuario"
                />
              </div>

              <div>
                <Label htmlFor="contact-address">Endereço</Label>
                <Input
                  id="contact-address"
                  value={contactData.address || ''}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  placeholder="Cidade, Estado"
                />
              </div>

              <Button onClick={handleSaveContact} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Seção Contato
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettingsManager;
