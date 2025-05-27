import React from 'react';
import { Kanban as Kanchan, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Kanchan className="text-accent mr-2" size={20} />
            <span className="text-foreground font-semibold">Sous Chef</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>© 2025 Sous Chef. Your voice-controlled cooking assistant.</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;