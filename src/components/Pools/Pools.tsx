import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Pool } from "../../interfaces/Interfaces";
import { Plus, X, ArrowRight, Info } from "lucide-react";
import { useWallet } from "../../context/WalletContext";
import { Token } from "../../interfaces/Interfaces";
import ConnectButton from "../UI/ConnectButton";

const Pools: React.FC = () => {
    const { account } = useWallet();
    const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
    const [showPoolDetailsModal, setShowPoolDetailsModal] = useState(false);
    const [selectedTokenX, setSelectedTokenX] = useState<string | null>(null);
    const [selectedTokenY, setSelectedTokenY] = useState<string | null>(null);
    const [pairAddress, setPairAddress] = useState<string>('');
    const [tokens, setTokens] = useState<Token[]>([]);
    console.log(pairAddress, tokens)

    const pools: Pool[] = [
        { id: 1, pair: 'ETH / USDC', fee: '0.05%', tvl: '$245.89M', tokenX: 'ETH', tokenY: 'USDC' },
        { id: 2, pair: 'USDC / USDT', fee: '0.01%', tvl: '$189.32M', tokenX: 'USDC', tokenY: 'USDT' },
        { id: 3, pair: 'ETH / USDT', fee: '0.05%', tvl: '$156.78M', tokenX: 'ETH', tokenY: 'USDT' },
        { id: 4, pair: 'WBTC / ETH', fee: '0.30%', tvl: '$98.45M', tokenX: 'WBTC', tokenY: 'ETH' },
        { id: 5, pair: 'DAI / USDC', fee: '0.01%', tvl: '$87.23M', tokenX: 'DAI', tokenY: 'USDC' },
        { id: 6, pair: 'LINK / ETH', fee: '0.30%', tvl: '$45.67M', tokenX: 'LINK', tokenY: 'ETH' },
        { id: 7, pair: 'UNI / ETH', fee: '0.30%', tvl: '$32.15M', tokenX: 'UNI', tokenY: 'ETH' },
        { id: 8, pair: 'AAVE / ETH', fee: '0.30%', tvl: '$28.90M', tokenX: 'AAVE', tokenY: 'ETH' },
    ];

    React.useEffect(() => {
        const stored = localStorage.getItem(account ? account : '');
        if (stored) {
            setTokens(JSON.parse(stored));
        }
    }, [account]);

    const handlePoolClick = (pool: Pool) => {
        setSelectedPool(pool);
        setPairAddress(pool.pair);
        setSelectedTokenX(pool.tokenX);
        setSelectedTokenY(pool.tokenY);
        setShowPoolDetailsModal(true);
    };

    return (
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
                <div className="space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar">
                    {pools.map((pool, index) => (
                        <motion.div
                            key={pool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-[#282c34] rounded-xl p-4 cursor-pointer hover:bg-[#2c2f36] transition-colors"
                            onClick={() => handlePoolClick(pool)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-white font-medium">{pool.pair}</span>
                                    <span className="text-white/40 text-sm">{pool.fee} fee</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-white/60 text-sm">TVL: {pool.tvl}</span>
                                    <ArrowRight className="w-4 h-4 text-white/40" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {showPoolDetailsModal && selectedPool && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1 },
                            exit: { opacity: 0, scale: 0.95 },
                        }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setShowPoolDetailsModal(false)}
                    >
                        <div
                            className="bg-[#191b1f] rounded-3xl p-6 w-full max-w-lg mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-white text-xl font-medium">{selectedPool.pair}</h3>
                                    <p className="text-white/60 text-sm mt-1">{selectedPool.fee} fee • TVL: {selectedPool.tvl}</p>
                                </div>
                                <button
                                    onClick={() => setShowPoolDetailsModal(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6 mb-6">
                                <div className="bg-[#212429] rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-white font-medium">Pool Information</h4>
                                        <Info className="w-5 h-5 text-white/40" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#282c34] rounded-xl p-3">
                                            <p className="text-white/60 text-sm mb-1">Token X</p>
                                            <p className="text-white font-medium">{selectedPool.tokenX}</p>
                                        </div>
                                        <div className="bg-[#282c34] rounded-xl p-3">
                                            <p className="text-white/60 text-sm mb-1">Token Y</p>
                                            <p className="text-white font-medium">{selectedPool.tokenY}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#212429] rounded-2xl p-4">
                                    <label className="text-white/60 text-sm mb-2 block">Token 1 ({selectedPool.tokenX})</label>
                                    <div className="flex items-center justify-between  space-x-2">
                                        <input
                                            type="text"
                                            disabled={!account}
                                            placeholder="0.0"
                                            className="bg-[#282c34] text-white rounded-xl px-4 py-2 w-4/5 outline-none"
                                        />
                                        <div
                                            className="text-center  w-16 py-2 rounded-xl bg-[#2c2f36] text-white text-sm "
                                        >
                                            {selectedTokenX}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#212429] rounded-2xl p-4">
                                    <label className="text-white/60 text-sm mb-2 block">Token 2 ({selectedPool.tokenY})</label>
                                    <div className="flex items-center justify-between space-x-2">
                                        <input
                                            type="text"
                                            disabled={!account}
                                            placeholder="0.0"
                                            className="bg-[#282c34] text-white  rounded-xl px-4 py-2 w-4/5 outline-none"
                                        />
                                        <div
                                            className="text-center  w-16 py-2 rounded-xl bg-[#2c2f36] text-white text-sm "
                                        >
                                            {selectedTokenY}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {account ? (
                                <button
                                    onClick={() => console.log('add liquidity')}
                                    className="w-full bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-3 px-6 rounded-2xl text-sm flex items-center justify-center space-x-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Liquidity</span>
                                </button>
                            ) : (
                                <div className="flex justify-center bg-pink-500  hover:bg-pink-600 transition-colors text-white font-medium py-3 px-6 rounded-2xl text-sm">
                                    <ConnectButton />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Pools;