import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalProps } from '../../interfaces/Interfaces';

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

const InfoModal: React.FC<ModalProps> = ({ isOpen, onClick, onClose, title = 'Notice', message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalVariants}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    <div
                        className="bg-[#191b1f] rounded-3xl p-6 w-full max-w-md mx-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white text-xl font-medium">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-white/80 mb-6">{message}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={onClick}
                                className="py-2 px-6 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium rounded-2xl text-sm"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InfoModal;
