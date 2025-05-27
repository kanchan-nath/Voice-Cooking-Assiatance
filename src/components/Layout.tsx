import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { VoiceProvider } from '../contexts/VoiceContext';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <FavoritesProvider>
      <VoiceProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </VoiceProvider>
    </FavoritesProvider>
  );
};

export default Layout;