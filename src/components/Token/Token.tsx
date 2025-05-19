import React, { useState, useRef, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import MyToken from './MyToken';
import CreateToken from './CreateToken';
import { ModalProps } from '../../interfaces/Interfaces';
import Modal from '../UI/Modal';


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
                                    <CreateToken setModalMessage={setModalState} handleTabChange={handleTabChange} />
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