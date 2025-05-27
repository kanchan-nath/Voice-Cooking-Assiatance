import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Kanban as Kanchan, Search, Menu, X, Heart, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-accent">
          <Kanchan size={28} />
          <span className="text-xl font-semibold">Sous Chef</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="input w-64"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>

          <Link to="/favorites" className="btn btn-ghost" aria-label="Favorites">
            <Heart size={20} className="mr-1" />
            <span>Favorites</span>
          </Link>

          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost p-2" 
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <button 
          className="md:hidden btn btn-ghost p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-4 px-4">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="input w-full"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>

          <div className="flex flex-col space-y-2">
            <Link 
              to="/favorites" 
              className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart size={20} />
              <span>Favorites</span>
            </Link>
            
            <button 
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }} 
              className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md text-left"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;