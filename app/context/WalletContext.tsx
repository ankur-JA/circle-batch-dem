'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
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
  logout: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [activeToken, setActiveTokenState] = useState('USDC');
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, string>>({ USDC: '0'});
  const [mscaWallet, setMscaWallet] = useState<MSCAWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedAddress = localStorage.getItem('msca_address');
        const savedUsername = localStorage.getItem('msca_username');
        const sessionExpiry = localStorage.getItem('msca_session_expiry');

        if (savedAddress && savedUsername && sessionExpiry) {
          const expiryTime = parseInt(sessionExpiry);
          const now = Date.now();

          // Check if session is still valid (within 1 hour)
          if (now < expiryTime) {
            console.log('Restoring session for:', savedUsername);
            setEvmAddress(savedAddress);
            
            // Re-authenticate to restore full wallet functionality
            try {
              console.log('Re-authenticating wallet...');
              const wallet = await loginWithPasskey(savedUsername);
              setMscaWallet(wallet);
              console.log('Wallet re-authenticated successfully');
            } catch (authError) {
              console.error('Failed to re-authenticate wallet:', authError);
              // If re-auth fails, clear session and show login
              localStorage.removeItem('msca_address');
              localStorage.removeItem('msca_username');
              localStorage.removeItem('msca_session_expiry');
              setEvmAddress(null);
            }
          } else {
            console.log('Session expired, clearing data');
            localStorage.removeItem('msca_address');
            localStorage.removeItem('msca_username');
            localStorage.removeItem('msca_session_expiry');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const registerWallet = useCallback(async (username: string) => {
    console.log('WalletContext: registerWallet called with username:', username);
    setIsLoading(true);
    try {
      console.log('WalletContext: Calling registerWalletWithPasskey...');
      const wallet = await registerWalletWithPasskey(username);
      console.log('WalletContext: Wallet created:', wallet);
      console.log('WalletContext: Wallet address:', wallet.address);
      
      setMscaWallet(wallet);
      setEvmAddress(wallet.address);
      
      // Store in localStorage with 1 hour expiry
      const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour from now
      localStorage.setItem('msca_address', wallet.address);
      localStorage.setItem('msca_username', username);
      localStorage.setItem('msca_session_expiry', expiryTime.toString());
      
      console.log('WalletContext: State updated, evmAddress should now be:', wallet.address);
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
      
      // Store in localStorage with 1 hour expiry
      const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour from now
      localStorage.setItem('msca_address', wallet.address);
      localStorage.setItem('msca_username', username);
      localStorage.setItem('msca_session_expiry', expiryTime.toString());
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

  const logout = useCallback(() => {
    console.log('Logging out...');
    setEvmAddress(null);
    setMscaWallet(null);
    setBalances({ USDC: '0', ETH: '0' });
    localStorage.removeItem('msca_address');
    localStorage.removeItem('msca_username');
    localStorage.removeItem('msca_session_expiry');
    console.log('Logged out successfully');
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
    logout,
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
      logout: () => {},
      isLoading: false,
    };
  }
  return context;
}
