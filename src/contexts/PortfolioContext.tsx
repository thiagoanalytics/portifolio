
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Project, Category, User, SiteSettings } from '@/types/portfolio';

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
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Category management
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Site settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;
  
  // Search and filter
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Web Development', created_at: '2024-01-01' },
  { id: '2', name: 'Mobile Apps', created_at: '2024-01-02' },
  { id: '3', name: 'Design UI/UX', created_at: '2024-01-03' },
  { id: '4', name: 'Data Science', created_at: '2024-01-04' },
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Uma plataforma completa de e-commerce desenvolvida com React e Node.js, incluindo sistema de pagamento e gestão de estoque.',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    external_link: 'https://github.com/exemplo/ecommerce',
    category_id: '1',
    created_at: '2024-01-15',
    category: mockCategories[0]
  },
  {
    id: '2',
    name: 'App de Delivery',
    description: 'Aplicativo mobile para delivery de comida com geolocalização, pagamento integrado e sistema de avaliações.',
    image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    external_link: 'https://github.com/exemplo/delivery-app',
    category_id: '2',
    created_at: '2024-01-20',
    category: mockCategories[1]
  },
  {
    id: '3',
    name: 'Dashboard Analytics',
    description: 'Interface moderna para visualização de dados com gráficos interativos e relatórios personalizáveis.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    external_link: 'https://github.com/exemplo/dashboard',
    category_id: '3',
    created_at: '2024-01-25',
    category: mockCategories[2]
  },
  {
    id: '4',
    name: 'Sistema de Recomendação',
    description: 'Algoritmo de machine learning para recomendação de produtos usando Python e TensorFlow.',
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
    title: 'Sobre Mim',
    description: 'Sou um desenvolvedor apaixonado por criar soluções inovadoras e experiências digitais únicas. Com mais de 5 anos de experiência em desenvolvimento web e mobile, trabalho com as mais modernas tecnologias do mercado.',
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'UI/UX Design'],
    experience_years: 5
  },
  contact: {
    email: 'contato@portfolio.com',
    phone: '(11) 99999-9999',
    linkedin: 'https://linkedin.com/in/portfolio',
    github: 'https://github.com/portfolio',
    address: 'São Paulo, SP'
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

  const login = (username: string, password: string): boolean => {
    // Simple authentication (in real app, this would be handled by backend)
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setCurrentUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'created_at'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      category: categories.find(cat => cat.id === projectData.category_id)
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === id) {
        const updated = { ...project, ...projectData };
        if (projectData.category_id) {
          updated.category = categories.find(cat => cat.id === projectData.category_id);
        }
        return updated;
      }
      return project;
    }));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...categoryData } : category
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
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    // Remove category reference from projects
    setProjects(prev => prev.map(project => 
      project.category_id === id 
        ? { ...project, category_id: '', category: undefined }
        : project
    ));
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
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
    setSearchTerm,
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
