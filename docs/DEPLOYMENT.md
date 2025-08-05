# Qswap Deployment Guide

## Overview

This guide covers the deployment process for both the frontend application and smart contracts. The deployment is designed to work with the Mega Testnet for development and testing purposes.

## Prerequisites

### Required Software
- Node.js (v14 or higher)
- npm or yarn package manager
- MetaMask browser extension
- Git

### Network Requirements
- Access to Mega Testnet
- Testnet tokens for gas fees
- MetaMask configured for Mega Testnet

## Smart Contract Deployment

### 1. Environment Setup

Navigate to the contracts directory:
```bash
cd contracts
```

Install dependencies:
```bash
npm install
```

### 2. Network Configuration

The project uses Hardhat for smart contract development. Configure your network settings in `hardhat.config.js`:

```javascript
module.exports = {
  solidity: "0.8.19",
  networks: {
    megaTestnet: {
      url: "https://rpc-testnet.mega.com",
      chainId: 441,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### 3. Environment Variables

Create a `.env` file in the contracts directory:
```bash
PRIVATE_KEY=your_private_key_here
MEGA_TESTNET_RPC=https://rpc-testnet.mega.com
```

### 4. Contract Compilation

Compile all smart contracts:
```bash
npx hardhat compile
```

This will generate artifacts in the `artifacts/` directory.

### 5. Contract Deployment

#### Deploy Token Balance Updater
```bash
npx hardhat run scripts/deployUpdater.js --network megaTestnet
```

#### Deploy Proxy Contract
```bash
npx hardhat run scripts/deployProxy.js --network megaTestnet
```

#### Deploy Token Creator
```bash
npx hardhat run scripts/deployTokenCreator.js --network megaTestnet
```

### 6. Verification

After deployment, verify your contracts on the Mega Testnet explorer:
```bash
npx hardhat verify --network megaTestnet CONTRACT_ADDRESS
```

## Frontend Deployment

### 1. Environment Setup

Return to the project root:
```bash
cd ..
```

Install dependencies:
```bash
npm install
```

### 2. Configuration

Update the contract addresses in your frontend configuration. The application uses local storage to manage contract addresses, but you can also set them in environment variables:

Create a `.env` file in the project root:
```bash
VITE_PROXY_ADDRESS=your_deployed_proxy_address
VITE_UPDATER_ADDRESS=your_deployed_updater_address
VITE_TOKEN_CREATOR_ADDRESS=your_deployed_token_creator_address
VITE_NETWORK_CHAIN_ID=441
VITE_NETWORK_NAME="Mega Testnet"
```

### 3. Development Build

For local development:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Production Build

Build the application for production:
```bash
npm run build
```

This creates a `dist/` directory with optimized files.

### 5. Deployment Options

#### Option A: Static Hosting (Recommended)

Deploy to a static hosting service like Vercel, Netlify, or GitHub Pages:

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option B: Docker Deployment

Build the Docker image:
```bash
docker build -f Dockerfile.prod -t qswap-app .
```

Run the container:
```bash
docker run -p 80:80 qswap-app
```

#### Option C: Traditional Web Server

Upload the contents of the `dist/` directory to your web server.

## Docker Configuration

### Production Dockerfile

The project includes a `Dockerfile.prod` for containerized deployment:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

The `nginx.conf` file is optimized for the React application:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## Environment-Specific Configurations

### Development Environment

```typescript
// src/utils/constants.ts
export const NETWORK_CONFIG = {
  chainId: '0x1B9', // 441
  name: 'Mega Testnet',
  rpcUrl: 'https://rpc-testnet.mega.com',
  explorer: 'https://explorer-testnet.mega.com'
};
```

### Production Environment

```typescript
// src/utils/constants.ts
export const NETWORK_CONFIG = {
  chainId: process.env.VITE_NETWORK_CHAIN_ID || '0x1B9',
  name: process.env.VITE_NETWORK_NAME || 'Mega Testnet',
  rpcUrl: process.env.VITE_RPC_URL || 'https://rpc-testnet.mega.com',
  explorer: process.env.VITE_EXPLORER_URL || 'https://explorer-testnet.mega.com'
};
```

## Deployment Checklist

### Pre-Deployment
- [ ] All smart contracts compiled successfully
- [ ] Contracts deployed to Mega Testnet
- [ ] Contract addresses verified on explorer
- [ ] Environment variables configured
- [ ] Frontend builds without errors
- [ ] All tests passing

### Deployment
- [ ] Smart contracts deployed and verified
- [ ] Frontend built for production
- [ ] Static files uploaded to hosting service
- [ ] Domain configured (if applicable)
- [ ] SSL certificate installed (if applicable)

### Post-Deployment
- [ ] Application accessible via URL
- [ ] MetaMask connection working
- [ ] Token creation functional
- [ ] Pool creation functional
- [ ] Swap functionality working
- [ ] Error handling working correctly

## Monitoring and Maintenance

### Health Checks

Implement health check endpoints for monitoring:

```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

### Error Monitoring

Set up error tracking with services like Sentry:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

Monitor application performance with tools like:
- Google Analytics
- Hotjar for user behavior
- Web Vitals monitoring

## Troubleshooting

### Common Issues

#### 1. Contract Deployment Fails
```bash
# Check gas limits
npx hardhat run scripts/deploy.js --network megaTestnet --gas-limit 5000000

# Check network connection
npx hardhat console --network megaTestnet
```

#### 2. Frontend Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 3. MetaMask Connection Issues
- Ensure MetaMask is connected to Mega Testnet
- Check if the correct network is selected
- Verify RPC URL is accessible

#### 4. Transaction Failures
- Check gas fees and limits
- Verify token balances
- Ensure contract addresses are correct

### Debug Commands

```bash
# Check contract deployment
npx hardhat run scripts/checkDeployment.js --network megaTestnet

# Verify contract bytecode
npx hardhat verify --network megaTestnet CONTRACT_ADDRESS

# Test network connection
npx hardhat console --network megaTestnet
```

## Security Considerations

### Smart Contract Security
- [ ] All contracts audited
- [ ] Access controls implemented
- [ ] Reentrancy protection in place
- [ ] Input validation comprehensive

### Frontend Security
- [ ] Environment variables properly configured
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced in production
- [ ] Content Security Policy implemented

### Network Security
- [ ] RPC endpoint secure and reliable
- [ ] Backup RPC endpoints configured
- [ ] Network monitoring in place

## Backup and Recovery

### Smart Contract Backup
- Store deployed contract addresses securely
- Keep private keys in hardware wallets
- Document deployment procedures

### Frontend Backup
- Version control with Git
- Automated deployment pipelines
- Database backups (when implemented)

## Scaling Considerations

### Smart Contract Scaling
- Consider gas optimization
- Implement batch operations
- Use efficient data structures

### Frontend Scaling
- CDN for static assets
- Load balancing for high traffic
- Caching strategies

## Future Enhancements

### Planned Improvements
- [ ] Multi-network support
- [ ] Advanced trading features
- [ ] Mobile app development
- [ ] Backend integration
- [ ] Analytics dashboard
- [ ] Advanced security features