import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchRecipes, getPopularRecipes } from '../services/recipeService';
import { RecipePreview } from '../types/recipe';
import RecipeCard from '../components/RecipeCard';
import SearchResults from '../components/SearchResults';
import { ChefHat, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RecipePreview[]>([]);
  const [popularRecipes, setPopularRecipes] = useState<RecipePreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const location = useLocation();
  
  // Handle URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('search');
    
    if (queryParam) {
      setSearchQuery(queryParam);
      handleSearch(queryParam);
    }
  }, [location.search]);
  
  // Load popular recipes on mount
  useEffect(() => {
    const loadPopularRecipes = async () => {
      try {
        const recipes = await getPopularRecipes();
        setPopularRecipes(recipes);
      } catch (error) {
        console.error('Error loading popular recipes:', error);
      }
    };
    
    loadPopularRecipes();
  }, []);
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchRecipes(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="mb-6 inline-block bg-secondary/10 text-secondary p-3 rounded-full">
            <ChefHat size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Your Voice-Controlled Cooking Assistant</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find recipes, get step-by-step instructions, and cook hands-free with voice commands.
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for recipes, cuisines, or ingredients..."
              className="input w-full h-14 pl-5 pr-14 text-lg"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </form>
          
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('pasta');
                handleSearch('pasta');
              }}
              className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted-foreground/10"
            >
              Pasta
            </button>
            <button
              onClick={() => {
                setSearchQuery('vegetarian');
                handleSearch('vegetarian');
              }}
              className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted-foreground/10"
            >
              Vegetarian
            </button>
            <button
              onClick={() => {
                setSearchQuery('quick');
                handleSearch('quick');
              }}
              className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted-foreground/10"
            >
              Quick Meals
            </button>
            <button
              onClick={() => {
                setSearchQuery('dessert');
                handleSearch('dessert');
              }}
              className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted-foreground/10"
            >
              Desserts
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Search results */}
      <SearchResults 
        results={searchResults} 
        query={searchQuery} 
        loading={isLoading} 
      />
      
      {/* Popular recipes */}
      {!hasSearched && popularRecipes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-medium mb-6">Popular Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;