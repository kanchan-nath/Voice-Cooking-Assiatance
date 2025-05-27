import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { RecipePreview } from '../types/recipe';
import { useFavorites } from '../contexts/FavoritesContext';

interface RecipeCardProps {
  recipe: RecipePreview;
  index?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index = 0 }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(recipe.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentlyFavorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe as any); // Type assertion since RecipePreview is subset of Recipe
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="h-full"
    >
      <Link to={`/recipe/${recipe.id}`} className="block h-full">
        <div className="card h-full hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
          <div className="relative h-48 mb-4 overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <button
              onClick={handleFavoriteToggle}
              className={`absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm
                ${isCurrentlyFavorite ? 'text-accent' : 'text-foreground/60 hover:text-foreground'}`}
              aria-label={isCurrentlyFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={20} fill={isCurrentlyFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="flex-grow flex flex-col">
            <h3 className="font-medium text-lg mb-2 line-clamp-2">{recipe.title}</h3>
            
            {(recipe.readyInMinutes || recipe.servings) && (
              <div className="mt-auto flex items-center text-sm text-muted-foreground pt-2">
                {recipe.readyInMinutes && (
                  <div className="flex items-center mr-4">
                    <Clock size={16} className="mr-1" />
                    <span>{recipe.readyInMinutes} min</span>
                  </div>
                )}
                
                {recipe.servings && (
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>{recipe.servings} servings</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;