import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface TokenSelectorModalProps {
  onClose: () => void;
  onSelect: (token: string) => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const POPULAR_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png' },
  { symbol: 'USDC', name: 'USD Coin', icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
  { symbol: 'USDT', name: 'Tether', icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png' },
  { symbol: 'LINK', name: 'Chainlink', icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png' },
  { symbol: 'UNI', name: 'Uniswap', icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png' },
  { symbol: 'AAVE', name: 'Aave', icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png' },
];

const TokenSelectorModal: React.FC<TokenSelectorModalProps> = ({ onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = POPULAR_TOKENS.filter(
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
              {POPULAR_TOKENS.slice(0, 4).map(token => (
                <button
                  key={token.symbol}
                  onClick={() => onSelect(token.symbol)}
                  className="bg-[#212429] hover:bg-[#2c2f36] transition-colors rounded-xl p-2 flex flex-col items-center"
                >
                  <img src={token.icon} alt={token.name} className="w-8 h-8 rounded-full mb-1" />
                  <span className="text-white text-xs font-medium">{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto max-h-64 custom-scrollbar">
            {filteredTokens.map(token => (
              <button
                key={token.symbol}
                onClick={() => onSelect(token.symbol)}
                className="w-full flex items-center p-3 hover:bg-[#212429] transition-colors rounded-xl mb-1"
              >
                <img src={token.icon} alt={token.name} className="w-8 h-8 rounded-full mr-3" />
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