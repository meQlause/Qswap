import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TokenSelectorModal from './TokenSelectorModal';
import { AnimatePresence } from 'framer-motion';

interface TokenSelectorProps {
  defaultToken: string;
  onTokenSelect: (token: string) => void;
}

const TOKEN_ICONS: Record<string, string> = {
  ETH: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  USDC: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  USDT: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  DAI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};

const TokenSelector: React.FC<TokenSelectorProps> = ({ defaultToken, onTokenSelect }) => {
  const [showModal, setShowModal] = useState(false);

  const handleTokenSelect = (token: string) => {
    onTokenSelect(token);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center bg-[#2c2f36] hover:bg-[#343841] transition-colors rounded-2xl py-2 px-3 text-white font-medium"
      >
        <img
          src={TOKEN_ICONS[defaultToken]}
          alt={defaultToken}
          className="w-6 h-6 mr-2 rounded-full"
        />
        {defaultToken}
        <ChevronDown className="ml-1 w-5 h-5 text-white/60" />
      </button>
      <AnimatePresence>
        {showModal && (
          <TokenSelectorModal
            onClose={() => setShowModal(false)}
            onSelect={handleTokenSelect}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TokenSelector;