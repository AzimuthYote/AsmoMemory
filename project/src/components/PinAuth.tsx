import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface PinAuthProps {
  onAuth: (pin: string) => boolean;
}

export default function PinAuth({ onAuth }: PinAuthProps) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAuth(pin)) {
      toast.success('Welcome back!');
    } else {
      toast.error('Invalid PIN');
      setPin('');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-dark-lighter rounded-lg border border-primary/20 shadow-lg">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center">Welcome to Asmo's Memory</h1>
        <p className="text-gray-400 text-center">Enter your PIN to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-center text-2xl tracking-widest"
            placeholder="••••"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}