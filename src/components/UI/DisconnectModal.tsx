import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisconnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

const DisconnectModal: React.FC<DisconnectModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalVariants}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    <div
                        className="bg-[#191b1f] rounded-3xl p-6 w-full max-w-md mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white text-xl font-medium">Disconnect Wallet</h3>
                            <button
                                onClick={onClose}
                                className="text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-white/80 mb-6">
                            Are you sure you want to disconnect your wallet? You can always reconnect it later.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white font-medium rounded-2xl text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium rounded-2xl text-sm"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DisconnectModal; 