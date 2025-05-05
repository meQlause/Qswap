import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
    account: string | null;
    isConnecting: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

interface WalletProviderProps {
    children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window as any;
            if (!ethereum) {
                console.log('Make sure you have MetaMask installed!');
                return;
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length !== 0) {
                setAccount(accounts[0]);
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    };

    const connectWallet = async () => {
        try {
            setIsConnecting(true);
            const { ethereum } = window as any;
            if (!ethereum) {
                alert('Please install MetaMask!');
                return;
            }

            // Force MetaMask to open the connection popup
            await ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            });

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        // Clear the account
        setAccount(null);

        // Clear any stored data
        localStorage.removeItem('walletConnected');

        // Force MetaMask to forget the connection
        const { ethereum } = window as any;
        if (ethereum) {
            // Remove all listeners
            ethereum.removeAllListeners('accountsChanged');
            ethereum.removeAllListeners('chainChanged');
            ethereum.removeAllListeners('disconnect');
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();

        // Listen for account changes
        const { ethereum } = window as any;
        if (ethereum) {
            ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    setAccount(accounts[0]);
                }
            });

            // Listen for chain changes
            ethereum.on('chainChanged', () => {
                // Reload the page when chain changes
                window.location.reload();
            });

            // Listen for disconnect
            ethereum.on('disconnect', () => {
                disconnectWallet();
            });
        }

        return () => {
            if (ethereum) {
                ethereum.removeAllListeners('accountsChanged');
                ethereum.removeAllListeners('chainChanged');
                ethereum.removeAllListeners('disconnect');
            }
        };
    }, []);

    return (
        <WalletContext.Provider
            value={{
                account,
                isConnecting,
                connectWallet,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}; 