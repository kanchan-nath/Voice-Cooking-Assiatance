import React from 'react';
import { RecipePreview } from '../types/recipe';
import RecipeCard from './RecipeCard';
import { motion } from 'framer-motion';

interface SearchResultsProps {
  results: RecipePreview[];
  query: string;
  loading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query, loading }) => {
  if (loading) {
    return (
      <div className="py-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-block"
        >
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-48 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center"
      >
        <h2 className="text-xl font-medium mb-2">No recipes found</h2>
        <p className="text-muted-foreground">
          We couldn't find any recipes matching "{query}". Try a different search term.
        </p>
      </motion.div>
    );
  }

  if (query && results.length > 0) {
    return (
      <div className="py-6">
        <h2 className="text-xl font-medium mb-6">Search results for "{query}"</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SearchResults;