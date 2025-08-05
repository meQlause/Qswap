# Qswap User Guide

## Getting Started

### Prerequisites

Before using Qswap, ensure you have:

1. **MetaMask Wallet**: Install the MetaMask browser extension
2. **Testnet Tokens**: Get some testnet tokens for gas fees
3. **Mega Testnet Access**: Configure MetaMask for Mega Testnet

### MetaMask Setup

1. **Install MetaMask**
   - Go to [metamask.io](https://metamask.io)
   - Download and install the browser extension
   - Create a new wallet or import existing one

2. **Add Mega Testnet**
   - Open MetaMask
   - Click on the network dropdown
   - Select "Add Network"
   - Enter the following details:
     - **Network Name**: Mega Testnet
     - **RPC URL**: `https://rpc-testnet.mega.com`
     - **Chain ID**: `441`
     - **Currency Symbol**: MEGA
     - **Block Explorer**: `https://explorer-testnet.mega.com`

3. **Switch to Mega Testnet**
   - Select "Mega Testnet" from the network dropdown
   - Ensure you're connected to the correct network

## Application Overview

Qswap has three main sections:

1. **Swap**: Exchange tokens with other users
2. **Pools**: Create and manage liquidity pools
3. **Tokens**: Create and manage your custom tokens

## Token Creation

### Step 1: Access Token Section

1. Open the Qswap application
2. Click on "Tokens" in the navigation menu
3. You'll see two tabs: "Create Token" and "My Tokens"

### Step 2: Create Your First Token

1. **Fill Token Details**
   - **Token Name**: Enter a descriptive name (e.g., "My Test Token")
   - **Token Symbol**: Enter a short symbol (e.g., "MTT")
   - **Initial Supply**: Enter the total supply (e.g., 1000000)

2. **Deploy Token**
   - Click "Create Token"
   - MetaMask will pop up asking for transaction confirmation
   - Review the transaction details
   - Click "Confirm" to deploy your token

3. **Save Token Address**
   - After successful deployment, copy the token address
   - Save it somewhere safe for future use
   - You can also find it in the "My Tokens" tab

### Step 3: Add Token to MetaMask

1. **Open MetaMask**
2. **Click "Import Tokens"**
3. **Enter Token Address**
   - Paste the token address you saved
   - MetaMask will auto-fill the token details
   - Click "Add Custom Token"
   - Confirm the addition

### Step 4: Create Multiple Tokens

Repeat the process to create at least 2-3 tokens for testing:
- Token A: "Test Token Alpha" (TTA)
- Token B: "Test Token Beta" (TTB)
- Token C: "Test Token Gamma" (TTG)

## Liquidity Pool Creation

### Step 1: Access Pool Section

1. Click on "Pools" in the navigation menu
2. You'll see two tabs: "Pools" and "My Pools"

### Step 2: Deploy Proxy Contract (First Time Only)

If this is your first time using the application:

1. **Click "Deploy Proxy"**
   - This deploys the factory contract
   - MetaMask will ask for confirmation
   - Wait for the transaction to complete

2. **Save Proxy Address**
   - The proxy address will be automatically saved
   - You can find it in local storage if needed

### Step 3: Create a Liquidity Pool

1. **Select Tokens**
   - **Token X**: Choose your first token
   - **Token Y**: Choose your second token
   - Ensure the addresses are valid

2. **Set Amounts**
   - **Token X Amount**: Enter the amount of Token X to provide
   - **Token Y Amount**: Enter the amount of Token Y to provide
   - The amounts should be reasonable for testing

3. **Choose Fee Tier**
   - **0.01%**: Low fee, high volume
   - **0.05%**: Medium fee, balanced
   - **0.3%**: High fee, stable pairs

4. **Create Pool**
   - Click "Create Pool"
   - MetaMask will ask for confirmation
   - Wait for the transaction to complete

### Step 4: Add Liquidity to Existing Pool

1. **Find a Pool**
   - Browse available pools in the "Pools" tab
   - Click on a pool to view details

2. **Add Liquidity**
   - Enter the amount of tokens you want to provide
   - Click "Add Liquidity"
   - Confirm the transaction in MetaMask

## Token Swapping

### Step 1: Access Swap Section

1. Click on "Swap" in the navigation menu
2. You'll see the swap interface with two token selectors

### Step 2: Select Tokens

1. **Select Input Token**
   - Click on the first token selector
   - Choose the token you want to swap from
   - Enter the amount you want to swap

2. **Select Output Token**
   - Click on the second token selector
   - Choose the token you want to swap to
   - The output amount will be calculated automatically

### Step 3: Review and Execute

1. **Check Details**
   - Review the swap details
   - Check the exchange rate
   - Verify the output amount

2. **Execute Swap**
   - Click "Swap"
   - MetaMask will ask for confirmation
   - Wait for the transaction to complete

### Step 4: Confirm Transaction

1. **Check Transaction Status**
   - Monitor the transaction in MetaMask
   - Wait for confirmation

2. **Verify Results**
   - Check your token balances
   - Verify the swap was successful

## Advanced Features

### Pool Management

#### View Your Pools
1. Go to "Pools" section
2. Click "My Pools" tab
3. View all pools you've created or contributed to

#### Remove Liquidity
1. Select a pool from "My Pools"
2. Click "Remove Liquidity"
3. Enter the amount of LP tokens to burn
4. Confirm the transaction

### Token Management

#### View Token Details
1. Go to "Tokens" section
2. Click "My Tokens" tab
3. View all tokens you've created

#### Check Token Balances
1. Open MetaMask
2. Click on the token in your wallet
3. View current balance and transaction history

## Troubleshooting

### Common Issues

#### 1. MetaMask Connection Problems

**Problem**: Can't connect wallet
**Solution**:
- Ensure MetaMask is installed and unlocked
- Check if you're on the correct network (Mega Testnet)
- Try refreshing the page
- Clear browser cache if needed

#### 2. Transaction Failures

**Problem**: Transactions fail or revert
**Solutions**:
- Check if you have enough tokens for the transaction
- Ensure you have sufficient gas fees
- Verify token addresses are correct
- Try increasing gas limit

#### 3. Token Not Showing

**Problem**: Created token doesn't appear in list
**Solution**:
- Refresh the page
- Check if the transaction was successful
- Verify the token address in MetaMask
- Try importing the token manually

#### 4. Pool Creation Fails

**Problem**: Can't create liquidity pool
**Solutions**:
- Ensure both tokens exist and are valid
- Check if you have sufficient token balances
- Verify the proxy contract is deployed
- Try with different token amounts

#### 5. Swap Fails

**Problem**: Token swap doesn't work
**Solutions**:
- Check if there's sufficient liquidity in the pool
- Verify token addresses are correct
- Ensure you have enough tokens to swap
- Try with a smaller amount

### Error Messages

#### "Insufficient Balance"
- Check your token balance in MetaMask
- Ensure you have enough tokens for the transaction
- Consider the gas fees as well

#### "Insufficient Liquidity"
- The pool doesn't have enough liquidity
- Try a smaller swap amount
- Consider adding liquidity to the pool first

#### "Invalid Token Address"
- Verify the token address is correct
- Check if the token exists on the network
- Try importing the token manually in MetaMask

#### "Transaction Reverted"
- Check the transaction details in MetaMask
- Look for specific error messages
- Try with different parameters

## Best Practices

### Security

1. **Never Share Private Keys**
   - Keep your MetaMask seed phrase secure
   - Don't share private keys or passwords

2. **Verify Transactions**
   - Always review transaction details before confirming
   - Check gas fees and amounts

3. **Use Testnet First**
   - Always test on testnet before mainnet
   - Use small amounts for testing

### Token Management

1. **Save Important Addresses**
   - Keep a record of deployed contract addresses
   - Save token addresses for future use

2. **Test with Small Amounts**
   - Start with small amounts when testing
   - Gradually increase as you become familiar

3. **Monitor Balances**
   - Regularly check token balances
   - Keep track of gas fees

### Pool Management

1. **Diversify Liquidity**
   - Don't put all tokens in one pool
   - Consider different fee tiers

2. **Monitor Pool Performance**
   - Check pool statistics regularly
   - Monitor trading volume and fees

3. **Understand Impermanent Loss**
   - Learn about impermanent loss
   - Consider the risks of providing liquidity

## Tips and Tricks

### Gas Optimization

1. **Batch Transactions**
   - Combine multiple operations when possible
   - Use optimal gas settings

2. **Time Your Transactions**
   - Avoid peak network congestion
   - Monitor gas prices

### User Experience

1. **Bookmark Important Pages**
   - Save frequently used pools
   - Keep track of favorite tokens

2. **Use Keyboard Shortcuts**
   - Learn browser shortcuts for efficiency
   - Use tab navigation effectively

3. **Stay Updated**
   - Follow project updates
   - Join community discussions

## Support and Resources

### Getting Help

1. **Documentation**
   - Read the technical documentation
   - Check the API reference

2. **Community**
   - Join Discord or Telegram groups
   - Ask questions in forums

3. **Development Team**
   - Report bugs through GitHub
   - Contact the team for support

### Useful Links

- **Project Repository**: [GitHub Link]
- **Documentation**: [Docs Link]
- **Community**: [Discord/Telegram Link]
- **Explorer**: [Mega Testnet Explorer]

### Reporting Issues

When reporting issues, include:
1. **Steps to Reproduce**
2. **Expected vs Actual Behavior**
3. **Error Messages**
4. **Browser and MetaMask Version**
5. **Network Information**

## Glossary

### Technical Terms

- **AMM**: Automated Market Maker
- **LP Token**: Liquidity Provider Token
- **Impermanent Loss**: Potential loss from providing liquidity
- **Gas**: Transaction fee on the blockchain
- **Slippage**: Price change during transaction execution

### Application Terms

- **Swap**: Exchange one token for another
- **Pool**: Liquidity pool for trading tokens
- **Liquidity**: Tokens provided to enable trading
- **Fee Tier**: Percentage fee charged on trades
- **Proxy**: Factory contract that creates pools

## Conclusion

Qswap provides a comprehensive DeFi experience with token creation, liquidity management, and trading capabilities. By following this guide, you can safely explore the world of decentralized finance on the Mega Testnet.

Remember to always test with small amounts first and never use real assets on testnet environments. Happy trading!