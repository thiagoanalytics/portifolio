
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Category, User } from '@/types/portfolio';

interface PortfolioContextType {
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Filters
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'Web Development', created_at: '2024-01-01' },
  { id: '2', name: 'Design', created_at: '2024-01-02' },
  { id: '3', name: 'Data Science', created_at: '2024-01-03' },
  { id: '4', name: 'Mobile Apps', created_at: '2024-01-04' },
];

const DEMO_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Uma plataforma completa de e-commerce com React e Node.js, incluindo sistema de pagamentos, gestão de produtos e dashboard administrativo.',
    image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    external_link: 'https://github.com',
    category_id: '1',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'Brand Identity System',
    description: 'Sistema completo de identidade visual para startup de tecnologia, incluindo logo, paleta de cores, tipografia e guidelines de uso.',
    image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    external_link: 'https://behance.net',
    category_id: '2',
    created_at: '2024-01-20'
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Dashboard interativo para análise de dados de vendas com visualizações em tempo real, desenvolvido com Python e Streamlit.',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
    external_link: 'https://github.com',
    category_id: '3',
    created_at: '2024-02-01'
  },
  {
    id: '4',
    name: 'Fitness Tracking App',
    description: 'Aplicativo móvel para acompanhamento de exercícios e dieta, com sincronização na nuvem e gamificação.',
    image_url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop',
    external_link: 'https://github.com',
    category_id: '4',
    created_at: '2024-02-10'
  }
];

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('portfolio_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setCurrentUser({ id: '1', username: 'admin' });
    }
  }, []);

  const addProject = (projectData: Omit<Project, 'id' | 'created_at'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...projectData } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id' | 'created_at'>) => {
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
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    setProjects(prev => prev.filter(project => project.category_id !== id));
  };

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setCurrentUser({ id: '1', username: 'admin' });
      localStorage.setItem('portfolio_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('portfolio_auth');
  };

  return (
    <PortfolioContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      isAuthenticated,
      currentUser,
      login,
      logout,
      selectedCategory,
      setSelectedCategory,
      searchTerm,
      setSearchTerm
    }}>
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
