import React, { useState, useRef, TouchEvent } from 'react';
import { useWallet } from '../../context/WalletContext';
import ConnectButton from '../UI/ConnectButton';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface Token {
    id: number;
    name: string;
    symbol: string;
    totalSupply: string;
    holders: number;
}

const CreateToken: React.FC = () => {
    const { account } = useWallet();
    const [activeTab, setActiveTab] = useState<'create-token' | 'my-tokens'>('create-token');
    const [showTabIndicator, setShowTabIndicator] = useState(false);
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimals, setDecimals] = useState(18);
    const [initialSupply, setInitialSupply] = useState('');
    const [mintable, setMintable] = useState(false);
    const [burnable, setBurnable] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const handleTabChange = (tab: 'create-token' | 'my-tokens') => {
        setShowTabIndicator(true);
        setActiveTab(tab);
        setTimeout(() => setShowTabIndicator(false), 1500);
    };

    const handleTouchStart = (e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX.current - touchStartX.current;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && activeTab === 'my-tokens') {
                handleTabChange('create-token');
            } else if (swipeDistance < 0 && activeTab === 'create-token') {
                handleTabChange('my-tokens');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => setIsSubmitting(false), 1500);
        alert('Token creation logic goes here!');
    };

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
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Left Arrow */}
            <button
                onClick={() => handleTabChange('create-token')}
                className={`absolute left-[-80px] ${activeTab === 'create-token' ? 'opacity-0' : ''} top-1/2 transform -translate-y-1/2 bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white/80 p-4 rounded-full shadow-lg z-20`}
                style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.15)' }}
            >
                <ChevronLeft className="w-7 h-7" />
            </button>
            {/* Right Arrow */}
            <button
                onClick={() => handleTabChange('my-tokens')}
                className={`absolute right-[-80px] ${activeTab === 'my-tokens' ? 'opacity-0' : ''} top-1/2 transform -translate-y-1/2 bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white/80 p-4 rounded-full shadow-lg z-20`}
                style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.15)' }}
            >
                <ChevronRight className="w-7 h-7" />
            </button>

            <div
                className="w-full bg-[#191b1f] rounded-3xl shadow-lg overflow-hidden min-h-[600px] flex items-center justify-center"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
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
                            <span className="text-white font-bold text-5xl md:text-7xl bg-[#212429] px-12 py-8 rounded-3xl shadow-2xl">
                                {activeTab === 'create-token' ? 'Create Token' : 'My Tokens'}
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
                                {activeTab === 'create-token' ? (
                                    <motion.div
                                        key="create-token"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="w-full"
                                    >
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-white/80 mb-1">Token Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-[#212429] text-white rounded-xl px-4 py-3 outline-none"
                                                        value={name}
                                                        onChange={e => setName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/80 mb-1">Token Symbol</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-[#212429] text-white rounded-xl px-4 py-3 outline-none"
                                                        value={symbol}
                                                        onChange={e => setSymbol(e.target.value)}
                                                        required
                                                        maxLength={8}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/80 mb-1">Decimals</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-[#212429] text-white rounded-xl px-4 py-3 outline-none"
                                                        value={decimals}
                                                        onChange={e => setDecimals(Number(e.target.value))}
                                                        min={0}
                                                        max={36}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/80 mb-1">Initial Supply</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-[#212429] text-white rounded-xl px-4 py-3 outline-none"
                                                        value={initialSupply}
                                                        onChange={e => setInitialSupply(e.target.value)}
                                                        min={0}
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <div className="flex items-center gap-4">
                                                        <label className="flex items-center gap-2 text-white/80">
                                                            <input
                                                                type="checkbox"
                                                                checked={mintable}
                                                                onChange={e => setMintable(e.target.checked)}
                                                                className="accent-pink-500"
                                                            />
                                                            Mintable
                                                        </label>
                                                        <label className="flex items-center gap-2 text-white/80">
                                                            <input
                                                                type="checkbox"
                                                                checked={burnable}
                                                                onChange={e => setBurnable(e.target.checked)}
                                                                className="accent-pink-500"
                                                            />
                                                            Burnable
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-white/80 mb-1">Owner Address</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-[#212429] text-white rounded-xl px-4 py-3 outline-none"
                                                        value={account ? account : 'Connect Wallet First'}
                                                        disabled={true}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {account ? (
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full py-3 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium rounded-2xl text-lg mt-4"
                                                >
                                                    {isSubmitting ? 'Creating...' : 'Create Token'}
                                                </button>
                                            ) : (
                                                <div className="w-full py-4 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium rounded-2xl text-base flex justify-center">
                                                    <ConnectButton />
                                                </div>
                                            )}
                                        </form>
                                    </motion.div>
                                ) : (
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
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CreateToken; 