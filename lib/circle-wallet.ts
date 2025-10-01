import {
  toPasskeyTransport,
  toWebAuthnCredential,
  toModularTransport,
  toCircleSmartAccount,
  encodeTransfer,
  WebAuthnMode,
} from '@circle-fin/modular-wallets-core';
import { createPublicClient } from 'viem';
import { createBundlerClient, toWebAuthnAccount } from 'viem/account-abstraction';
import { base, baseSepolia } from 'viem/chains';

const clientKey = process.env.NEXT_PUBLIC_CIRCLE_CLIENT_KEY as string;
const clientUrl = process.env.NEXT_PUBLIC_CIRCLE_CLIENT_URL as string;
const useMainnet = process.env.NEXT_PUBLIC_USE_MAINNET === 'true';

// Select chain based on environment (force testnet for now)
const chain = baseSepolia;
const chainName = 'baseSepolia';



export interface MSCAWallet {
  address: string;
  smartAccount: any;
  bundlerClient: any;
}

/**
 * Register a new passkey and create MSCA wallet
 */
export async function registerWalletWithPasskey(username: string): Promise<MSCAWallet> {
  try {
    
    // 1. Create passkey transport
    const passkeyTransport = toPasskeyTransport(clientUrl, clientKey);
    
    // 2. Register new passkey
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Register,
      username,
    });

    // 3. Create wallet from credential
    return await createWalletFromCredential(credential);
  } catch (error) {
    console.error('Error registering wallet:', error);
    throw error;
  }
}

/**
 * Login with existing passkey
 */
export async function loginWithPasskey(username: string): Promise<MSCAWallet> {
  try {
    
    // 1. Create passkey transport
    const passkeyTransport = toPasskeyTransport(clientUrl, clientKey);
    
    // 2. Login with existing passkey
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
      username,
    });

    // 3. Create wallet from credential
    return await createWalletFromCredential(credential);
  } catch (error) {
    console.error('Error logging in with passkey:', error);
    throw error;
  }
}

/**
 * Create wallet from WebAuthn credential
 */
async function createWalletFromCredential(credential: any): Promise<MSCAWallet> {
  // 1. Create modular transport
  const modularTransport = toModularTransport(
    `${clientUrl}/${chainName}`,
    clientKey
  );

  // 2. Create public client
  const client = createPublicClient({
    chain,
    transport: modularTransport,
  });

  // 3. Create Circle Smart Account
  const smartAccount = await toCircleSmartAccount({
    client,
    owner: toWebAuthnAccount({
      credential,
    }),
  });

  // 4. Create bundler client
  const bundlerClient = createBundlerClient({
    account: smartAccount,
    chain,
    transport: modularTransport,
  });

  return {
    address: smartAccount.address,
    smartAccount,
    bundlerClient,
  };
}

/**
 * Send gasless USDC transfer
 */
export async function sendGaslessTransfer(
  bundlerClient: any,
  to: string,
  amount: bigint,
  tokenAddress: string
): Promise<string> {
  try {
    // Send user operation with paymaster (gasless)
    const userOpHash = await bundlerClient.sendUserOperation({
      calls: [encodeTransfer(to as `0x${string}`, tokenAddress as `0x${string}`, amount)],
      paymaster: true,
    });

    // Wait for transaction receipt
    const { receipt } = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    return receipt.transactionHash;
  } catch (error) {
    console.error('Error sending gasless transfer:', error);
    throw error;
  }
}

/**
 * Send batch gasless transfers
 */
export async function sendBatchGaslessTransfer(
  bundlerClient: any,
  recipients: Array<{ address: string; amount: bigint }>,
  tokenAddress: string
): Promise<string> {
  try {
    // Create multiple transfer calls
    const calls = recipients.map((recipient) =>
      encodeTransfer(recipient.address as `0x${string}`, tokenAddress as `0x${string}`, recipient.amount)
    );

    // Send batch user operation with paymaster (gasless)
    const userOpHash = await bundlerClient.sendUserOperation({
      calls,
      paymaster: true,
    });

    // Wait for transaction receipt
    const { receipt } = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    return receipt.transactionHash;
  } catch (error) {
    console.error('Error sending batch gasless transfer:', error);
    throw error;
  }
}
