import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="recipe/:id" element={<RecipeDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;