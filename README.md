# DevSpot Circ - Circle MSCA Batch Payouts

A Next.js application for batch USDC payouts using Circle's Modular Smart Contract Accounts (MSCA) with passkey authentication.

## Features

- 🔐 **Passkey Authentication** - Secure wallet creation using WebAuthn (biometrics, Face ID, Touch ID)
- 💼 **Circle Smart Accounts** - Non-custodial smart contract wallets
- 💸 **Batch Payouts** - Send USDC to multiple recipients in a single transaction
- ⛽ **Gasless Transactions** - Circle Paymaster covers all gas fees
- 🔗 **Base Sepolia Testnet** - Safe testing environment

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Circle Credentials
1. Go to [Circle Developer Console](https://console.circle.com/)
2. Create a project and navigate to Modular Wallets
3. Copy your Client Key and Client URL

### 3. Environment Setup
Create `.env.local` file:
```env
NEXT_PUBLIC_CIRCLE_CLIENT_KEY=your-client-key-here
NEXT_PUBLIC_CIRCLE_CLIENT_URL=https://modular-sdk.circle.com/v1/rpc/w3s/buidl
NEXT_PUBLIC_USE_MAINNET=false
```

### 4. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Create Wallet** - Enter username and authenticate with passkey
2. **Add Recipients** - Click "Add Row" to add recipient addresses and amounts
3. **Batch Transfer** - Click "Confirm Transfer" to send USDC to all recipients
4. **Gasless** - All transactions are sponsored by Circle Paymaster

## Get Testnet Tokens

- **Base Sepolia Faucet**: [https://bridge.base.org/deposit](https://bridge.base.org/deposit)
- **USDC Faucet**: [https://faucet.circle.com/](https://faucet.circle.com/)

## Technology Stack

- **Next.js 14** - React framework
- **Circle Modular Wallets SDK** - MSCA wallet creation
- **WebAuthn** - Passkey authentication
- **Viem** - Blockchain interactions
- **Base Sepolia** - Testnet network

## License

© 2025 DevSpot Circ. All rights reserved.