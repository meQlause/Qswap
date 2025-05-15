import { motion } from "framer-motion"
import { ArrowUpDown, Plus, Search } from "lucide-react"
import ConnectButton from "../UI/ConnectButton"
import { useWallet } from "../../context/WalletContext";

interface Token {
    id: number;
    name: string;
    symbol: string;
    totalSupply: string;
    holders: number;
}

const MyToken: React.FC = () => {
    const { account } = useWallet();

    const myTokens: Token[] = [
        { id: 1, name: 'My Token 1', symbol: 'MT1', totalSupply: '1,000,000', holders: 150 },
        { id: 2, name: 'My Token 2', symbol: 'MT2', totalSupply: '500,000', holders: 75 },
        { id: 3, name: 'My Token 3', symbol: 'MT3', totalSupply: '2,000,000', holders: 300 },
        { id: 4, name: 'My Token 3', symbol: 'MT3', totalSupply: '2,000,000', holders: 300 },
        { id: 5, name: 'My Token 3', symbol: 'MT3', totalSupply: '2,000,000', holders: 300 },
        { id: 6, name: 'My Token 3', symbol: 'MT3', totalSupply: '2,000,000', holders: 300 },
        { id: 7, name: 'My Token 3', symbol: 'MT3', totalSupply: '2,000,000', holders: 300 },
    ];

    return (
        <motion.div
            key="my-tokens"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
        >
            {account ? (
                <div className="bg-[#212429] rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search by token name or address"
                                className="w-full bg-[#282c34] text-white rounded-2xl pl-10 pr-4 py-3 text-sm outline-none"
                            />
                        </div>
                        <button className="bg-[#282c34] hover:bg-[#31353e] transition-colors text-white/80 font-medium py-3 px-4 rounded-2xl text-sm flex items-center justify-center">
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            Sort by
                        </button>
                    </div>
                    <div className="space-y-4 h-[400px] overflow-y-auto custom-scrollbar">
                        {myTokens.map((token, index) => (
                            <motion.div
                                key={token.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-[#282c34] rounded-xl p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white">{token.name}</span>
                                    <span className="text-white/60">{token.symbol}</span>
                                </div>
                                <div className="text-sm text-white/60">
                                    Total Supply: {token.totalSupply} | Holders: {token.holders}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-[#212429] min-h-[550px] rounded-2xl py-32 text-center">
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
                            Connect your wallet to view your tokens
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="text-white/60 text-sm max-w-md"
                        >
                            Connect your wallet to show your created tokens on our platform.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="mt-4"
                        >
                            <div className="w-full py-2 px-5 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium rounded-xl text-base flex justify-center">
                                <ConnectButton />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    )
}

export default MyToken