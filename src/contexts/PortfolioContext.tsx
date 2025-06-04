
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Project, Category, User, SiteSettings } from '@/types/portfolio';
import { validateInput, sanitizeHTML, ValidationRules, SessionManager } from '@/utils/security';

interface PortfolioContextType {
  // Projects
  projects: Project[];
  categories: Category[];
  
  // Authentication
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Project management
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => boolean;
  updateProject: (id: string, project: Partial<Project>) => boolean;
  deleteProject: (id: string) => void;
  
  // Category management
  addCategory: (category: Omit<Category, 'id'>) => boolean;
  updateCategory: (id: string, category: Partial<Category>) => boolean;
  deleteCategory: (id: string) => void;
  
  // Site settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => boolean;
  
  // Search and filter
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Mock data - Sanitized for security
const mockCategories: Category[] = [
  { id: '1', name: sanitizeHTML('Web Development'), created_at: '2024-01-01' },
  { id: '2', name: sanitizeHTML('Mobile Apps'), created_at: '2024-01-02' },
  { id: '3', name: sanitizeHTML('Design UI/UX'), created_at: '2024-01-03' },
  { id: '4', name: sanitizeHTML('Data Science'), created_at: '2024-01-04' },
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: sanitizeHTML('E-commerce Platform'),
    description: sanitizeHTML('Uma plataforma completa de e-commerce desenvolvida com React e Node.js, incluindo sistema de pagamento e gestão de estoque.'),
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    external_link: 'https://github.com/exemplo/ecommerce',
    category_id: '1',
    created_at: '2024-01-15',
    category: mockCategories[0]
  },
  {
    id: '2',
    name: sanitizeHTML('App de Delivery'),
    description: sanitizeHTML('Aplicativo mobile para delivery de comida com geolocalização, pagamento integrado e sistema de avaliações.'),
    image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    external_link: 'https://github.com/exemplo/delivery-app',
    category_id: '2',
    created_at: '2024-01-20',
    category: mockCategories[1]
  },
  {
    id: '3',
    name: sanitizeHTML('Dashboard Analytics'),
    description: sanitizeHTML('Interface moderna para visualização de dados com gráficos interativos e relatórios personalizáveis.'),
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    external_link: 'https://github.com/exemplo/dashboard',
    category_id: '3',
    created_at: '2024-01-25',
    category: mockCategories[2]
  },
  {
    id: '4',
    name: sanitizeHTML('Sistema de Recomendação'),
    description: sanitizeHTML('Algoritmo de machine learning para recomendação de produtos usando Python e TensorFlow.'),
    image_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop',
    external_link: 'https://github.com/exemplo/ml-recommendation',
    category_id: '4',
    created_at: '2024-02-01',
    category: mockCategories[3]
  },
];

const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@portfolio.com'
};

const initialSiteSettings: SiteSettings = {
  about: {
    title: sanitizeHTML('Sobre Mim'),
    description: sanitizeHTML('Sou um desenvolvedor apaixonado por criar soluções inovadoras e experiências digitais únicas. Com mais de 5 anos de experiência em desenvolvimento web e mobile, trabalho com as mais modernas tecnologias do mercado.'),
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'UI/UX Design'],
    experience_years: 5
  },
  contact: {
    email: 'contato@portfolio.com',
    phone: '(11) 99999-9999',
    linkedin: 'https://linkedin.com/in/portfolio',
    github: 'https://github.com/portfolio',
    address: sanitizeHTML('São Paulo, SP')
  }
};

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);

  // Check for existing session on mount
  useEffect(() => {
    const session = SessionManager.getSession();
    if (session && session.isValid) {
      setIsAuthenticated(true);
      setCurrentUser(mockUser);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Validate credentials format first
    const usernameValidation = validateInput(username, { minLength: 3, maxLength: 50 });
    const passwordValidation = validateInput(password, { minLength: 6, maxLength: 100 });
    
    if (!usernameValidation.isValid || !passwordValidation.isValid) {
      return false;
    }

    // Sanitize inputs
    const cleanUsername = sanitizeHTML(username.trim());
    const cleanPassword = sanitizeHTML(password.trim());

    // Simple authentication (in real app, this would be handled by backend with proper hashing)
    if (cleanUsername === 'admin' && cleanPassword === 'admin123') {
      setIsAuthenticated(true);
      setCurrentUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    SessionManager.clearSession();
  };

  const validateProjectData = (projectData: any): boolean => {
    if (!projectData.name || !projectData.description || !projectData.category_id) {
      return false;
    }

    const nameValidation = validateInput(projectData.name, ValidationRules.PROJECT_NAME);
    const descValidation = validateInput(projectData.description, ValidationRules.PROJECT_DESCRIPTION);
    
    if (projectData.external_link) {
      const urlValidation = validateInput(projectData.external_link, ValidationRules.URL);
      if (!urlValidation.isValid) return false;
    }

    return nameValidation.isValid && descValidation.isValid;
  };

  const addProject = (projectData: Omit<Project, 'id' | 'created_at'>): boolean => {
    if (!isAuthenticated || !validateProjectData(projectData)) {
      return false;
    }

    const sanitizedProject: Project = {
      id: Date.now().toString(),
      name: sanitizeHTML(projectData.name),
      description: sanitizeHTML(projectData.description),
      image_url: projectData.image_url, // URLs are validated, not sanitized
      external_link: projectData.external_link,
      category_id: projectData.category_id,
      created_at: new Date().toISOString(),
      category: categories.find(cat => cat.id === projectData.category_id)
    };
    
    setProjects(prev => [sanitizedProject, ...prev]);
    return true;
  };

  const updateProject = (id: string, projectData: Partial<Project>): boolean => {
    if (!isAuthenticated || !validateProjectData({...projectData, category_id: projectData.category_id || 'temp'})) {
      return false;
    }

    setProjects(prev => prev.map(project => {
      if (project.id === id) {
        const updated = { 
          ...project, 
          ...projectData,
          name: projectData.name ? sanitizeHTML(projectData.name) : project.name,
          description: projectData.description ? sanitizeHTML(projectData.description) : project.description
        };
        if (projectData.category_id) {
          updated.category = categories.find(cat => cat.id === projectData.category_id);
        }
        return updated;
      }
      return project;
    }));
    return true;
  };

  const deleteProject = (id: string) => {
    if (!isAuthenticated) return;
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const validateCategoryData = (categoryData: any): boolean => {
    if (!categoryData.name) return false;
    const nameValidation = validateInput(categoryData.name, ValidationRules.CATEGORY_NAME);
    return nameValidation.isValid;
  };

  const addCategory = (categoryData: Omit<Category, 'id'>): boolean => {
    if (!isAuthenticated || !validateCategoryData(categoryData)) {
      return false;
    }

    const sanitizedCategory: Category = {
      id: Date.now().toString(),
      name: sanitizeHTML(categoryData.name),
      created_at: new Date().toISOString()
    };
    
    setCategories(prev => [...prev, sanitizedCategory]);
    return true;
  };

  const updateCategory = (id: string, categoryData: Partial<Category>): boolean => {
    if (!isAuthenticated || !validateCategoryData(categoryData)) {
      return false;
    }

    setCategories(prev => prev.map(category => 
      category.id === id 
        ? { 
            ...category, 
            name: categoryData.name ? sanitizeHTML(categoryData.name) : category.name 
          }
        : category
    ));
    
    // Update projects that reference this category
    setProjects(prev => prev.map(project => {
      if (project.category_id === id) {
        return {
          ...project,
          category: categories.find(cat => cat.id === id) || project.category
        };
      }
      return project;
    }));
    return true;
  };

  const deleteCategory = (id: string) => {
    if (!isAuthenticated) return;
    setCategories(prev => prev.filter(category => category.id !== id));
    // Remove category reference from projects
    setProjects(prev => prev.map(project => 
      project.category_id === id 
        ? { ...project, category_id: '', category: undefined }
        : project
    ));
  };

  const updateSiteSettings = (settings: SiteSettings): boolean => {
    if (!isAuthenticated) return false;

    // Validate and sanitize site settings
    const sanitizedSettings: SiteSettings = {
      about: {
        title: sanitizeHTML(settings.about.title),
        description: sanitizeHTML(settings.about.description),
        skills: settings.about.skills.map(skill => sanitizeHTML(skill)),
        experience_years: Math.max(0, Math.min(50, settings.about.experience_years)) // Clamp between 0-50
      },
      contact: {
        email: settings.contact.email, // Email validation handled separately
        phone: settings.contact.phone ? sanitizeHTML(settings.contact.phone) : undefined,
        linkedin: settings.contact.linkedin, // URL validation handled separately
        github: settings.contact.github, // URL validation handled separately
        address: settings.contact.address ? sanitizeHTML(settings.contact.address) : undefined
      }
    };

    setSiteSettings(sanitizedSettings);
    return true;
  };

  // Secure search term handling
  const setSecureSearchTerm = (term: string) => {
    const sanitizedTerm = sanitizeHTML(term);
    // Limit search term length to prevent abuse
    if (sanitizedTerm.length <= 100) {
      setSearchTerm(sanitizedTerm);
    }
  };

  const value: PortfolioContextType = {
    projects,
    categories,
    isAuthenticated,
    currentUser,
    login,
    logout,
    addProject,
    updateProject,
    deleteProject,
    addCategory,
    updateCategory,
    deleteCategory,
    siteSettings,
    updateSiteSettings,
    searchTerm,
    setSearchTerm: setSecureSearchTerm,
    selectedCategory,
    setSelectedCategory,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
