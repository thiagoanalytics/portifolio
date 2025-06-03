
export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  external_link?: string;
  category_id: string;
  category?: Category;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  image_url?: string;
  external_link?: string;
  category_id: string;
}

export interface CategoryFormData {
  name: string;
}

export interface AboutSection {
  title: string;
  description: string;
  skills: string[];
  experience_years: number;
}

export interface ContactSection {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  address?: string;
}

export interface SiteSettings {
  about: AboutSection;
  contact: ContactSection;
}
