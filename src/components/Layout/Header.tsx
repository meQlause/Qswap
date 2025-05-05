import React, { useState } from 'react';
import { Menu, ChevronDown, X } from 'lucide-react';
import Logo from '../UI/Logo';
import { AnimatePresence, motion } from 'framer-motion';
import ConnectButton from '../UI/ConnectButton';
import { useWallet } from '../../context/WalletContext';

interface HeaderProps {
  activeView: 'swap' | 'pools' | 'create-token';
  onViewChange: (view: 'swap' | 'pools' | 'create-token') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const { account, disconnectWallet } = useWallet();
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const networks = [
    { name: 'Ethereum', color: 'bg-green-500' },
    { name: 'Polygon', color: 'bg-yellow-500' },
    { name: 'ZkSync', color: 'bg-red-500' },
    { name: 'Radix', color: 'bg-blue-500' }
  ];

  const handleViewChange = (view: 'swap' | 'pools' | 'create-token') => {
    onViewChange(view);
  }

  return (
    <>
      <header className="w-full py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="block md:hidden p-2 rounded-lg hover:bg-[#2c2f36] transition-colors mr-4"
            >
              <Menu className="w-5 h-5 text-white/80" />
            </button>
            <Logo />
            <nav className="hidden md:flex ml-8 space-x-4">
              <button
                onClick={() => handleViewChange('swap')}
                className={`transition-colors px-3 py-2 text-sm font-medium ${activeView === 'swap' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
              >
                Swap
              </button>
              <button
                onClick={() => handleViewChange('pools')}
                className={`transition-colors px-3 py-2 text-sm font-medium ${activeView === 'pools' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
              >
                Pools
              </button>
              <button
                onClick={() => handleViewChange('create-token')}
                className={`transition-colors px-3 py-2 text-sm font-medium ${activeView === 'create-token' ? 'text-white' : 'text-white/60 hover:text-white'}`}
              >
                Create Token
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
            {account ?
              <div className='md:block hidden bg-pink-500 hover:bg-pink-400 transition-colors p-1.5 rounded-xl'>
                <ConnectButton />
              </div> : ''
            }
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 block md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-0 left-0 h-full w-64 bg-[#1e2025] z-50 shadow-xl block md:hidden"
            >
              <div className="p-4 border-b border-[#2c2f36]">
                <div className="flex items-center justify-between">
                  <Logo />
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-[#2c2f36] transition-colors"
                  >
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>
              </div>

              <nav className="p-4">
                <button
                  onClick={() => {
                    onViewChange('swap');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeView === 'swap' ? 'bg-[#2c2f36] text-white' : 'text-white/60 hover:bg-[#2c2f36] hover:text-white'
                    }`}
                >
                  Swap
                </button>
                <button
                  onClick={() => {
                    onViewChange('pools');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeView === 'pools' ? 'bg-[#2c2f36] text-white' : 'text-white/60 hover:bg-[#2c2f36] hover:text-white'
                    }`}
                >
                  My Pools
                </button>
                <button
                  onClick={() => {
                    onViewChange('create-token');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeView === 'create-token' ? 'bg-[#2c2f36] text-white' : 'text-white/60 hover:bg-[#2c2f36] hover:text-white'}`}
                >
                  Create Token
                </button>

                {
                  account ? (
                    <button
                      onClick={disconnectWallet}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-white/60 hover:bg-[#2c2f36] hover:text-white'
                        }`}
                    >
                      Disconnect
                    </button>
                  ) : ''
                }
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;