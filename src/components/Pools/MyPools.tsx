import { motion } from "framer-motion";
import React from "react";
import ConnectButton from "../UI/ConnectButton";
import { Plus } from "lucide-react";
import { useWallet } from "../../context/WalletContext";
import { Pool } from "../../interfaces/Interfaces";

const MyPools: React.FC = () => {
    const { account } = useWallet()

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
            key="my-pools"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
        >
            <div className="bg-[#212429] min-h-[500px] rounded-2xl p-6">
                <h4 className="text-white font-medium mb-3">My pools</h4>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {account ?
                        pools.map((pool, index) => (
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
                        )) :
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
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-3 px-6 rounded-2xl text-sm mt-4"
                            >
                                <ConnectButton />
                            </motion.div>
                        </motion.div>
                    }
                </div>
            </div>
        </motion.div>
    )
}

export default MyPools