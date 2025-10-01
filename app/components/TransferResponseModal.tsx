import React from 'react';

interface TransferResponse {
  result: {
    success: boolean;
    message?: string;
  };
}

interface TransferResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: TransferResponse | null;
}

export const TransferResponseModal: React.FC<TransferResponseModalProps> = ({
  isOpen,
  onClose,
  response,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Transfer Result</h2>
        <div className="mb-4">
          {response?.result.success ? (
            <div className="text-green-600">
              ✅ Transfer completed successfully!
            </div>
          ) : (
            <div className="text-red-600">
              ❌ Transfer failed: {response?.result.message || 'Unknown error'}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};
