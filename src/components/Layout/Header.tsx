import React from 'react';
import { Settings, Menu, ChevronDown } from 'lucide-react';
import Logo from '../UI/Logo';

interface HeaderProps {
  activeView: 'swap' | 'pools';
  onViewChange: (view: 'swap' | 'pools') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  return (
    <header className="w-full py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <nav className="hidden md:flex ml-8 space-x-4">
            <button 
              onClick={() => onViewChange('swap')}
              className={`transition-colors px-3 py-2 text-sm font-medium ${
                activeView === 'swap' ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Swap
            </button>
            <button 
              onClick={() => onViewChange('pools')}
              className={`transition-colors px-3 py-2 text-sm font-medium ${
                activeView === 'pools' ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Pools
            </button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-[#212429] hover:bg-[#2c2f36] transition-colors rounded-xl py-1.5 px-3 text-sm flex items-center cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>Ethereum</span>
            <ChevronDown className="ml-1 w-4 h-4 text-white/60" />
          </div>
          
          <button className="hidden md:flex bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-1.5 px-4 rounded-xl text-sm">
            Connect Wallet
          </button>
          
          <button className="p-2 rounded-lg hover:bg-[#2c2f36] transition-colors">
            <Settings className="w-5 h-5 text-white/80" />
          </button>
          
          <button className="md:hidden p-2 rounded-lg hover:bg-[#2c2f36] transition-colors">
            <Menu className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;