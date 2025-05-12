# Qswap Protocol

Qswap is a decentralized exchange (DEX) protocol that implements an automated market maker (AMM) using constant product formula (x * y = k). The protocol consists of two main contracts:

## Core Contracts

### QswapConstantProductPair
The main pair contract that handles:
- Token swaps
- Liquidity provision
- Liquidity removal
- Price calculations using constant product formula

### QswapProxy
The factory contract that:
- Creates new trading pairs
- Routes swap and liquidity operations
- Maintains pair registry

## Architecture

```
QswapProxy
    │
    ├── Creates
    │   └── QswapConstantProductPair
    │       ├── Manages
    │       │   ├── TokenX
    │       │   ├── TokenY
    │       │   └── LiquidityToken
    │       └── Uses
    │           └── TokenBalanceUpdater
    └── Uses
        └── TokenBalanceUpdater
```

## Error Codes

The protocol uses short error codes to optimize gas costs while maintaining readability. Here's the complete list:

### Pair Contract (QswapConstantProductPair)

#### Input Validation Errors (A)
- `A0`: INSUFFICIENT_INPUT_AMOUNT - Input amount must be greater than 0
- `A1`: INVALID_RECIPIENT - Recipient address cannot be zero address

#### Liquidity Errors (B)
- `B0`: INSUFFICIENT_LIQUIDITY - Pool has insufficient liquidity
- `B1`: INSUFFICIENT_OUTPUT_AMOUNT - Swap would result in zero output
- `B2`: INSUFFICIENT_LIQUIDITY_AMOUNT - Liquidity addition would result in zero tokens

#### Liquidity Token Errors (C)
- `C0`: INSUFFICIENT_LIQUIDITY_BURNED - Liquidity amount to burn must be greater than 0
- `C1`: INSUFFICIENT_LIQUIDITY_BALANCE - User has insufficient liquidity tokens

### Proxy Contract (QswapProxy)

#### Pair/Proxy Errors (D)
- `D0`: IDENTICAL_ADDRESSES - Cannot create pair with same token addresses
- `D1`: PAIR_EXISTS - Pair already exists for these tokens
- `D2`: PAIR_DOES_NOT_EXIST - No pair exists for these tokens

## Key Features

1. **Constant Product AMM**
   - Uses x * y = k formula for price determination
   - Maintains constant product of reserves
   - Implements 0.3% fee on swaps

2. **Liquidity Management**
   - Liquidity providers receive LP tokens
   - LP tokens represent proportional ownership of the pool
   - Liquidity can be added or removed at any time

3. **Swap Mechanism**
   - Direct token swaps with price impact
   - Fee collection on each swap
   - Slippage protection through minimum output checks

4. **Security Features**
   - Reentrancy protection
   - Input validation
   - Balance checks
   - Proper access control

## Usage

### Creating a Pair
```solidity
// Create a new trading pair
proxy.createPair(tokenX, amountX, tokenY, amountY, fee);
```

### Adding Liquidity
```solidity
// Add liquidity to an existing pair
proxy.addLiquidity(tokenX, tokenY, amount);
```

### Removing Liquidity
```solidity
// Remove liquidity from a pair
proxy.removeLiquidity(liquidityTokenAddress, amount);
```

### Swapping Tokens
```solidity
// Swap tokens through a pair
proxy.swap(tokenX, tokenY, amount);
```