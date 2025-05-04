import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import SwapCard from './components/Swap/SwapCard';
import PoolsCard from './components/Pools/PoolsCard';
import LoadingScreen from './components/Loading/LoadingScreen';

function App() {
  const [activeView, setActiveView] = useState<'swap' | 'pools'>('swap');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-[#191b1f] to-[#212429] flex flex-col">
      <Header activeView={activeView} onViewChange={setActiveView} />

      <main className="relative flex-1 overflow-hidden flex flex-col items-center justify-center p-4">
        <div className={`transform transition-all duration-500 w-full ${activeView === 'swap' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'}`}>
          <SwapCard />
        </div>
        <div className={`transform transition-all duration-500 w-full ${activeView === 'pools' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute'}`}>
          <PoolsCard />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App