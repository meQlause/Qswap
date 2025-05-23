import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import SwapCard from './components/Swap/SwapCard';
import PoolsCard from './components/Pools/Pool';
import LoadingScreen from './components/Loading/LoadingScreen';
import { WalletProvider } from './context/WalletContext';
import CreateToken from './components/Token/Token';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

// Add styles to the global stylesheet
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #211429;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #2c2f36;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #31353e;
  }
`;
document.head.appendChild(style);

const WelcomeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#212429] rounded-2xl p-6 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-yellow-500" />

          <h3 className="text-xl font-semibold text-yellow-500">
            Welcome to Qswap!
          </h3>

          <div className="space-y-3 text-white/80">
            <p>We've deployed our contract on Mega Testnet!</p>
            <p>To use our features, please make sure to:</p>
            <ol className="list-decimal list-inside text-left space-y-2">
              <li>Open MetaMask</li>
              <li>Switch to Mega Testnet</li>
              <li>If Mega Testnet is not added, add it with these details:</li>
            </ol>
            <div className="bg-[#282c34] rounded-xl p-4 mt-2 text-left">
              <p className="text-white/60 text-sm mb-1">Network Details:</p>
              <p className="text-white text-sm">Network Name: Mega Testnet</p>
              <p className="text-white text-sm">RPC URL: https://rpc.megatestnet.com</p>
              <p className="text-white text-sm">Chain ID: 1337</p>
              <p className="text-white text-sm">Currency Symbol: MEGA</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-xl font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  const [activeView, setActiveView] = useState<'swap' | 'pools' | 'create-token'>('swap');
  const [slideBehavior, setSlideBehavior] = useState<string>('opacity-0 absolute');
  const [loading, setLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeView === 'create-token') setSlideBehavior('-translate-x-full opacity-0 absolute');
    if (activeView === 'swap') setSlideBehavior('translate-x-full opacity-0 absolute');
  }, [activeView]);

  useEffect(() => {
    const styles = `
      .custom-scrollbar {
        /* Add padding around content so scrollbar is more distant */
        padding-right: 8px; /* Adjust this as needed */
      }

      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: #212429;
        border-radius: 4px;
        padding: 2px; /* Adds space around the thumb */
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #282c34;
        border-radius: 4px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #31353e;
      }
    `;
    if (typeof document !== 'undefined') {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      return () => {
        document.head.removeChild(styleSheet);
      };
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#191b1f] to-[#212429] flex flex-col">
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
        />
        <Header activeView={activeView} onViewChange={setActiveView} />

        <main className="relative flex-1 overflow-hidden flex flex-col items-center justify-center p-4">
          <div className={`transform transition-all duration-500 w-full ${activeView === 'swap' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'}`}>
            <SwapCard />
          </div>
          <div className={`transform transition-all duration-500 w-full ${activeView === 'pools' ? 'translate-x-0 opacity-100' : slideBehavior}`}>
            <PoolsCard />
          </div>
          <div className={`transform transition-all duration-500 w-full ${activeView === 'create-token' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute'}`}>
            <CreateToken />
          </div>
        </main>

        <Footer />
      </div >
    </WalletProvider >
  );
}

export default App