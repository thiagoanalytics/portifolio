import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePortfolio } from '@/contexts/PortfolioContext';
const Header: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm
  } = usePortfolio();
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'Todas as Categorias';
  return <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-portfolio-dark">Thiago Romualdo</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#projects" className="text-portfolio-secondary hover:text-portfolio-primary transition-colors duration-200 font-medium">
              Projetos
            </a>
            <a href="#about" className="text-portfolio-secondary hover:text-portfolio-primary transition-colors duration-200 font-medium">
              Sobre
            </a>
            <a href="#contact" className="text-portfolio-secondary hover:text-portfolio-primary transition-colors duration-200 font-medium">
              Contato
            </a>
          </nav>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar projetos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-48 h-9 bg-gray-50 border-gray-200 focus:border-portfolio-primary" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedCategoryName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                <DropdownMenuItem onClick={() => setSelectedCategory('')} className="cursor-pointer hover:bg-gray-50">
                  Todas as Categorias
                </DropdownMenuItem>
                {categories.map(category => <DropdownMenuItem key={category.id} onClick={() => setSelectedCategory(category.id)} className="cursor-pointer hover:bg-gray-50">
                    {category.name}
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;