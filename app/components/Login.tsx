import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const { registerWallet, loginWallet } = useWallet();

  // Check if environment variables are set
  const hasCircleConfig = 
    typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_CIRCLE_CLIENT_KEY && 
    process.env.NEXT_PUBLIC_CIRCLE_CLIENT_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    try {
      
      if (mode === 'register') {
        
        await registerWallet(username);
        
      } else {
        
        await loginWallet(username);
        
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {mode === 'register' ? 'Create MSCA Wallet' : 'Login to Wallet'}
      </h1>
      
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-2 px-4 rounded ${
            mode === 'register'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Register
        </button>
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 px-4 rounded ${
            mode === 'login'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Login
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Enter your username"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          {mode === 'register' ? 'Create Wallet with Passkey' : 'Login with Passkey'}
        </button>
      </form>
    </div>
  );
};
