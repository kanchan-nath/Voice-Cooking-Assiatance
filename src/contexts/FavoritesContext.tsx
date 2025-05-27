import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';

interface FavoritesContextType {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      if (prev.some(item => item.id === recipe.id)) {
        return prev;
      }
      return [...prev, recipe];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(recipe => recipe.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(recipe => recipe.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};