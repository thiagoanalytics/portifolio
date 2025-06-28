
-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de projetos
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  external_link TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de configurações do site
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_title TEXT DEFAULT '',
  about_description TEXT DEFAULT '',
  about_skills JSONB DEFAULT '[]'::jsonb,
  experience_years INTEGER DEFAULT 0,
  contact_email TEXT DEFAULT '',
  contact_phone TEXT,
  contact_linkedin TEXT,
  contact_github TEXT,
  contact_address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir configurações padrão do site (apenas se não existir)
INSERT INTO public.site_settings (
  about_title,
  about_description,
  about_skills,
  experience_years,
  contact_email
) 
SELECT 
  'Sobre Mim',
  'Desenvolvedor apaixonado por criar soluções digitais inovadoras.',
  '["JavaScript", "React", "Node.js", "TypeScript"]'::jsonb,
  5,
  'contato@exemplo.com'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Inserir algumas categorias padrão (apenas se não existirem)
INSERT INTO public.categories (name) 
SELECT * FROM unnest(ARRAY['Web Development', 'Mobile Apps', 'Design', 'Backend'])
WHERE NOT EXISTS (SELECT 1 FROM public.categories);

-- Habilitar Row Level Security (RLS) para todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para permitir acesso público (já que não há autenticação de usuários)
-- Permitir leitura pública para categorias
CREATE POLICY "Allow public read access for categories" ON public.categories
  FOR SELECT USING (true);

-- Permitir todas as operações para categorias (para admin)
CREATE POLICY "Allow all operations for categories" ON public.categories
  FOR ALL USING (true) WITH CHECK (true);

-- Permitir leitura pública para projetos
CREATE POLICY "Allow public read access for projects" ON public.projects
  FOR SELECT USING (true);

-- Permitir todas as operações para projetos (para admin)
CREATE POLICY "Allow all operations for projects" ON public.projects
  FOR ALL USING (true) WITH CHECK (true);

-- Permitir leitura pública para configurações do site
CREATE POLICY "Allow public read access for site_settings" ON public.site_settings
  FOR SELECT USING (true);

-- Permitir todas as operações para configurações do site (para admin)
CREATE POLICY "Allow all operations for site_settings" ON public.site_settings
  FOR ALL USING (true) WITH CHECK (true);
