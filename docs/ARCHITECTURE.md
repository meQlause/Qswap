# Qswap Architecture Documentation

## Overview

Qswap is a decentralized exchange (DEX) application built with a modern React frontend and Solidity smart contracts. The application implements an automated market maker (AMM) using the constant product formula (x * y = k).

## System Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                       │
├─────────────────────────────────────────────────────────────┤
│  App.tsx (Main Container)                                 │
│  ├── WalletProvider (Context)                             │
│  ├── Header (Navigation)                                  │
│  ├── Main Content (View Router)                           │
│  │   ├── SwapCard (Token Swapping)                       │
│  │   ├── Pool.tsx (Liquidity Management)                 │
│  │   └── Token.tsx (Token Creation)                      │
│  └── Footer                                               │
└─────────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    QswapProxy                             │
│                 (Factory Contract)                        │
├─────────────────────────────────────────────────────────────┤
│  ├── Creates QswapConstantProductPair                     │
│  ├── Manages Pair Registry                               │
│  └── Routes Operations                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              QswapConstantProductPair                      │
│              (Pair Contract)                              │
├─────────────────────────────────────────────────────────────┤
│  ├── TokenX (ERC20)                                      │
│  ├── TokenY (ERC20)                                      │
│  ├── LiquidityToken (LP Tokens)                          │
│  ├── Swap Logic (x * y = k)                              │
│  ├── Liquidity Management                                 │
│  └── Fee Calculations                                     │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

### Core Components

#### 1. App.tsx
- **Purpose**: Main application container and view router
- **Key Features**:
  - View state management (`swap`, `pools`, `create-token`)
  - Welcome modal for new users
  - Loading screen management
  - Custom scrollbar styling

#### 2. WalletContext.tsx
- **Purpose**: Web3 wallet state management
- **Key Features**:
  - MetaMask integration
  - Account state management
  - Connection/disconnection handling
  - Persistent connection state

#### 3. SwapCard.tsx
- **Purpose**: Token swapping interface
- **Key Features**:
  - Token selection
  - Amount input with balance validation
  - Price calculation and prediction
  - Swap execution
  - Real-time balance updates

#### 4. Pool.tsx
- **Purpose**: Liquidity pool management
- **Key Features**:
  - Pool creation with custom fee tiers
  - Token pair validation
  - Liquidity provision/removal
  - Pool discovery and joining

#### 5. Token.tsx
- **Purpose**: Token creation and management
- **Key Features**:
  - Custom token creation
  - Token listing and details
  - Token balance management

## Data Flow

### 1. Wallet Connection Flow
```
User clicks Connect → WalletContext.connectWallet() → 
MetaMask popup → Account state update → UI re-render
```

### 2. Token Creation Flow
```
User fills form → Token deployment → Contract address stored → 
Token added to local storage → UI updates
```

### 3. Pool Creation Flow
```
User selects tokens → Validates addresses → Deploys pool contract → 
Records pair in local storage → Updates pool list
```

### 4. Swap Execution Flow
```
User selects tokens → Inputs amount → Calculates output → 
Executes swap → Updates balances → UI refresh
```

## State Management

### Local Storage Schema
```typescript
{
  "ProxyAddress": "0x...",           // Deployed proxy contract
  "UpdaterAddress": "0x...",         // Balance updater contract
  "PairAddresses": {                 // Trading pairs
    "tokenX_address": {
      "tokenY_address": "pair_address"
    }
  },
  "walletDisconnected": "true"       // Connection state
}
```

### React State Structure
```typescript
// Wallet Context
{
  account: string | null,
  isConnecting: boolean
}

// Swap State
{
  token1: TokenlistSwap | null,
  token2: TokenlistSwap | null,
  amountToken1: { amount: number, maxAmount: number },
  predictedOut: number
}

// Pool State
{
  tokenX: TokenSelection,
  tokenY: TokenSelection,
  fee: 1 | 5 | 30
}
```

## Smart Contract Integration

### Contract Interaction Pattern
```typescript
// 1. Get contract instance
const contract = new ethers.Contract(address, abi, signer);

// 2. Execute transaction
const tx = await contract.functionName(params);

// 3. Wait for confirmation
const receipt = await tx.wait();

// 4. Update UI state
updateLocalState(receipt);
```

### Error Handling
The application uses a comprehensive error handling system:
- **Contract Errors**: Short error codes (A0, B0, C0, D0, etc.)
- **User Errors**: Modal notifications with clear messages
- **Network Errors**: Connection status indicators

## Security Considerations

### Current Implementation
- ✅ Input validation on frontend and smart contracts
- ✅ Reentrancy protection in smart contracts
- ✅ Gas optimization with error codes
- ⚠️ Local storage for data persistence (temporary)

### Planned Improvements
- 🔄 Backend integration for persistent storage
- 🔄 Multi-signature wallet support
- 🔄 Advanced trading features
- 🔄 Analytics and monitoring

## Performance Optimizations

### Frontend
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Debouncing**: Input validation and API calls
- **Caching**: Local storage for frequently accessed data

### Smart Contracts
- **Gas Optimization**: Short error codes
- **Batch Operations**: Multiple operations in single transaction
- **Event Logging**: Efficient state change tracking

## Development Workflow

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Code quality check
```

### Smart Contract Development
```bash
cd contracts
npx hardhat compile  # Compile contracts
npx hardhat test     # Run test suite
npx hardhat deploy   # Deploy to network
```

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Component functionality
- **Integration Tests**: User workflows
- **E2E Tests**: Complete user journeys

### Smart Contract Testing
- **Unit Tests**: Individual function testing
- **Integration Tests**: Contract interaction testing
- **Security Tests**: Vulnerability assessment

## Deployment Architecture

### Development Environment
- **Frontend**: Vite dev server (localhost:5173)
- **Smart Contracts**: Hardhat local network
- **Storage**: Local storage

### Production Environment (Planned)
- **Frontend**: CDN deployment
- **Smart Contracts**: Multi-network deployment
- **Storage**: Backend database
- **Monitoring**: Analytics and error tracking

## Future Roadmap

### Phase 1: Core Features ✅
- [x] Token creation
- [x] Pool management
- [x] Token swapping
- [x] Wallet integration

### Phase 2: Enhanced Features 🔄
- [ ] Backend integration
- [ ] Advanced trading features
- [ ] Analytics dashboard
- [ ] Mobile app

### Phase 3: Enterprise Features 📋
- [ ] Multi-signature support
- [ ] Advanced order types
- [ ] Institutional features
- [ ] Cross-chain integration