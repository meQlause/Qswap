import React, { useState } from 'react';
import { Plus, Search, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface Pool {
  id: number;
  pair: string;
  fee: string;
  tvl: string;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};


const PoolsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pools' | 'my-pools'>('pools');
  const [showNewLiquidityModal, setShowNewLiquidityModal] = useState(false);
  const [showTabIndicator, setShowTabIndicator] = useState(false);

  const handleTabChange = (tab: 'pools' | 'my-pools') => {
    setShowTabIndicator(true);
    setActiveTab(tab);
    setTimeout(() => setShowTabIndicator(false), 1500);
  };

  const pools: Pool[] = [
    { id: 1, pair: 'ETH / USDC', fee: '0.05%', tvl: '$245.89M' },
    { id: 2, pair: 'USDC / USDT', fee: '0.01%', tvl: '$189.32M' },
    { id: 3, pair: 'ETH / USDT', fee: '0.05%', tvl: '$156.78M' },
    { id: 4, pair: 'WBTC / ETH', fee: '0.30%', tvl: '$98.45M' },
    { id: 5, pair: 'DAI / USDC', fee: '0.01%', tvl: '$87.23M' },
    { id: 6, pair: 'LINK / ETH', fee: '0.30%', tvl: '$45.67M' },
    { id: 7, pair: 'UNI / ETH', fee: '0.30%', tvl: '$32.15M' },
    { id: 8, pair: 'AAVE / ETH', fee: '0.30%', tvl: '$28.90M' },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Left Arrow */}
      <button
        onClick={() => handleTabChange('pools')}
        className={`absolute left-[-80px] ${activeTab === 'pools' ? 'opacity-0' : ''} top-1/2 transform -translate-y-1/2 bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white/80 p-4 rounded-full shadow-lg z-20`}
        style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.15)' }}
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      {/* Right Arrow */}
      <button
        onClick={() => handleTabChange('my-pools')}
        className={`absolute right-[-80px]  ${activeTab === 'my-pools' ? 'opacity-0' : ''} top-1/2 transform -translate-y-1/2 bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white/80 p-4 rounded-full shadow-lg z-20`}
        style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.15)' }}
        disabled={activeTab === 'my-pools'}
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      <div className="w-full bg-[#191b1f] rounded-3xl shadow-lg overflow-hidden min-h-[600px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showTabIndicator ? (
            <motion.div
              key="tab-indicator"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center z-50"
            >
              <span className="text-white font-bold text-5xl md:text-7xl bg-[#212429] px-12 py-8 rounded-3xl shadow-2xl ">
                {activeTab === 'pools' ? 'Pools' : 'My Pools'}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-full"
            >
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search by token name or pool address"
                      className="w-full bg-[#212429] text-white rounded-2xl pl-10 pr-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <button className="bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white/80 font-medium py-3 px-4 rounded-2xl text-sm flex items-center justify-center">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Sort by
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'pools' ? (
                    <motion.div
                      key="pools"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <div className="bg-[#212429] rounded-2xl p-6">
                        <h4 className="text-white font-medium mb-3">Popular pools</h4>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                          {pools.map((pool, index) => (
                            <motion.div
                              key={pool.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="bg-[#282c34] rounded-xl p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white">{pool.pair}</span>
                                <span className="text-white/60">{pool.fee} fee</span>
                              </div>
                              <div className="text-sm text-white/60">TVL: {pool.tvl}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="my-pools"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <div className="bg-[#212429]  min-h-[500px] rounded-2xl py-32 text-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="flex flex-col items-center justify-center space-y-5"
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="w-16 h-16 bg-[#282c34] rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-8 h-8 text-white/60" />
                          </motion.div>
                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="text-white font-medium"
                          >
                            Your active V3 liquidity positions will appear here
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="text-white/60 text-sm max-w-md"
                          >
                            Your active liquidity positions will appear here. Create a position to start earning fees on trades.
                          </motion.p>
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-3 px-6 rounded-2xl text-sm mt-4"
                          >
                            Connect Wallet
                          </motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Liquidity Modal */}
        <AnimatePresence>
          {showNewLiquidityModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`bg-[#191b1f] rounded-3xl p-6 w-full max-w-lg mx-4
        transform transition-transform duration-300 ease-out
        translate-y-0 absolute`}
              >

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-xl font-medium">Add New Liquidity</h3>
                  <button
                    onClick={() => setShowNewLiquidityModal(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#212429] rounded-2xl p-4">
                    <label className="text-white/60 text-sm mb-2 block">Token 1</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="0.0"
                        className="bg-[#282c34] text-white rounded-xl px-4 py-2 w-full outline-none"
                      />
                      <button className="bg-[#282c34] hover:bg-[#31353e] text-white px-4 py-2 rounded-xl text-sm">
                        ETH
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="bg-[#282c34] p-2 rounded-full">
                      <Plus className="w-5 h-5 text-white/60" />
                    </button>
                  </div>

                  <div className="bg-[#212429] rounded-2xl p-4">
                    <label className="text-white/60 text-sm mb-2 block">Token 2</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="0.0"
                        className="bg-[#282c34] text-white rounded-xl px-4 py-2 w-full outline-none"
                      />
                      <button className="bg-[#282c34] hover:bg-[#31353e] text-white px-4 py-2 rounded-xl text-sm">
                        USDC
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#212429] rounded-2xl p-4">
                    <label className="text-white/60 text-sm mb-2 block">Fee Tier</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="bg-[#282c34] hover:bg-[#31353e] text-white py-2 rounded-xl text-sm">
                        0.01%
                      </button>
                      <button className="bg-[#282c34] hover:bg-[#31353e] text-white py-2 rounded-xl text-sm">
                        0.05%
                      </button>
                      <button className="bg-[#282c34] hover:bg-[#31353e] text-white py-2 rounded-xl text-sm">
                        0.30%
                      </button>
                    </div>
                  </div>

                  <button className="w-full bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-3 px-6 rounded-2xl text-sm mt-4">
                    Add Liquidity
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PoolsCard;



