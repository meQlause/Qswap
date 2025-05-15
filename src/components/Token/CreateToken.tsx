import { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import createToken from '../../utils/tokenDeploy';
import ConnectButton from '../UI/ConnectButton';
import { motion } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    type: 'success' | 'error';
    message: string;
    tokenAddress?: string;
}

interface Props {
    setModalState: React.Dispatch<React.SetStateAction<ModalProps>>;
}

const CreateToken: React.FC<any> = ({ setModalState }: Props) => {
    const { account } = useWallet();
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimals, setDecimals] = useState(18);
    const [initialSupply, setInitialSupply] = useState<number>(18);
    const [mintable, setMintable] = useState(false);
    const [burnable, setBurnable] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const tokenAddress = await createToken(initialSupply, name, symbol, mintable, burnable);
            setModalState({
                isOpen: true,
                type: 'success',
                message: 'Your token has been created successfully!',
                tokenAddress,
            });
        } catch (error) {
            setModalState({
                isOpen: true,
                type: 'error',
                message: 'Failed to create token. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
            setInitialSupply(18);
            setName('');
            setSymbol('');
            setDecimals(18);
            setMintable(false);
            setBurnable(false);
        }
    };
    return (
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
                            onChange={e => setInitialSupply(Number(e.target.value))}
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
    )
}

export default CreateToken;