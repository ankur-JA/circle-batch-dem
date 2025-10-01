# Circle Batch Demo - MSCA Wallet with Passkey

This is a Next.js application that demonstrates Circle's Modular Smart Contract Account (MSCA) wallets with passkey authentication and batch USDC payouts.

## Features

- 🔐 **Passkey Authentication**: Secure wallet creation and login using WebAuthn (biometrics, Face ID, Touch ID)
- 💼 **Circle Smart Accounts**: Non-custodial smart contract wallets with gasless transactions
- 💸 **Batch Payouts**: Send USDC to multiple recipients in a single transaction
- ⛽ **Gasless Transactions**: Built-in paymaster support for sponsored transactions
- 🔗 **Base Network**: Supports both Base mainnet and Base Sepolia testnet

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Circle developer account with API credentials

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory with your Circle credentials:

```env
# Circle Modular Wallets Configuration
NEXT_PUBLIC_CIRCLE_CLIENT_KEY=your-client-key-here
NEXT_PUBLIC_CIRCLE_CLIENT_URL=your-client-url-here

# Circle API Configuration (for batch execution)
CIRCLE_API_KEY=your-circle-api-key
WALLET_ID=your-wallet-id
USDC_CONTRACT_ADDRESS=your-usdc-contract-address
MSCA_CONTRACT_ADDRESS=your-msca-contract-address
ENTITY_SECRET_CIPHERTEXT=your-entity-secret

# Network Configuration
NEXT_PUBLIC_USE_MAINNET=false
```

### Get Your Circle Credentials

1. Go to the [Circle Developer Console](https://console.circle.com/)
2. Create a new project or select an existing one
3. Navigate to the Modular Wallets section
4. Copy your Client Key and Client URL

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How It Works

### 1. Wallet Creation

The app uses Circle's Modular Wallets SDK to create smart contract wallets secured by passkeys:

- User enters a username
- Browser prompts for biometric authentication (Face ID, Touch ID, etc.)
- Circle Smart Account is created and linked to the passkey
- Wallet address is displayed and ready to use

### 2. Batch Payouts

Once logged in, users can:

- Add multiple recipient addresses manually
- Upload a CSV file with recipient addresses and amounts
- Send batch payments in a single gasless transaction
- Track transaction status and view results

### 3. Gasless Transactions

All transactions are sponsored by Circle's paymaster service, meaning:

- No gas fees for users
- Instant transaction execution
- Better UX for Web3 applications

## Project Structure

```
circle-batch-demo/
├── app/
│   ├── api/                    # API routes
│   │   └── batch-execution/    # Batch transfer endpoint
│   ├── components/             # React components
│   │   ├── Login.tsx          # Passkey authentication
│   │   ├── Payout.tsx         # Main payout interface
│   │   ├── PayoutForm.tsx     # Batch transfer form
│   │   └── WalletInfo.tsx     # Wallet details display
│   ├── context/               # React context
│   │   └── WalletContext.tsx  # Wallet state management
│   └── providers.tsx          # App providers
├── lib/
│   ├── circle-wallet.ts       # Circle SDK integration
│   ├── constants.ts           # App constants
│   └── types/                 # TypeScript types
└── public/                    # Static assets

```

## Key Technologies

- **Next.js 15**: React framework with App Router
- **Circle Modular Wallets SDK**: MSCA wallet creation and management
- **Wagmi & Viem**: Ethereum interactions
- **WebAuthn**: Passkey authentication
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

## API Endpoints

### POST `/api/batch-execution`

Execute a batch transfer to multiple recipients.

**Request Body:**
```json
{
  "token": "USDC",
  "recipients": [
    { "recipientId": "0x123...", "amount": "10.0" },
    { "recipientId": "0x456...", "amount": "5.0" }
  ]
}
```

## Learn More

- [Circle Developer Docs](https://developers.circle.com/)
- [Circle Modular Wallets](https://developers.circle.com/w3s/docs/modular-wallets-overview)
- [Next.js Documentation](https://nextjs.org/docs)
- [WebAuthn Guide](https://webauthn.guide/)

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables
4. Deploy

## Security Notes

- Never commit your `.env.local` file
- Keep your Circle API keys secure
- Passkeys are stored securely by the user's device
- Smart contract wallets are non-custodial

## License

MIT

## Support

For issues or questions:
- Circle Support: [https://support.circle.com](https://support.circle.com)
- GitHub Issues: Create an issue in this repository