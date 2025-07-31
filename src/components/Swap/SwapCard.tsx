import React, { useEffect, useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';
// import { motion, AnimatePresence } from "framer-motion";
import TokenSelector from './TokenSelector';
// import SwapSettings from './SwapSettings';
import ConnectButton from '../UI/ConnectButton';
import { useWallet } from '../../context/WalletContext';
import { Token, TokenlistSwap } from '../../interfaces/Interfaces';
import { getTokenInfo } from '../../utils/tokenDetails';
import { getTokenBalance } from '../../utils/checkBalance';

// const modalVariants = {
//   hidden: { opacity: 0, scale: 0.95 },
//   visible: { opacity: 1, scale: 1 },
//   exit: { opacity: 0, scale: 0.95 },
// };

const SwapCard: React.FC = () => {
  const { account } = useWallet();
  // const [showSettings, setShowSettings] = useState(false);
  const [amountToken1, setAmountToken1] = useState<{ amount: number, maxAmount: number }>(
    { amount: 0, maxAmount: 0 }
  );
  const [token1, setToken1] = useState<TokenlistSwap | null>();
  const [amountToken2, setAmountToken2] = useState<{ amount: number, maxAmount: number }>(
    { amount: 0, maxAmount: 0 }
  );
  const [token2, setToken2] = useState<TokenlistSwap | null>();
  const [tokens, setTokens] = useState<TokenlistSwap[]>([])
  const handleReset = () => {
    setToken1(null)
    setToken2(null)
    setAmountToken1({ amount: 0, maxAmount: 0 })
    setAmountToken2({ amount: 0, maxAmount: 0 })
  };

  const refreshList = () => {
    const tokenList = localStorage.getItem("PairAddresses");
    const parsedList = tokenList ? JSON.parse(tokenList) : null;
    if (parsedList) {
      const fetchData = async () => {
        const data = await Promise.all(Object.keys(parsedList).map((d) => getTokenInfo(d)));
        const tokenList: Token[] = data.filter((d) => d !== null) as Token[];
        const tokens: TokenlistSwap[] = tokenList.map((d) => {
          return {
            symbol: d.symbol,
            name: d.name,
            address: d.address,
          }
        })
        setTokens(tokens)
      }
      fetchData()
    }
  }

  useEffect(() => {
    refreshList()
  }, [])

  useEffect(() => {
    const tokenList = localStorage.getItem("PairAddresses");
    const parsedList = tokenList ? JSON.parse(tokenList) : null;
    if (parsedList) {
      const fetchData = async () => {
        if (token1) {
          const data = await Promise.all(Object.keys(Object(parsedList)[token1.address]).map((d) => getTokenInfo(d)));
          const tokenList: Token[] = data.filter((d) => d !== null) as Token[];
          const tokens: TokenlistSwap[] = tokenList.map((d) => {
            return {
              symbol: d.symbol,
              name: d.name,
              address: d.address
            }
          })
          setTokens(tokens)
        }
      }
      fetchData()
    }
  }, [token1])

  useEffect(() => {
    if (token1) {
      const fetchData = async () => {
        const balance = await getTokenBalance(token1.address)
        setAmountToken1(prev => ({ ...prev, maxAmount: balance }))
      }
      fetchData()
    }

    if (token2) {
      const fetchData = async () => {
        const balance = await getTokenBalance(token2.address)
        setAmountToken2(prev => ({ ...prev, maxAmount: balance }))
      }
      fetchData()
    }
  }, [token1, token2])


  return (
    tokens.length === 0 ? (
      <div className="w-full max-w-md mx-auto bg-[#191b1f] rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-[#212429] border border-white/10 rounded-2xl p-4 text-white/80 text-sm text-center shadow-inner flex flex-col items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
          </svg>
          <div>No tokens available</div>
          <p className="text-white/50 text-xs">
            Please Create Pool to begin swapping
          </p>
          <button
            onClick={refreshList}
            title="Refresh List"
            className="bg-[#282c34] my-2 hover:bg-[#31353e] transition-colors w-10 h-10 rounded-xl flex items-center justify-center border border-[#191b1f]"
          >
            <RotateCcw className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>
    ) : (
      <div className="w-full max-w-md mx-auto bg-[#191b1f] rounded-3xl shadow-lg overflow-hidden">
        <div className="p-4 flex items-center justify-between bg-[#212429]">
          <h2 className="text-white font-medium">Swap</h2>
          {/* <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5 text-white/80" />
          </button> */}
        </div>

        {/* <AnimatePresence>
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
        </AnimatePresence> */}

        <div className="p-4">
          <div className="mb-1 px-2 flex justify-between items-center">
            <span className="text-sm text-white/60">From</span>
            {amountToken1.maxAmount !== 0 && (<span className="text-sm text-white/60">Balance : {amountToken1.maxAmount}</span>)}
          </div>

          <div className="bg-[#212429] rounded-2xl p-4 mb-1">
            <div className="flex justify-between">
              <input
                type="text"
                disabled={token1 ? false : true}
                className="bg-transparent text-2xl text-white outline-none w-3/5"
                placeholder="0.0"
                value={amountToken1.amount}
                onChange={(e) => setAmountToken1({ ...amountToken1, amount: Number(e.target.value) > amountToken1.maxAmount ? amountToken1.maxAmount : Number(e.target.value) })}
              />
              <TokenSelector
                disabled={token1 ? true : false}
                defaultToken={token1?.name || "Select"}
                onTokenSelect={setToken1}
                tokens={tokens}
              />
            </div>
            <div className="mt-2 text-sm text-white/60">~ Convertion rate is not available</div>
          </div>

          <div className="flex justify-center -my-3 relative z-10">
            <button
              onClick={handleReset}
              className="bg-[#282c34] hover:bg-[#31353e] transition-colors w-10 h-10 rounded-xl flex items-center justify-center border border-[#191b1f]"
            >
              <RotateCcw className="w-5 h-5 text-white/80" />
            </button>
          </div>

          <div className="mb-1 mt-2 px-2 flex justify-between items-center">
            <span className="text-sm text-white/60">To (estimated)</span>
            {amountToken2.maxAmount !== 0 && (<span className="text-sm text-white/60">Balance : {amountToken2.maxAmount}</span>)}
          </div>
          <div className="bg-[#212429] rounded-2xl p-4 mb-4">
            <div className="flex justify-between">
              <input
                type="text"
                className="bg-transparent text-2xl text-white outline-none w-3/5"
                placeholder="0.0"
                disabled={token2 ? false : true}
                value={amountToken2.amount}
                onChange={(e) => setAmountToken2({ ...amountToken2, amount: Number(e.target.value) > amountToken2.maxAmount ? amountToken2.maxAmount : Number(e.target.value) })} />
              <TokenSelector
                disabled={token1 ? false : true}
                defaultToken={token2?.name || "Select"}
                onTokenSelect={setToken2}
                tokens={tokens}
              />
            </div>
            <div className="mt-2 text-sm text-white/60">~ Convertion rate is not available</div>
          </div>

          <div className="bg-[#212429] rounded-2xl p-3 mb-4 flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="text-white/80">1 {token1?.name} = 2,054.34 {token2?.name}</span>
              <Info className="ml-1 w-3.5 h-3.5 text-white/60" />
            </div>
            <button>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60">
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill="currentColor" />
              </svg>
            </button>
          </div>
          {
            account ? (
              <button className="w-full py-4 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium rounded-2xl text-base">
                swap
              </button>
            ) : (
              <div className="w-full py-4 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium rounded-2xl text-base flex justify-center">
                <ConnectButton />
              </div>
            )
          }
        </div>
      </div>
    )
  )
};
export default SwapCard;