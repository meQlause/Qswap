# Qswap

A modern decentralized exchange (DEX) application built with **React**, **TypeScript**, and **Solidity**, designed to provide a sleek and responsive interface for token creation, liquidity pool management, and token swaps.

> ⚠️ **Disclaimer:**  
> This project currently uses **local storage** to store token and pool data. This setup is for development and testing purposes only. A proper backend and persistent storage will be implemented in future updates. Please do **not** use this in production or with real assets.

---

## 🚀 Features

### Core Functionality
- 🪙 **Token Creation**: Create custom ERC20 tokens with custom names and symbols
- 💧 **Liquidity Pool Management**: Create and manage liquidity pools with custom fee tiers (1%, 5%, 30%)
- 💱 **Token Swapping**: Swap tokens using automated market maker (AMM) with constant product formula
- 👛 **Wallet Integration**: Seamless MetaMask integration for Web3 functionality
- 📱 **Mobile-First Design**: Responsive interface optimized for mobile devices

### User Experience
- 🎨 **Modern UI**: Clean, dark theme optimized for DeFi applications
- 🌙 **Dark Theme**: Professional dark interface with custom scrollbars
- ⚡ **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- 🔄 **Real-time Updates**: Live balance checking and transaction status updates

---

## 🧰 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Ethers.js** for Ethereum interaction

### Smart Contracts
- **Solidity** for smart contract development
- **Hardhat** for development environment
- **ABDK Libraries** for mathematical operations

### Key Dependencies
- `@ethersproject/providers`: Ethereum provider utilities
- `ethers`: Ethereum library for dApp development
- `framer-motion`: Animation library
- `lucide-react`: Icon library

---

## 🛠 Getting Started

### Prerequisites

- Node.js (v14+)
- MetaMask browser extension
- Access to Mega Testnet (for testing)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd Qswap_ql
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

### Smart Contract Development

Navigate to the contracts directory for smart contract development:

```bash
cd contracts
npm install
npx hardhat compile
```

---

## 📱 Application Structure

### Main Views

1. **Swap View** (`/swap`)
   - Token swapping interface
   - Real-time price calculations
   - Token balance display
   - Swap execution

2. **Pools View** (`/pools`)
   - Liquidity pool creation
   - Pool management interface
   - Fee tier selection (1%, 5%, 30%)
   - Pool discovery and joining

3. **Token Creation** (`/create-token`)
   - Custom token creation
   - Token management
   - Token listing and details

### Component Architecture

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx          # Navigation and wallet connection
│   │   └── Footer.tsx          # Application footer
│   ├── Swap/
│   │   ├── SwapCard.tsx        # Main swap interface
│   │   ├── TokenSelector.tsx   # Token selection modal
│   │   └── SwapSettings.tsx    # Swap configuration
│   ├── Pools/
│   │   ├── Pool.tsx           # Pool management interface
│   │   ├── Pools.tsx          # Pool discovery
│   │   └── MyPools.tsx        # User's pools
│   ├── Token/
│   │   ├── Token.tsx          # Token management container
│   │   ├── CreateToken.tsx    # Token creation form
│   │   └── MyToken.tsx        # User's tokens
│   ├── UI/
│   │   ├── ConnectButton.tsx  # Wallet connection
│   │   ├── Modal.tsx          # Reusable modal component
│   │   └── LoadingScreen.tsx  # Loading states
│   └── Loading/
│       └── LoadingScreen.tsx  # Application loading
├── context/
│   └── WalletContext.tsx      # Wallet state management
├── interfaces/
│   └── Interfaces.tsx         # TypeScript interfaces
└── utils/
    ├── swap.ts               # Swap functionality
    ├── poolDeploy.ts         # Pool deployment
    ├── tokenDeploy.ts        # Token deployment
    ├── checkBalance.ts       # Balance checking
    ├── getPairInfo.ts        # Pool information
    └── constants.ts          # Application constants
```

---

## 🔧 Smart Contract Architecture

### Core Contracts

1. **QswapConstantProductPair**
   - Handles token swaps using constant product formula (x * y = k)
   - Manages liquidity provision and removal
   - Calculates swap amounts and fees

2. **QswapProxy**
   - Factory contract for creating trading pairs
   - Routes swap and liquidity operations
   - Maintains pair registry

3. **TokenBalanceUpdater**
   - Utility contract for balance updates
   - Optimizes gas costs for balance operations

### Error Handling

The protocol uses short error codes for gas optimization:

- **A0-A1**: Input validation errors
- **B0-B2**: Liquidity-related errors
- **C0-C1**: Liquidity token errors
- **D0-D2**: Pair/Proxy errors

---

## 🎯 Usage Guide

### For Testnet Users

1. **Setup MetaMask**
   - Install MetaMask browser extension
   - Switch to Mega Testnet (not Mainnet)
   - Ensure you have testnet tokens

2. **Create Tokens**
   - Navigate to "Tokens" section
   - Create at least 2 custom tokens
   - Save token addresses for later use

3. **Create Liquidity Pool**
   - Go to "Pool" section
   - Create a new liquidity pool with your tokens
   - Select appropriate fee tier

4. **Start Swapping**
   - Navigate to "Swap" section
   - Select tokens to swap
   - Execute trades

### Local Storage Data

The application stores the following data locally:
- `ProxyAddress`: Deployed proxy contract address
- `UpdaterAddress`: Token balance updater contract address
- `PairAddresses`: Created trading pairs
- `walletDisconnected`: Wallet connection state

---

## 🧪 Development Notes

### Current Limitations
- Uses local storage for data persistence (temporary)
- Testnet-only functionality
- No backend integration yet

### Planned Features
- Backend integration for persistent storage
- Mainnet deployment
- Advanced trading features
- Analytics and charts
- Mobile app development

### Development Commands

```bash
# Frontend development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Smart contract development
cd contracts
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat deploy   # Deploy contracts
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Security Notice

This is a development project. Do not use with real assets or on mainnet without proper security audits and testing.
