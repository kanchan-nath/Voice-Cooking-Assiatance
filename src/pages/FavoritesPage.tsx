import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookmarkX } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import RecipeCard from '../components/RecipeCard';

const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Your Favorite Recipes</h1>
      
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-muted rounded-lg"
        >
          <BookmarkX size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">
            Save your favorite recipes to access them quickly later.
          </p>
          <Link to="/" className="btn btn-primary">
            Find Recipes
          </Link>
        </motion.div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
          
          {favorites.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to remove all favorites?')) {
                    favorites.forEach(recipe => removeFavorite(recipe.id));
                  }
                }}
                className="btn btn-ghost text-error"
              >
                Clear All Favorites
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;