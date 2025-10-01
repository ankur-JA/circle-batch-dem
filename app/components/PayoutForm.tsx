import { useState } from 'react';
import { useWallet } from '@/app/context/WalletContext';
import { TransferResponseModal } from './TransferResponseModal';
import { TransferRecipient, TransferResponse } from '@/lib/types/transfer';
import { sendBatchGaslessTransfer } from '@/lib/circle-wallet';
import { parseUnits } from 'viem';

const MAX_ROWS = 100;

// Ethereum address validation regex
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

// USDC contract address on Base Sepolia testnet
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

export const PayoutForm = () => {
  const { activeToken, refreshBalance, evmAddress, mscaWallet } = useWallet();
  const [payoutRows, setPayoutRows] = useState<TransferRecipient[]>([
    { recipientId: '', amount: '' },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [transferResponse, setTransferResponse] =
    useState<TransferResponse | null>(null);

  const validateAddresses = (rows: TransferRecipient[]) => {
    const invalidAddresses = rows
      .map((row, index) => ({ address: row.recipientId, index }))
      .filter(({ address }) => address && !ADDRESS_REGEX.test(address));

    if (invalidAddresses.length > 0) {
      setError(
        `Invalid address format in row ${invalidAddresses[0].index + 1}: ${invalidAddresses[0].address}`
      );
      return false;
    }
    return true;
  };

  const addRow = () => {
    if (payoutRows.length >= MAX_ROWS) {
      setError(`Maximum of ${MAX_ROWS} rows allowed`);
      return;
    }
    setPayoutRows([...payoutRows, { recipientId: '', amount: '' }]);
    setError(null);
  };

  const updateRow = (
    index: number,
    field: keyof TransferRecipient,
    value: string
  ) => {
    const newRows = [...payoutRows];
    newRows[index][field] = value;
    setPayoutRows(newRows);
    setError(null);
  };

  const removeRow = (index: number) => {
    if (payoutRows.length > 1) {
      setPayoutRows(payoutRows.filter((_, i) => i !== index));
      setError(null);
    } else {
      setPayoutRows([{ recipientId: '', amount: '' }]);
    }
  };


  const handleConfirm = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!evmAddress) {
        throw new Error('No wallet connected');
      }

      if (!mscaWallet?.bundlerClient) {
        throw new Error('Wallet not initialized. Please refresh the page.');
      }

      if (!validateAddresses(payoutRows)) {
        setIsSubmitting(false);
        return;
      }

      // Convert recipients to the format needed for batch transfer
      const recipients = payoutRows.map((row) => ({
        address: row.recipientId,
        amount: parseUnits(row.amount, 6), // USDC has 6 decimals
      }));

      console.log('Sending batch transfer:', recipients);

      // Send batch gasless transfer using Circle SDK
      const txHash = await sendBatchGaslessTransfer(
        mscaWallet.bundlerClient,
        recipients,
        USDC_ADDRESS
      );

      console.log('Batch transfer successful! TX Hash:', txHash);

      const transferResponse: TransferResponse = {
        result: {
          success: true,
          message: `Transfer completed! Transaction hash: ${txHash}`,
        },
      };

      setTransferResponse(transferResponse);
      setShowResults(true);
      refreshBalance(activeToken);
      setPayoutRows([{ recipientId: '', amount: '' }]);
    } catch (error) {
      console.error('Transfer error:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col items-end">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 w-full max-w-[800px]">
              <h2 className="text-lg font-semibold">Payout Recipients</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={addRow}
                  disabled={isSubmitting}
                  className="font-bold bg-[#0052ff] text-white rounded-[30px] border-none outline-none cursor-pointer px-4 py-1.5 text-xs sm:text-sm w-fit max-w-[120px] sm:max-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Row
                </button>
              </div>
            </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded w-full max-w-[800px]">
            {error}
          </div>
        )}

        <div className="space-y-2 w-full max-w-[800px]">
          {payoutRows.map((row, index) => (
            <div key={index} className="flex gap-1 sm:gap-2 items-center">
              <input
                type="text"
                placeholder="Recipient Address (0x...)"
                value={row.recipientId}
                onChange={(e) =>
                  updateRow(index, 'recipientId', e.target.value)
                }
                className="flex-1 p-1 sm:p-2 border rounded text-sm sm:text-base min-w-0 disabled:opacity-50 font-mono"
                disabled={isSubmitting}
              />
              <input
                type="number"
                placeholder="Amount"
                value={row.amount}
                onChange={(e) => updateRow(index, 'amount', e.target.value)}
                className="w-48 sm:w-64 p-1 sm:p-2 border rounded text-sm sm:text-base disabled:opacity-50"
                disabled={isSubmitting}
              />
              <button
                onClick={() => removeRow(index)}
                disabled={isSubmitting}
                className="px-3 py-1.5 sm:py-2 bg-red-500 text-white rounded text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {payoutRows.length} of {MAX_ROWS} rows used
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="font-bold bg-[#0052ff] text-white rounded-[30px] border-none outline-none cursor-pointer mt-4 px-6 py-2 text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Confirm Transfer'
          )}
        </button>
      </div>

      <TransferResponseModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        response={transferResponse}
      />
    </div>
  );
};
