import { motion } from "framer-motion"
import { ArrowUpDown, Plus, Search } from "lucide-react"
import ConnectButton from "../UI/ConnectButton"
import { useWallet } from "../../context/WalletContext";
import { useEffect, useState } from "react";
import { ModalProps, Token } from "../../interfaces/Interfaces";
import Modal from "../UI/Modal";
import { getTokenInfo } from "../../utils/tokenDetails";


const MyToken: React.FC = () => {
    const { account } = useWallet();
    const [searchTerm, setSearchTerm] = useState("");
    const [tokens, setTokens] = useState<Token[]>([])
    const [modalMessage, setModalMessage] = useState<ModalProps>({
        isOpen: false,
        message: '',
    });


    const addToken = async () => {
        if (!account) {
            setModalMessage({
                isOpen: true,
                type: 'error',
                message: 'Connet Your Wallet First!',
            })
            return
        }

        const tokenToAdd = await getTokenInfo(searchTerm);
        if (!tokenToAdd) {
            setModalMessage({
                isOpen: true,
                type: 'error',
                message: 'Address Can Not Be Found!',
                tokenAddress: searchTerm
            })
            return
        }

        const alreadyExists = tokens.some(t => t.address === tokenToAdd.address);
        if (alreadyExists) {
            setModalMessage({
                isOpen: true,
                type: 'error',
                message: 'Address Has Already Been Addeed!',
                tokenAddress: searchTerm
            })
            return
        }

        tokens.push(tokenToAdd)
        localStorage.setItem(account, JSON.stringify(tokens));
        setModalMessage({
            isOpen: true,
            type: 'success',
            message: 'Address Was Succesfully Being Addeed!',
            tokenAddress: searchTerm
        })
    }

    useEffect(() => {
        const stored = localStorage.getItem(account ? account : '');
        if (stored) {
            setTokens(JSON.parse(stored));
        }

    }, [tokens]);


    return (<div>

        {modalMessage.isOpen && (
            <Modal
                isOpen={true}
                type={modalMessage.type}
                message={modalMessage.message}
                tokenAddress={modalMessage.tokenAddress}
                onClose={() => setModalMessage({ isOpen: false, message: '' })}
            />
        )}
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="bg-[#282c34] hover:bg-[#31353e] transition-colors text-white/80 font-medium py-3 px-4 rounded-2xl text-sm flex items-center justify-center">
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            Sort by
                        </button>
                        <button
                            disabled={searchTerm === ""}
                            className="bg-[#282c34] disabled:bg-[#1e1f24] disabled:text-white/30 hover:bg-[#31353e] transition-colors text-white/80 font-medium py-3 px-4 rounded-2xl text-sm flex items-center justify-center"
                            onClick={() => addToken()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Token Address
                        </button>
                    </div>
                    <div className="space-y-4 h-[400px] overflow-y-auto custom-scrollbar">
                        {tokens.map((token, index) => (
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
    </div>
    )
}

export default MyToken