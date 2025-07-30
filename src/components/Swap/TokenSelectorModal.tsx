import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { TokenlistSwap } from '../../interfaces/Interfaces';

interface TokenSelectorModalProps {
  onClose: () => void;
  onSelect: (token: TokenlistSwap) => void;
  tokens: TokenlistSwap[];
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};


const TokenSelectorModal: React.FC<TokenSelectorModalProps> = ({ onClose, onSelect, tokens }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = tokens.filter(
    token => token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full max-w-md bg-[#191b1f] rounded-3xl overflow-hidden max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 flex items-center justify-between bg-[#212429]">
          <h3 className="text-white font-medium">Select a token</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/40" />
            </div>
            <input
              type="text"
              className="bg-[#212429] text-white w-full pl-10 pr-4 py-3 rounded-2xl outline-none"
              placeholder="Search name or paste address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <h4 className="text-white/60 text-sm font-medium mb-2 px-2">Popular tokens</h4>
            <div className="grid grid-cols-4 gap-2">
              {tokens.slice(0, 4).map(token => (
                <button
                  key={token.symbol}
                  onClick={() => onSelect({
                    symbol: token.symbol,
                    name: token.name,
                    address: token.address,
                  })}
                  className="bg-[#212429] hover:bg-[#2c2f36] transition-colors rounded-xl p-2 flex flex-col items-center"
                >
                  <span className="text-white text-xs font-medium">{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto max-h-64 custom-scrollbar">
            {filteredTokens.map(token => (
              <button
                key={token.symbol}
                onClick={() => onSelect({
                  symbol: token.symbol,
                  name: token.name,
                  address: token.address,
                })}
                className="w-full flex items-center p-3 hover:bg-[#212429] transition-colors rounded-xl mb-1"
              >
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">{token.symbol}</span>
                  <span className="text-white/60 text-sm">{token.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TokenSelectorModal;