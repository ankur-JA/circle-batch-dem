import { base, baseSepolia } from 'wagmi/chains';

export function getNetworkConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    chain: isDevelopment ? baseSepolia : base,
    rpcUrl: isDevelopment 
      ? 'https://sepolia.base.org' 
      : 'https://mainnet.base.org'
  };
}
