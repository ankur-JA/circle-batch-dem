import { NextResponse } from "next/server";
import axios from "axios";
import { Interface, parseUnits } from "ethers"; // v6 style imports
import { v4 as uuidv4 } from "uuid";

const API_BASE = "https://api.circle.com/v1";

export async function POST() {
  try {
    const recipients = [
      { address: "0x1111111111111111111111111111111111111111", amount: "5.0" },
      { address: "0x2222222222222222222222222222222222222222", amount: "10.0" },
      { address: "0x3333333333333333333333333333333333333333", amount: "2.5" },
    ];

    // Define ERC-20 transfer ABI
    const transferAbi = ["function transfer(address,uint256)"];
    const iface = new Interface(transferAbi);

    const usdcAddress = process.env.USDC_CONTRACT_ADDRESS!;
    const batchCalls: Array<[string, string, string]> = [];

    for (const r of recipients) {
      // Convert amount string (like "5.0") into USDC units (6 decimals)
      const amountUnits = parseUnits(r.amount, 6).toString();
      const calldata = iface.encodeFunctionData("transfer", [r.address, amountUnits]);
      batchCalls.push([usdcAddress, "0", calldata]);
    }

    const body = {
      idempotencyKey: uuidv4(),
      walletId: process.env.WALLET_ID!,
      feeLevel: "MEDIUM",
      contractAddress: process.env.MSCA_CONTRACT_ADDRESS!,
      abiFunctionSignature: "executeBatch((address,uint256,bytes)[])",
      abiParameters: [batchCalls],
      entitySecretCiphertext: process.env.ENTITY_SECRET_CIPHERTEXT!,
    };

    const res = await axios.post(
      `${API_BASE}/w3s/developer/transactions/contractExecution`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Batch execution error:", err.response?.data ?? err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
