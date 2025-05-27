import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Heart, Share2, ChevronLeft } from 'lucide-react';
import { getRecipeById } from '../services/recipeService';
import { Recipe } from '../types/recipe';
import { useFavorites } from '../contexts/FavoritesContext';
import RecipeInstructions from '../components/RecipeInstructions';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id]);
  
  const handleFavoriteToggle = () => {
    if (!recipe) return;
    
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title || 'Check out this recipe',
        url: window.location.href,
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Recipe link copied to clipboard!');
        })
        .catch(error => {
          console.error('Error copying to clipboard:', error);
        });
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-muted rounded-lg mb-6"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-medium mb-4">Recipe not found</h2>
        <p className="mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={20} className="mr-1" />
        <span>Back</span>
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 xl:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sticky top-20">
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
              </div>
              
              <h1 className="text-3xl font-semibold mb-4">{recipe.title}</h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-muted-foreground">
                <div className="flex items-center">
                  <Clock size={18} className="mr-1" />
                  <span>{recipe.readyInMinutes} min</span>
                </div>
                
                <div className="flex items-center">
                  <Users size={18} className="mr-1" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={handleFavoriteToggle}
                  className={`btn ${
                    isFavorite(recipe.id) 
                      ? 'bg-accent/10 text-accent border border-accent/30' 
                      : 'btn-ghost'
                  }`}
                >
                  <Heart 
                    size={18} 
                    className="mr-2" 
                    fill={isFavorite(recipe.id) ? "currentColor" : "none"} 
                  />
                  {isFavorite(recipe.id) ? 'Saved' : 'Save'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="btn btn-ghost"
                >
                  <Share2 size={18} className="mr-2" />
                  Share
                </button>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">About</h2>
                <p className="text-muted-foreground" 
                   dangerouslySetInnerHTML={{ __html: recipe.summary }} />
              </div>
              
              {(recipe.cuisines?.length > 0 || recipe.diets?.length > 0) && (
                <div className="space-y-3">
                  {recipe.cuisines?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Cuisine:</h3>
                      <div className="flex flex-wrap gap-2">
                        {recipe.cuisines.map(cuisine => (
                          <span key={cuisine} className="bg-muted px-2 py-1 rounded-full text-xs">
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recipe.diets?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Diets:</h3>
                      <div className="flex flex-wrap gap-2">
                        {recipe.diets.map(diet => (
                          <span key={diet} className="bg-success/10 text-success px-2 py-1 rounded-full text-xs">
                            {diet}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-7 xl:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <RecipeInstructions recipe={recipe} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;