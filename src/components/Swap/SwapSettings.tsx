import React, { useState } from 'react';
import { X, Info } from 'lucide-react';

interface SwapSettingsProps {
  onClose: () => void;
}

const SwapSettings: React.FC<SwapSettingsProps> = ({ onClose }) => {
  const [slippageTolerance, setSlippageTolerance] = useState('0.5');
  const [transactionDeadline, setTransactionDeadline] = useState('30');

  return (
    <div className="bg-[#212429] border-b border-[#31353e] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Settings</h3>
        <button title='close' onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-white/80" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-white text-sm font-medium">Slippage tolerance</span>
          <div className="ml-1 text-white/60 cursor-pointer">
            <Info className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1.5 rounded-xl text-sm font-medium ${slippageTolerance === '0.1' ? 'bg-pink-500 text-white' : 'bg-[#282c34] text-white/80 hover:bg-[#31353e]'
              } transition-colors`}
            onClick={() => setSlippageTolerance('0.1')}
          >
            0.1%
          </button>
          <button
            className={`px-3 py-1.5 rounded-xl text-sm font-medium ${slippageTolerance === '0.5' ? 'bg-pink-500 text-white' : 'bg-[#282c34] text-white/80 hover:bg-[#31353e]'
              } transition-colors`}
            onClick={() => setSlippageTolerance('0.5')}
          >
            0.5%
          </button>
          <button
            className={`px-3 py-1.5 rounded-xl text-sm font-medium ${slippageTolerance === '1.0' ? 'bg-pink-500 text-white' : 'bg-[#282c34] text-white/80 hover:bg-[#31353e]'
              } transition-colors`}
            onClick={() => setSlippageTolerance('1.0')}
          >
            1.0%
          </button>
          <div className="relative flex items-center flex-grow">
            <input
              type="text"
              className={`w-full bg-[#282c34] text-white rounded-xl px-3 py-1.5 text-sm font-medium outline-none`}
              value={slippageTolerance !== '0.1' && slippageTolerance !== '0.5' && slippageTolerance !== '1.0' ? slippageTolerance : ''}
              onChange={(e) => setSlippageTolerance(e.target.value)}
              placeholder="Custom"
            />
            <div className="absolute right-3 text-white/60 text-sm">%</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <span className="text-white text-sm font-medium">Transaction deadline</span>
          <div className="ml-1 text-white/60 cursor-pointer">
            <Info className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center">
          <input
            aria-label='tx'
            type="text"
            className="w-16 bg-[#282c34] text-white rounded-xl px-3 py-1.5 text-sm font-medium outline-none mr-2"
            value={transactionDeadline}
            onChange={(e) => setTransactionDeadline(e.target.value)}
          />
          <span className="text-white/60 text-sm">minutes</span>
        </div>
      </div>
    </div>
  );
};

export default SwapSettings;