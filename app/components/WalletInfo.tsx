import { useWallet } from '@/app/context/WalletContext';
import { tokenDisplayMap, TokenKey } from '../../lib/constants';
import { useState, useEffect } from 'react';
import { createPublicClient, http, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';

// USDC contract address on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

// ERC-20 ABI for balanceOf
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

export const WalletInfo = () => {
  const { evmAddress, activeToken, setActiveToken } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch balance from blockchain
  const fetchBalance = async () => {
    if (!evmAddress) return;
    
    setIsLoading(true);
    try {
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      if (activeToken === 'USDC') {
        const balanceResult = await client.readContract({
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [evmAddress as `0x${string}`],
        });
        
        // Format USDC (6 decimals)
        const formattedBalance = formatUnits(balanceResult, 6);
        setBalance(formattedBalance);
      } else if (activeToken === 'ETH') {
        const balanceResult = await client.getBalance({
          address: evmAddress as `0x${string}`,
        });
        
        // Format ETH (18 decimals)
        const formattedBalance = formatUnits(balanceResult, 18);
        setBalance(formattedBalance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('Error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch balance on mount and when address/token changes
  useEffect(() => {
    fetchBalance();
  }, [evmAddress, activeToken]);

  const basescanUrl = `https://sepolia.basescan.org/address/${evmAddress}`;

  return (
    <div className="w-full md:w-1/2 p-4">
      <h2 className="text-lg font-semibold mb-4">Wallet Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 mb-1">Address</p>
          <p className="text-sm font-mono break-all overflow-hidden text-ellipsis">
            {evmAddress}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold">
              {isLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                balance
              )}
            </p>
            <select
              value={activeToken}
              onChange={(e) => {
                setActiveToken(e.target.value as TokenKey);
              }}
              className="px-3 py-1 rounded border text-xs sm:text-sm"
            >
              {Object.entries(tokenDisplayMap).map(([key, display]) => (
                <option key={key} value={key}>
                  {display}
                </option>
              ))}
            </select>
            <button
              onClick={fetchBalance}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              title="Refresh balance"
            >
              🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
