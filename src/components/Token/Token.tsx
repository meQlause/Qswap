import React, { useState, useRef, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import MyToken from './MyToken';
import CreateToken from './CreateToken';

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    type: 'success' | 'error';
    message: string;
    tokenAddress?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type, message, tokenAddress }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#212429] rounded-2xl p-6 max-w-md w-full mx-4 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white/60 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    {type === 'success' ? (
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    ) : (
                        <AlertCircle className="w-16 h-16 text-red-500" />
                    )}

                    <h3 className={`text-xl font-semibold ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {type === 'success' ? 'Success!' : 'Error'}
                    </h3>

                    <p className="text-white/80">{message}</p>

                    {tokenAddress && (
                        <div className="w-full bg-[#282c34] rounded-xl p-4 mt-2">
                            <p className="text-white/60 text-sm mb-1">Token Address:</p>
                            <p className="text-white break-all text-sm">{tokenAddress}</p>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className={`mt-4 px-6 py-2 rounded-xl font-medium ${type === 'success'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                            } text-white transition-colors`}
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const Token: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'create-token' | 'my-tokens'>('create-token');
    const [showTabIndicator, setShowTabIndicator] = useState(false);
    const [modalState, setModalState] = useState<ModalProps>({
        isOpen: false,
        type: 'success',
        message: '',
    });

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



    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                type={modalState.type}
                message={modalState.message}
                tokenAddress={modalState.tokenAddress}
            />
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
                                    <CreateToken setModalState={setModalState} />
                                ) : <MyToken />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Token; 