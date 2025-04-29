import React from 'react';
import { Twitter, Github, Disc } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="text-white/40 text-sm mb-4 md:mb-0">
          © 2025 UniSwap Interface Clone
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            <Disc className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;