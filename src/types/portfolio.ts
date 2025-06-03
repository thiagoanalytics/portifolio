
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
