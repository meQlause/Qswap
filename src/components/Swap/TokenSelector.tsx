import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TokenSelectorModal from './TokenSelectorModal';
import { AnimatePresence } from 'framer-motion';
import { TokenlistSwap } from '../../interfaces/Interfaces';

interface TokenSelectorProps {
  disabled: boolean;
  defaultToken: string;
  onTokenSelect: (token: TokenlistSwap) => void;
  tokens: TokenlistSwap[]
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ disabled, defaultToken, onTokenSelect, tokens }) => {
  const [showModal, setShowModal] = useState(false);

  const handleTokenSelect = (token: TokenlistSwap) => {
    onTokenSelect(token);
    setShowModal(false);
  };

  return (
    <>
      <button
        disabled={disabled}
        onClick={() => setShowModal(true)}
        className={`flex items-center bg-[#2c2f36] ${!disabled && "hover:bg-[#343841]"} transition-colors rounded-2xl py-2 px-3 text-white font-medium`}
      >
        {defaultToken}
        <ChevronDown className="ml-1 w-5 h-5 text-white/60" />
      </button>
      <AnimatePresence>
        {showModal && (
          <TokenSelectorModal
            onClose={() => setShowModal(false)}
            onSelect={handleTokenSelect}
            tokens={tokens}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TokenSelector;