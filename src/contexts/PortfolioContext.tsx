import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Project, Category, User, SiteSettings } from '@/types/portfolio';
import { validateInput, sanitizeHTML, ValidationRules, SessionManager } from '@/utils/security';
import { 
  useCategories, 
  useProjects, 
  useSiteSettings,
  useAddProject,
  useUpdateProject,
  useDeleteProject,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
  useUpdateSiteSettings
} from '@/hooks/useSupabaseData';

interface PortfolioContextType {
  // Data
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
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@portfolio.com'
};

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Supabase hooks
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: siteSettings, isLoading: settingsLoading, error: settingsError } = useSiteSettings();
  
  // Mutations
  const addProjectMutation = useAddProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  
  const addCategoryMutation = useAddCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  
  const updateSiteSettingsMutation = useUpdateSiteSettings();

  // Default site settings
  const defaultSiteSettings: SiteSettings = {
    about: {
      title: 'Sobre Mim',
      description: 'Adicione aqui sua descrição pessoal...',
      skills: ['React', 'TypeScript', 'Node.js'],
      experience_years: 2
    },
    contact: {
      email: 'seu@email.com'
    }
  };

  const login = (username: string, password: string): boolean => {
    const usernameValidation = validateInput(username, { minLength: 3, maxLength: 50 });
    const passwordValidation = validateInput(password, { minLength: 6, maxLength: 100 });
    
    if (!usernameValidation.isValid || !passwordValidation.isValid) {
      return false;
    }

    const cleanUsername = sanitizeHTML(username.trim());
    const cleanPassword = sanitizeHTML(password.trim());

    // ALTERE AQUI: Modifique o usuário e senha conforme necessário
    if (cleanUsername === 'admin' && cleanPassword === 'admin123') {
      setIsAuthenticated(true);
      setCurrentUser(mockUser);
      SessionManager.setSecureSession('admin', 3600000); // Corrigido: usar setSecureSession
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    SessionManager.clearSession();
  };

  const addProject = (projectData: Omit<Project, 'id' | 'created_at'>) => {
    if (!isAuthenticated) return;
    
    const formattedData = {
      name: projectData.name,
      description: projectData.description,
      image_url: projectData.image_url || null,
      external_link: projectData.external_link || null,
      category_id: projectData.category_id
    };
    
    addProjectMutation.mutate(formattedData);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    if (!isAuthenticated) return;
    updateProjectMutation.mutate({ id, ...projectData });
  };

  const deleteProject = (id: string) => {
    if (!isAuthenticated) return;
    deleteProjectMutation.mutate(id);
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    if (!isAuthenticated) return;
    addCategoryMutation.mutate({ name: categoryData.name });
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    if (!isAuthenticated) return;
    updateCategoryMutation.mutate({ id, ...categoryData });
  };

  const deleteCategory = (id: string) => {
    if (!isAuthenticated) return;
    deleteCategoryMutation.mutate(id);
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    if (!isAuthenticated) return;
    updateSiteSettingsMutation.mutate(settings);
  };

  const setSecureSearchTerm = (term: string) => {
    const sanitizedTerm = sanitizeHTML(term);
    if (sanitizedTerm.length <= 100) {
      setSearchTerm(sanitizedTerm);
    }
  };

  const isLoading = categoriesLoading || projectsLoading || settingsLoading;
  const error = categoriesError?.message || projectsError?.message || settingsError?.message || null;

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
    siteSettings: siteSettings || defaultSiteSettings,
    updateSiteSettings,
    searchTerm,
    setSearchTerm: setSecureSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
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
