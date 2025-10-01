export interface TransferRecipient {
  recipientId: string;
  amount: string;
}

export interface TransferResponse {
  result: {
    success: boolean;
    message?: string;
  };
}
