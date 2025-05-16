import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { ModalProps } from "../../interfaces/Interfaces";

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

export default Modal;