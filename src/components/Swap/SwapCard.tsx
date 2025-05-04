import React, { useState } from 'react';
import { Settings, ArrowDown, Info, X } from 'lucide-react';
import { motion, AnimatePresence, number } from "framer-motion";
import TokenSelector from './TokenSelector';
import SwapSettings from './SwapSettings';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const SwapCard: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [amountToken1, setAmountToken1] = useState<number>(0);
  const [token1, setToken1] = useState('ETH');
  const [amountToken2, setAmountToken2] = useState<number>(0);
  const [token2, setToken2] = useState('USDC');

  const handleSwapTokens = () => {
    const tempToken = token1;
    setToken1(token2);
    setToken2(tempToken);

    const tempAmount = amountToken1;
    setAmountToken1(amountToken2);
    setAmountToken2(tempAmount);
  };



  return (
    <div className="w-full max-w-md mx-auto bg-[#191b1f] rounded-3xl shadow-lg overflow-hidden">
      <div className="p-4 flex items-center justify-between bg-[#212429]">
        <h2 className="text-white font-medium">Swap</h2>
        <button
          onClick={() => setShowSettings(true)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-white/80" />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#191b1f] rounded-3xl p-6 w-full max-w-lg mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl font-medium">Swap Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SwapSettings onClose={() => setShowSettings(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4">
        <div className="mb-1 px-2 flex justify-between items-center">
          <span className="text-sm text-white/60">From</span>
          <span className="text-sm text-white/60">Balance: 0.0</span>
        </div>

        <div className="bg-[#212429] rounded-2xl p-4 mb-1">
          <div className="flex justify-between">
            <input
              type="text"
              className="bg-transparent text-2xl text-white outline-none w-3/5"
              placeholder="0.0"
              value={amountToken1}
              onChange={(e) => setAmountToken1(Number(e.target.value ? e.target.value : 0))}
            />
            <TokenSelector
              defaultToken={token1}
              onTokenSelect={setToken1}
            />
          </div>
          <div className="mt-2 text-sm text-white/60">~$0.00</div>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="bg-[#282c34] hover:bg-[#31353e] transition-colors w-10 h-10 rounded-xl flex items-center justify-center border border-[#191b1f]"
          >
            <ArrowDown className="w-5 h-5 text-white/80" />
          </button>
        </div>

        <div className="mb-1 mt-2 px-2 flex justify-between items-center">
          <span className="text-sm text-white/60">To (estimated)</span>
          <span className="text-sm text-white/60">Balance: 0.0</span>
        </div>

        <div className="bg-[#212429] rounded-2xl p-4 mb-4">
          <div className="flex justify-between">
            <input
              type="text"
              className="bg-transparent text-2xl text-white outline-none w-3/5"
              placeholder="0.0"
              value={amountToken2}
              onChange={(e) => setAmountToken2(Number(e.target.value ? e.target.value : 0))}
            />
            <TokenSelector
              defaultToken={token2}
              onTokenSelect={setToken2}
            />
          </div>
          <div className="mt-2 text-sm text-white/60">~$0.00</div>
        </div>

        <div className="bg-[#212429] rounded-2xl p-3 mb-4 flex justify-between items-center text-sm">
          <div className="flex items-center">
            <span className="text-white/80">1 {token1} = 2,054.34 {token2}</span>
            <Info className="ml-1 w-3.5 h-3.5 text-white/60" />
          </div>
          <button>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60">
              <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <button className="w-full py-4 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium rounded-2xl text-base">
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default SwapCard;