import React, { useState, useRef, TouchEvent, } from 'react';
import { Plus, Search, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import MyPools from './MyPools';
import Pools from './Pools';
import { useWallet } from '../../context/WalletContext';
import { ModalProps, TokenSelection } from '../../interfaces/Interfaces';
import InfoModal from '../UI/InfoModal';
import deployProxyContract from '../../utils/proxyDeploy';
import { getTokenBalance } from '../../utils/checkBalance';
import deployNewPool from '../../utils/poolDeploy';
import { listener } from '../../utils/poolDeployListener';

const PoolsCard: React.FC = () => {
  const { account } = useWallet()
  const [activeTab, setActiveTab] = useState<'pools' | 'my-pools'>('pools');
  const [showNewLiquidityModal, setShowNewLiquidityModal] = useState(false);
  const [showTabIndicator, setShowTabIndicator] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const searchTerm = useRef<string>('')
  const [fee, setFee] = useState<1 | 5 | 30>(1)
  const [tokenX, setTokenX] = useState<TokenSelection>({
    address: '',
    amount: 0,
    isDisabled: true,
    maxAmount: 0
  });
  const [tokenY, setTokenY] = useState<TokenSelection>({
    address: '',
    amount: 0,
    isDisabled: true,
    maxAmount: 0
  });
  const [modalMessage, setModalMessage] = useState<ModalProps>({
    isOpen: false,
    message: '',
  });

  const verificateAddress = async (address: string, field: "x" | "y") => {
    if (address.length < 42) {
      if (field === "x") {
        setTokenX({ ...tokenX, address, isDisabled: true })
      } else {
        setTokenY({ ...tokenY, address, isDisabled: true })
      }
      return
    }

    try {
      const balance = await getTokenBalance(address);
      if (field === 'x') {
        setTokenX({ ...tokenX, address, isDisabled: false, maxAmount: balance })
      } else {
        setTokenY({ ...tokenY, address, isDisabled: false, maxAmount: await getTokenBalance(address) })
      }

    } catch (error: any) {
      setModalMessage({
        isOpen: true,
        title: 'Error',
        message: error.message,
        onClose: () => {
          setModalMessage({ isOpen: false, message: '' });
        },
        onClick: () => {
          setModalMessage({ isOpen: false, message: '' });
        }
      })

      if (field === 'x') {
        setTokenX({ ...tokenX, address: "", isDisabled: true })
      } else {
        setTokenY({ ...tokenY, address: "", isDisabled: true })
      }

    }
  }

  const handleTabChange = (tab: 'pools' | 'my-pools') => {
    setShowTabIndicator(true);
    setActiveTab(tab);
    setTimeout(() => setShowTabIndicator(false), 1500);
  };

  const handleSearchChange = (e: any) => {
    searchTerm.current = e.target.vale;
  }


  const handleDeployProxy = async () => {
    const DeployedContracts = await deployProxyContract();
    localStorage.setItem('ProxyAddress', DeployedContracts.proxyAddress);
    localStorage.setItem('UpdaterAddress', DeployedContracts.updaterAddress);
    setModalMessage({
      isOpen: true,
      title: 'Notice',
      message: `Proxy Contract Address: ${DeployedContracts.proxyAddress}`,
      onClose: () => {
        setModalMessage({ isOpen: false, message: '' });
      },
      onClick: () => {
        setModalMessage({ isOpen: false, message: '' });
      }
    })
  }

  const recordPair = (x: string, y: string, pair: string, lt: string) => {
    const pairAddressesStr = localStorage.getItem("PairAddresses");
    const contractPairAddressesStr = localStorage.getItem("ContractPairAddresses");
    const pairAddresses: Record<string, Record<string, string>> = pairAddressesStr ? JSON.parse(pairAddressesStr) : {};
    const contractPairAddresses: Record<string, { lt: string }> = contractPairAddressesStr ? JSON.parse(contractPairAddressesStr) : {};
    if (!pairAddresses[x]) {
      pairAddresses[x] = {};
    }

    pairAddresses[x][y] = pair;

    if (!pairAddresses[y]) {
      pairAddresses[y] = {};
    }

    pairAddresses[y][x] = pair;
    contractPairAddresses[pair] = { lt };
    localStorage.setItem("PairAddresses", JSON.stringify(pairAddresses));
    localStorage.setItem("ContractPairAddresses", JSON.stringify(contractPairAddresses));
  };

  const handleAddLiquidity = async () => {
    const proxyAddress = localStorage.getItem("ProxyAddress")
    if (!proxyAddress) {
      setModalMessage({
        isOpen: true,
        title: 'Notice',
        message: 'There is No ProxyAddress Detected, Click OK to Deploy Proxy Contract',
        onClick: async () => {
          await handleDeployProxy();
        },
        onClose: () => {
          setModalMessage({ isOpen: false, message: '' });
        }
      })
      return;
    }

    try {

      listener(proxyAddress, (x, y, pair, lt) => {
        recordPair(x, y, pair, lt);
        setModalMessage({
          isOpen: true,
          type: 'success',
          message: `Your ${x} and ${y}'s pair has been created to address ${pair} successfully! please save ${lt} to your wallet as your Liquidity Token's address`,
          onClose: () => {
            setModalMessage({ isOpen: false, message: '' });
          },
          onClick: () => {
            setModalMessage({ isOpen: false, message: '' });
          }
        });
      })

      await deployNewPool(
        proxyAddress,
        tokenX.address,
        String(tokenX.amount + 1),
        tokenY.address,
        String(tokenY.amount + 1),
        fee
      )
    } catch (error: any) {
      setModalMessage({
        isOpen: true,
        type: 'error',
        message: `error ${error.mesage} : Pair already've been created`,
        onClose: () => {
          setModalMessage({ isOpen: false, message: '' });
        },
        onClick: () => {
          setModalMessage({ isOpen: false, message: '' });
        }
      });
    }
  }

  const handleAmountChange = (token: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value) || 0;
    if (token === 'x') {
      if (numValue > tokenX.maxAmount) {
        setTokenX(prev => ({ ...prev, amount: tokenX.maxAmount }));
        return
      }
      setTokenX(prev => ({ ...prev, amount: numValue }));
    } else {
      if (numValue > tokenY.maxAmount) {
        setTokenY(prev => ({ ...prev, amount: tokenY.maxAmount }));
        return
      }
      setTokenY(prev => ({ ...prev, amount: numValue }));
    }
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
      if (swipeDistance > 0 && activeTab === 'my-pools') {
        handleTabChange('pools');
      } else if (swipeDistance < 0 && activeTab === 'pools') {
        handleTabChange('my-pools');
      }
    }
  };

  return (
    <>
      <InfoModal
        isOpen={modalMessage.isOpen}
        type={modalMessage.type}
        message={modalMessage.message}
        tokenAddress={modalMessage.tokenAddress}
        onClick={modalMessage.onClick}
        onClose={modalMessage.onClose}
      />
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={() => handleTabChange('pools')}
          className={`absolute left-[-80px] ${activeTab === 'pools' ? 'opacity-0' : ''} top-1/2 transform -translate-y-1/2 bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white/80 p-4 rounded-full shadow-lg z-20`}
          style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.15)' }}
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        {/* Right Arrow */}
        <button
          onClick={() => handleTabChange('my-pools')}
          className={`absolute right-[-80px]  ${activeTab === 'my-pools' ? 'opacity-0' : ''} top-1/2 transform -translate-y-1/2 bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white/80 p-4 rounded-full shadow-lg z-20`}
          style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.15)' }}
          disabled={activeTab === 'my-pools'}
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        <div
          className="w-full bg-[#191b1f] rounded-3xl shadow-lg overflow-hidden min-h-[500px] flex items-center justify-center"
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
                  {activeTab === 'pools' ? 'Pools' : 'My Pools'}
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
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        onChange={handleSearchChange}
                        placeholder="Search by token name or pool address"
                        className="w-full bg-[#212429] text-white rounded-2xl pl-10 pr-4 py-3 text-sm outline-none"
                      />
                    </div>
                    <button className="bg-[#212429] hover:bg-[#2c2f36] transition-colors text-white/80 font-medium py-3 px-4 rounded-2xl text-sm flex items-center justify-center">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Sort by
                    </button>
                    <button
                      disabled={account ? false : true}
                      className="bg-[#282c34] disabled:bg-[#1e1f24] disabled:text-white/30 hover:bg-[#31353e] transition-colors text-white/80 font-medium py-3 px-4 rounded-2xl text-sm flex items-center justify-center"
                      onClick={() => setShowNewLiquidityModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Luquidity
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'pools' ?
                      <Pools />
                      :
                      <MyPools handleTabChange={handleTabChange} />
                    }
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showNewLiquidityModal && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.95 },
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`bg-[#191b1f] rounded-3xl p-6 w-full max-w-lg mx-4
                    transform transition-transform duration-300 ease-out
          translate-y-0 absolute`}
                >

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-xl font-medium">Add New Liquidity</h3>
                    <button
                      title='show_liquidity'
                      onClick={() => setShowNewLiquidityModal(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#212429] rounded-2xl p-4">
                      <label className="text-white/60 text-sm mb-2 block">Token 1</label>
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          placeholder="Enter token address"
                          value={tokenX.address || ''}
                          onChange={async (e) => await verificateAddress(e.target.value, 'x')}
                          className="bg-[#282c34] text-white rounded-xl px-4 py-2 w-full outline-none mb-2"
                        />
                        <input
                          type="number"
                          placeholder="0.0"
                          value={tokenX.amount || ''}
                          onChange={(e) => handleAmountChange('x', e.target.value)}
                          className="bg-[#282c34] text-white rounded-xl px-4 py-2 w-full outline-none"
                          disabled={tokenX.isDisabled}
                        />
                      </div>
                    </div>

                    <div className="bg-[#212429] rounded-2xl p-4">
                      <label className="text-white/60 text-sm mb-2 block">Token 2</label>
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          placeholder="Enter token address"
                          value={tokenY.address || ''}
                          onChange={async (e) => await verificateAddress(e.target.value, 'y')}
                          className="bg-[#282c34] text-white rounded-xl px-4 py-2 w-full outline-none mb-2"
                        />
                        <input
                          type="number"
                          placeholder="0.0"
                          value={tokenY.amount || ''}
                          onChange={(e) => handleAmountChange('y', e.target.value)}
                          className="bg-[#282c34] text-white rounded-xl px-4 py-2 w-full outline-none"
                          disabled={tokenY.isDisabled}
                        />
                      </div>
                    </div>

                    <div className="bg-[#212429] rounded-2xl p-4">
                      <label className="text-white/60 text-sm mb-2 block">Fee Tier</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setFee(1)} className={`${fee === 1 ? "bg-[#31353e]" : "bg-[#282c34]"} hover:bg-[#31353e] text-white py-2 rounded-xl text-sm`}>
                          0.01%
                        </button>
                        <button onClick={() => setFee(5)} className={`${fee === 5 ? "bg-[#31353e]" : "bg-[#282c34]"} hover:bg-[#31353e] text-white py-2 rounded-xl text-sm`}>
                          0.05%
                        </button>
                        <button onClick={() => setFee(30)} className={`${fee === 30 ? "bg-[#31353e]" : "bg-[#282c34]"} hover:bg-[#31353e] text-white py-2 rounded-xl text-sm`}>
                          0.30%
                        </button>
                      </div>
                    </div>

                    <button
                      disabled={tokenX.amount <= 0 || tokenY.amount <= 0}
                      onClick={async () => await handleAddLiquidity()}
                      className="w-full bg-pink-500 hover:bg-pink-600 transition-colors text-white font-medium py-3 px-6 rounded-2xl text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                      Add Liquidity
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default PoolsCard;



