import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Project, Category, SiteSettings, ProjectFormData, CategoryFormData } from '@/types/portfolio';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      console.log('Fetching site settings from Supabase...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
      
      console.log('Site settings fetched:', data);
      
      // Transform data to match SiteSettings interface
      const settings: SiteSettings = {
        about: {
          title: data.about_title || '',
          description: data.about_description || '',
          skills: Array.isArray(data.about_skills) 
            ? (data.about_skills as string[])
            : [],
          experience_years: data.experience_years || 0
        },
        contact: {
          email: data.contact_email || '',
          phone: data.contact_phone || undefined,
          linkedin: data.contact_linkedin || undefined,
          github: data.contact_github || undefined,
          address: data.contact_address || undefined
        }
      };
      
      console.log('Transformed site settings:', settings);
      return settings;
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch to ensure fresh data
  });
};

export const useAddProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: ProjectFormData) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...projectData }: { id: string } & Partial<ProjectFormData>) => {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData: CategoryFormData) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...categoryData }: { id: string } & Partial<CategoryFormData>) => {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      console.log('Updating site settings:', settings);
      
      const updateData = {
        about_title: settings.about.title,
        about_description: settings.about.description,
        about_skills: settings.about.skills,
        experience_years: settings.about.experience_years,
        contact_email: settings.contact.email,
        contact_phone: settings.contact.phone,
        contact_linkedin: settings.contact.linkedin,
        contact_github: settings.contact.github,
        contact_address: settings.contact.address,
        updated_at: new Date().toISOString()
      };
      
      console.log('Update data being sent:', updateData);
      
      const { data, error } = await supabase
        .from('site_settings')
        .update(updateData)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }
      
      console.log('Site settings updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Invalidating site_settings cache...');
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      queryClient.refetchQueries({ queryKey: ['site_settings'] });
    },
  });
};
