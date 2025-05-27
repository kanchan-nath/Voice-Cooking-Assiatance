import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <ChefHat size={64} className="mx-auto mb-6 text-muted-foreground" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
        Oops! We couldn't find the recipe you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;