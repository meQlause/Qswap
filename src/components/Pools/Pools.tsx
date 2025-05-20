import { motion } from "framer-motion";
import React from "react";
import { Pool } from "../../interfaces/Interfaces";


const Pools: React.FC = () => {
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
    )
}

export default Pools