import React, { useState } from 'react';
import { Settings, Menu, ChevronDown } from 'lucide-react';
import Logo from '../UI/Logo';
import { AnimatePresence, motion } from 'framer-motion';

interface HeaderProps {
  activeView: 'swap' | 'pools';
  onViewChange: (view: 'swap' | 'pools') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');

  const networks = [
    { name: 'Ethereum', color: 'bg-green-500' },
    { name: 'Polygon', color: 'bg-yellow-500' },
    { name: 'ZkSync', color: 'bg-red-500' },
    { name: 'Radix', color: 'bg-blue-500' }
  ];

  return (
    <header className="w-full py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <nav className="hidden md:flex ml-8 space-x-4">
            <button
              onClick={() => onViewChange('swap')}
              className={`transition-colors px-3 py-2 text-sm font-medium ${activeView === 'swap' ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
            >
              Swap
            </button>
            <button
              onClick={() => onViewChange('pools')}
              className={`transition-colors px-3 py-2 text-sm font-medium ${activeView === 'pools' ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
            >
              Pools
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-full">
            <div
              className="bg-[#212429] hover:bg-[#2c2f36] justify-between w-40 transition-colors rounded-xl py-1.5 px-3 text-sm flex items-center cursor-pointer"
              onClick={() => setIsNetworkOpen(!isNetworkOpen)}
            >
              <div className={`w-2 h-2 rounded-full ${networks.find(n => n.name === selectedNetwork)?.color
                } mr-2`}></div>
              <span className='text-yellow-50'>{selectedNetwork}</span>
              <ChevronDown className={`ml-1 w-4 h-4 text-white/60 transition-transform ${isNetworkOpen ? 'rotate-180' : ''
                }`} />
            </div>
            <AnimatePresence>
              {isNetworkOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute left-0 mt-2 w-40 bg-[#212429] rounded-lg shadow-lg z-10 border border-[#2c2f36]"
                >
                  {networks.map((network, index) => (
                    <div
                      key={network.name}
                      className={`px-4 py-2 text-sm flex items-center ${network.name === "Ethereum" ? "rounded-t" : ""} ${network.name === "Radix" ? "rounded-b" : ""} cursor-pointer hover:bg-[#2c2f36]
                        }`}
                      onClick={() => {
                        setSelectedNetwork(network.name);
                        setIsNetworkOpen(false);
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${network.color} mr-2`}></div>
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (0.3 + (index + 1) * 0.1) }}
                        className="text-white/90">{network.name}
                      </motion.span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="hidden w-full md:flex bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-1.5 px-4 rounded-xl text-sm">
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