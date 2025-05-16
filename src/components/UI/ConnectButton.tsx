import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ChevronDown } from 'lucide-react';
import DisconnectModal from './DisconnectModal';
import { motion } from 'framer-motion';
import InfoModal from './InfoModal';

interface ConnectButtonProps {
    className?: string;
}

function isMobileOrTablet() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ className = '' }) => {
    const { account, isConnecting, connectWallet, disconnectWallet } = useWallet();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDisconnect = () => {
        setShowDisconnectModal(true);
        setShowDropdown(false);
    };

    const handleConnect = () => {
        if (isMobileOrTablet()) {
            setShowInfoModal(true);
            return;
        }
        connectWallet();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={account ? () => setShowDropdown(!showDropdown) : handleConnect}
                disabled={isConnecting}
                className={` transition-colors text-white font-medium px-4 rounded-xl text-sm flex  items-center ${className}`}
            >
                {isConnecting ? (
                    'Connecting...'
                ) : account ? (
                    <>
                        {formatAddress(account)}
                        <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </>
                ) : (
                    <div className='whitespace-nowrap'>
                        Connect Wallet
                    </div>
                )}
            </button>

            {showDropdown && (
                <div className="absolute -right-5 top-7 hover:bg-[#2c2f36]  mt-2 w-48 bg-[#212429] rounded-xl shadow-lg z-50 border border-[#2c2f36] flex justify-center">
                    <div className="p-2 w-full flex justify-center">
                        <motion.div
                            initial={{ x: 50 }}
                            animate={{ x: 0 }}
                            exit={{ x: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                        >
                            <button
                                onClick={handleDisconnect}
                                className="px-4 py-2 text-white/80 rounded-lg transition-colors flex justify-center text-center"
                            >
                                Disconnect
                            </button>
                        </motion.div>
                    </div>
                </div>
            )}

            <DisconnectModal
                isOpen={showDisconnectModal}
                onClose={() => setShowDisconnectModal(false)}
                onConfirm={() => {
                    disconnectWallet();
                    setShowDisconnectModal(false);
                }}
            />
            <InfoModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                title="Desktop Required"
                message="Please use a desktop browser to connect your wallet. MetaMask and most wallet extensions are only supported on desktop browsers."
            />
        </div>
    );
};

export default ConnectButton; 