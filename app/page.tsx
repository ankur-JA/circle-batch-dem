"use client";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Payout } from "./components/Payout";
import { Login } from "./components/Login";
import { useWallet } from "./context/WalletContext";

export default function Home() {
  const { evmAddress, isLoading } = useWallet();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pb-32 flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : evmAddress ? (
          <Payout />
        ) : (
          <Login />
        )}
      </div>
      <Footer />
    </div>
  );
}
