'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { registerWalletWithPasskey, loginWithPasskey, MSCAWallet } from '../../lib/circle-wallet';

interface WalletContextType {
  activeToken: string;
  refreshBalance: (token: string) => void;
  evmAddress: string | null;
  balances: Record<string, string>;
  setActiveToken: (token: string) => void;
  mscaWallet: MSCAWallet | null;
  registerWallet: (username: string) => Promise<void>;
  loginWallet: (username: string) => Promise<void>;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [activeToken, setActiveTokenState] = useState('USDC');
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, string>>({ USDC: '0'});
  const [mscaWallet, setMscaWallet] = useState<MSCAWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registerWallet = useCallback(async (username: string) => {
    setIsLoading(true);
    try {
      
      const wallet = await registerWalletWithPasskey(username);

      setMscaWallet(wallet);
      setEvmAddress(wallet.address);
      // Store in localStorage for persistence
      localStorage.setItem('msca_address', wallet.address);

    } catch (error) {
      console.error('WalletContext: Failed to register wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWallet = useCallback(async (username: string) => {
    setIsLoading(true);
    try {
      const wallet = await loginWithPasskey(username);
      setMscaWallet(wallet);
      setEvmAddress(wallet.address);
      // Store in localStorage for persistence
      localStorage.setItem('msca_address', wallet.address);
    } catch (error) {
      console.error('Failed to login wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshBalance = useCallback((token: string) => {
    // TODO: Implement balance fetching logic
  }, []);

  const value = {
    activeToken,
    refreshBalance,
    evmAddress,
    balances,
    setActiveToken: setActiveTokenState,
    mscaWallet,
    registerWallet,
    loginWallet,
    isLoading,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    // Return default values instead of throwing
    return {
      activeToken: 'USDC',
      refreshBalance: () => {},
      evmAddress: null,
      balances: { USDC: '0', ETH: '0' },
      setActiveToken: () => {},
      mscaWallet: null,
      registerWallet: async () => {},
      loginWallet: async () => {},
      isLoading: false,
    };
  }
  return context;
}
