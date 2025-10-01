import { useWallet } from '@/app/context/WalletContext';
import { tokenDisplayMap, TokenKey } from '../../lib/constants';
import { useState } from 'react';

export const WalletInfo = () => {
  const { evmAddress, balances, activeToken, setActiveToken, refreshBalance } =
    useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleFaucetRequest = async () => {
    if (!evmAddress) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/account/faucet?token=${activeToken}`);
      if (res.ok) {
        refreshBalance(activeToken);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundRequest = () => {
    if (!evmAddress) return;

    const appId = process.env.NEXT_PUBLIC_COINBASE_ONRAMP_APP_ID || '';

    const coinbasePayUrl = `https://pay.coinbase.com/buy/select-asset?appId=${appId}&addresses={"${evmAddress}":["base"]}&assets=["ETH"]&defaultPaymentMethod=CARD&fiatCurrency=USD&presetFiatAmount=5`;

    window.open(coinbasePayUrl, '_blank');
  };

  return (
    <div className="w-full md:w-1/2 p-4">
      <h2 className="text-lg font-semibold mb-4">Wallet Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Address</p>
          <p className="text-sm font-mono break-all overflow-hidden text-ellipsis">
            {evmAddress}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold">
              {balances[activeToken] ?? '—'}
            </p>
            <select
              value={activeToken}
              onChange={(e) => {
                setActiveToken(e.target.value as TokenKey);
                refreshBalance(e.target.value as TokenKey);
              }}
              className="px-3 py-1 rounded border text-xs sm:text-sm"
            >
              {Object.entries(tokenDisplayMap).map(([key, display]) => (
                <option key={key} value={key}>
                  {display}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
