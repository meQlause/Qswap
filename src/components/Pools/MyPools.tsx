import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ConnectButton from "../UI/ConnectButton";
import { Plus } from "lucide-react";
import { useWallet } from "../../context/WalletContext";
import { Pool, handleTabChange } from "../../interfaces/Interfaces";
import { getPairInfo } from "../../utils/getPairInfo";
import { getTokenInfo } from "../../utils/tokenDetails";

const MyPools: React.FC<handleTabChange> = ({ handleTabChange }: handleTabChange) => {
    const { account } = useWallet()
    const [pools, setPools] = useState<Pool[]>([]);
    useEffect(() => {
        const contractAddresses = localStorage.getItem("ContractPairAddresses");

        if (contractAddresses) {
            const parsedAddresses = JSON.parse(contractAddresses); // should be an object
            const addressList = Object.keys(parsedAddresses) as string[]; // or Object.keys() if keys are addresses

            const fetchAllData = async () => {
                try {
                    const pairAddress: any = await Promise.all(
                        addressList.map((address: string) => getPairInfo(address))
                    );
                    if (pairAddress) {
                        const tokenAddresses: any = await Promise.all([
                            getTokenInfo(pairAddress[0].tokenX),
                            getTokenInfo(pairAddress[0].tokenY)
                        ]);
                        if (tokenAddresses) {
                            const newPools: Pool[] = pairAddress.map((pair: any, index: number) => ({
                                id: index + 1,
                                pair: `${tokenAddresses[0].symbol as string} / ${tokenAddresses[1].symbol as string}`,
                                fee: `${Number(pair.fee) / 100}%`,
                                tvl: `Convertion Not Available`,
                                tokenX: tokenAddresses[0].symbol as string,
                                tokenY: tokenAddresses[1].symbol as string
                            }));
                            setPools(newPools);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching one or more pairs:", err);
                }
            };

            fetchAllData();
        }
    }, []);

    // This would normally come from your backend/contract
    // For now, we'll use empty array to show the empty state
    // const pools: Pool[] = [
    //     { id: 1, pair: 'ETH / USDC', fee: '0.05%', tvl: '$245.89M', tokenX: 'ETH', tokenY: 'USDC' },
    //     { id: 2, pair: 'USDC / USDT', fee: '0.01%', tvl: '$189.32M', tokenX: 'USDC', tokenY: 'USDT' },
    //     // ... other pools
    // ];

    return (
        <motion.div
            key="my-pools"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
        >
            <div className={`bg-[#212429] ${pools.length === 0 && " flex justify-center items-center h-full"} overflow-y-hidden min-h-[450px] rounded-2xl p-6`}>
                {pools.length > 0 && (<h4 className="text-white font-medium mb-3">My pools</h4>)}
                <div className="space-y-4 max-h-[400px] custom-scrollbar">
                    {account ? (
                        pools.length > 0 ? (
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
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="flex flex-col overflow-y-hidden items-center justify-center space-y-5"
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
                                    You don't have any active liquidity positions yet
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                    className="text-white/60 text-sm max-w-md text-center"
                                >
                                    Add liquidity to a pool to start earning fees on trades. You can add liquidity to any pool by clicking the + button in the Pools tab.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                    className="mt-4"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTabChange('pools');
                                        }}
                                        className="bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-3 px-6 rounded-2xl text-sm"
                                    >
                                        Go to Pools
                                    </button>
                                </motion.div>
                            </motion.div>
                        )
                    ) : (
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
                                Connect your wallet to view your liquidity positions
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="text-white/60 text-sm max-w-md text-center"
                            >
                                Connect your wallet to view and manage your liquidity positions. You'll be able to add liquidity to pools and earn trading fees.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="mt-4"
                            >
                                <div className="bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-3 px-6 rounded-2xl text-sm cursor-pointer">
                                    <ConnectButton />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MyPools;