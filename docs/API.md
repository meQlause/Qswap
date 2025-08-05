# Qswap API Documentation

## Smart Contract Interfaces

### QswapProxy Contract

The factory contract that creates and manages trading pairs.

#### Core Functions

##### `createPair(address tokenX, address tokenY)`
Creates a new trading pair for two tokens.

**Parameters:**
- `tokenX` (address): First token contract address
- `tokenY` (address): Second token contract address

**Returns:**
- `address`: Address of the created pair contract

**Events:**
- `PairCreated(address indexed tokenX, address indexed tokenY, address pair, uint256 allPairsLength)`

##### `getPair(address tokenX, address tokenY)`
Retrieves the pair address for two tokens.

**Parameters:**
- `tokenX` (address): First token contract address
- `tokenY` (address): Second token contract address

**Returns:**
- `address`: Pair contract address (zero if pair doesn't exist)

##### `allPairs(uint256 index)`
Returns the pair at the given index.

**Parameters:**
- `index` (uint256): Index of the pair

**Returns:**
- `address`: Pair contract address

##### `allPairsLength()`
Returns the total number of pairs.

**Returns:**
- `uint256`: Total number of pairs

### QswapConstantProductPair Contract

The main pair contract that handles swaps and liquidity operations.

#### Swap Functions

##### `swap(address tokenIn, uint256 amountIn, address recipient)`
Executes a token swap.

**Parameters:**
- `tokenIn` (address): Input token address
- `amountIn` (uint256): Amount of input tokens
- `recipient` (address): Recipient of output tokens

**Returns:**
- `uint256`: Amount of output tokens received

**Events:**
- `Swap(address indexed sender, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)`

##### `getAmountOut(uint256 amountIn, address tokenIn)`
Calculates the output amount for a given input.

**Parameters:**
- `amountIn` (uint256): Input amount
- `tokenIn` (address): Input token address

**Returns:**
- `uint256`: Calculated output amount

#### Liquidity Functions

##### `addLiquidity(uint256 amountX, uint256 amountY, address recipient)`
Adds liquidity to the pool.

**Parameters:**
- `amountX` (uint256): Amount of token X
- `amountY` (uint256): Amount of token Y
- `recipient` (address): Recipient of LP tokens

**Returns:**
- `uint256`: Amount of LP tokens minted

**Events:**
- `LiquidityAdded(address indexed provider, uint256 amountX, uint256 amountY, uint256 liquidity)`

##### `removeLiquidity(uint256 liquidity, address recipient)`
Removes liquidity from the pool.

**Parameters:**
- `liquidity` (uint256): Amount of LP tokens to burn
- `recipient` (address): Recipient of underlying tokens

**Returns:**
- `(uint256, uint256)`: Amounts of token X and Y received

**Events:**
- `LiquidityRemoved(address indexed provider, uint256 amountX, uint256 amountY, uint256 liquidity)`

#### View Functions

##### `getReserves()`
Returns the current reserves of both tokens.

**Returns:**
- `(uint256, uint256)`: Reserves of token X and Y

##### `tokenX()`
Returns the address of token X.

**Returns:**
- `address`: Token X contract address

##### `tokenY()`
Returns the address of token Y.

**Returns:**
- `address`: Token Y contract address

##### `totalSupply()`
Returns the total supply of LP tokens.

**Returns:**
- `uint256`: Total LP token supply

### TokenBalanceUpdater Contract

Utility contract for efficient balance updates.

#### Functions

##### `updateBalance(address token, address account)`
Updates the balance for a specific token and account.

**Parameters:**
- `token` (address): Token contract address
- `account` (address): Account address

**Returns:**
- `uint256`: Updated balance

## Frontend Utility Functions

### Wallet Management

#### `connectWallet()`
Connects to MetaMask wallet.

**Returns:**
- `Promise<void>`

**Throws:**
- `Error`: If MetaMask is not installed
- `Error`: If connection fails

#### `disconnectWallet()`
Disconnects from MetaMask wallet.

**Returns:**
- `void`

### Token Operations

#### `deployToken(name: string, symbol: string)`
Deploys a new ERC20 token.

**Parameters:**
- `name` (string): Token name
- `symbol` (string): Token symbol

**Returns:**
- `Promise<{address: string, txHash: string}>`

**Throws:**
- `Error`: If deployment fails

#### `getTokenInfo(address: string)`
Retrieves token information.

**Parameters:**
- `address` (string): Token contract address

**Returns:**
- `Promise<Token | null>`

**Token Interface:**
```typescript
interface Token {
  name: string;
  symbol: string;
  totalSupply: string;
  holders: number;
  address: string;
}
```

#### `getTokenBalance(address: string)`
Gets token balance for connected wallet.

**Parameters:**
- `address` (string): Token contract address

**Returns:**
- `Promise<number>`

### Pool Operations

#### `deployProxyContract()`
Deploys the proxy factory contract.

**Returns:**
- `Promise<{proxyAddress: string, updaterAddress: string}>`

#### `deployNewPool(tokenX: string, tokenY: string, fee: number)`
Creates a new liquidity pool.

**Parameters:**
- `tokenX` (string): First token address
- `tokenY` (string): Second token address
- `fee` (number): Fee tier (1, 5, or 30)

**Returns:**
- `Promise<{pairAddress: string, lpTokenAddress: string}>`

#### `getPairInfo(pairAddress: string)`
Retrieves pair information.

**Parameters:**
- `pairAddress` (string): Pair contract address

**Returns:**
- `Promise<PairInfo | null>`

**PairInfo Interface:**
```typescript
interface PairInfo {
  tokenX: string;
  tokenY: string;
  reserveX: string;
  reserveY: string;
  totalSupply: string;
  fee: number;
}
```

### Swap Operations

#### `swapToken(proxyAddress: string, tokenIn: string, tokenOut: string, amountIn: string)`
Executes a token swap.

**Parameters:**
- `proxyAddress` (string): Proxy contract address
- `tokenIn` (string): Input token address
- `tokenOut` (string): Output token address
- `amountIn` (string): Input amount

**Returns:**
- `Promise<{txHash: string, amountOut: string}>`

#### `calculateSwapOutput(amountIn: number, reserveIn: number, reserveOut: number, fee: number)`
Calculates swap output amount.

**Parameters:**
- `amountIn` (number): Input amount
- `reserveIn` (number): Input token reserve
- `reserveOut` (number): Output token reserve
- `fee` (number): Fee percentage (1, 5, or 30)

**Returns:**
- `number`: Calculated output amount

## Error Codes

### Contract Error Codes

#### Pair Contract (QswapConstantProductPair)
- `A0`: INSUFFICIENT_INPUT_AMOUNT
- `A1`: INVALID_RECIPIENT
- `B0`: INSUFFICIENT_LIQUIDITY
- `B1`: INSUFFICIENT_OUTPUT_AMOUNT
- `B2`: INSUFFICIENT_LIQUIDITY_AMOUNT
- `C0`: INSUFFICIENT_LIQUIDITY_BURNED
- `C1`: INSUFFICIENT_LIQUIDITY_BALANCE

#### Proxy Contract (QswapProxy)
- `D0`: IDENTICAL_ADDRESSES
- `D1`: PAIR_EXISTS
- `D2`: PAIR_DOES_NOT_EXIST

### Frontend Error Handling

#### Wallet Errors
```typescript
enum WalletError {
  METAMASK_NOT_INSTALLED = "Please install MetaMask!",
  CONNECTION_FAILED = "Failed to connect wallet",
  NETWORK_ERROR = "Please switch to Mega Testnet",
  ACCOUNT_CHANGED = "Account changed, please reconnect"
}
```

#### Transaction Errors
```typescript
enum TransactionError {
  INSUFFICIENT_BALANCE = "Insufficient balance",
  INSUFFICIENT_LIQUIDITY = "Insufficient liquidity",
  INVALID_TOKEN_ADDRESS = "Invalid token address",
  SWAP_FAILED = "Swap failed, please try again"
}
```

## Event Listeners

### Contract Events

#### Pair Events
```typescript
// Swap event
event Swap(
  address indexed sender,
  address indexed tokenIn,
  address indexed tokenOut,
  uint256 amountIn,
  uint256 amountOut
);

// Liquidity events
event LiquidityAdded(
  address indexed provider,
  uint256 amountX,
  uint256 amountY,
  uint256 liquidity
);

event LiquidityRemoved(
  address indexed provider,
  uint256 amountX,
  uint256 amountY,
  uint256 liquidity
);
```

#### Factory Events
```typescript
event PairCreated(
  address indexed tokenX,
  address indexed tokenY,
  address pair,
  uint256 allPairsLength
);
```

### Frontend Event Listeners

#### Wallet Events
```typescript
// MetaMask account change
ethereum.on('accountsChanged', (accounts: string[]) => {
  // Handle account change
});

// MetaMask network change
ethereum.on('chainChanged', (chainId: string) => {
  // Handle network change
});
```

#### Transaction Events
```typescript
// Transaction confirmation
contract.on('Swap', (sender, tokenIn, tokenOut, amountIn, amountOut) => {
  // Update UI after successful swap
});

// Liquidity events
contract.on('LiquidityAdded', (provider, amountX, amountY, liquidity) => {
  // Update pool information
});
```

## Constants

### Network Configuration
```typescript
const NETWORKS = {
  MEGA_TESTNET: {
    chainId: '0x1B9', // 441
    name: 'Mega Testnet',
    rpcUrl: 'https://rpc-testnet.mega.com',
    explorer: 'https://explorer-testnet.mega.com'
  }
};
```

### Fee Tiers
```typescript
const FEE_TIERS = {
  LOW: 1,    // 0.01%
  MEDIUM: 5, // 0.05%
  HIGH: 30   // 0.3%
} as const;
```

### Gas Limits
```typescript
const GAS_LIMITS = {
  TOKEN_DEPLOYMENT: 2000000,
  PAIR_CREATION: 3000000,
  SWAP_EXECUTION: 150000,
  LIQUIDITY_ADD: 200000,
  LIQUIDITY_REMOVE: 150000
};
```

## Usage Examples

### Creating a Token
```typescript
import { deployToken } from '../utils/tokenDeploy';

const createToken = async () => {
  try {
    const result = await deployToken('MyToken', 'MTK');
    console.log('Token deployed:', result.address);
    localStorage.setItem('MyToken', result.address);
  } catch (error) {
    console.error('Token deployment failed:', error);
  }
};
```

### Creating a Pool
```typescript
import { deployNewPool } from '../utils/poolDeploy';

const createPool = async () => {
  try {
    const tokenX = localStorage.getItem('TokenX');
    const tokenY = localStorage.getItem('TokenY');
    
    const result = await deployNewPool(tokenX, tokenY, 5); // 0.05% fee
    console.log('Pool created:', result.pairAddress);
  } catch (error) {
    console.error('Pool creation failed:', error);
  }
};
```

### Executing a Swap
```typescript
import { swapToken } from '../utils/swap';

const executeSwap = async () => {
  try {
    const proxyAddress = localStorage.getItem('ProxyAddress');
    const result = await swapToken(
      proxyAddress,
      tokenInAddress,
      tokenOutAddress,
      '1000000000000000000' // 1 token (18 decimals)
    );
    console.log('Swap executed:', result.txHash);
  } catch (error) {
    console.error('Swap failed:', error);
  }
};
```