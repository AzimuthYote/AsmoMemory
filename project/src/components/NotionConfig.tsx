import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNotion } from '../hooks/useNotion';
import toast from 'react-hot-toast';

interface NotionConfigProps {
  token: string;
  onTokenChange: (token: string) => void;
}

export default function NotionConfig({ token, onTokenChange }: NotionConfigProps) {
  const [showToken, setShowToken] = useState(false);
  const [inputValue, setInputValue] = useState(token);
  const { validateToken, isValidating, databases } = useNotion(token);

  useEffect(() => {
    setInputValue(token);
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onTokenChange(value);
  };

  const handleSave = async () => {
    if (!inputValue.startsWith('secret_')) {
      toast.error('Invalid token format. Token should start with "secret_"');
      return;
    }
    validateToken();
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type={showToken ? 'text' : 'password'}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your Notion integration token"
          className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg 
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary 
            transition-colors text-gray-100 placeholder-gray-500"
          spellCheck="false"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShowToken(!showToken)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
            hover:text-white transition-colors p-1"
        >
          {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {databases ? `${databases.length} databases found` : 'Enter your integration token'}
        </span>
        <button
          onClick={handleSave}
          disabled={!inputValue || isValidating}
          className="px-4 py-2 bg-secondary hover:bg-secondary-hover 
            disabled:opacity-50 disabled:cursor-not-allowed rounded-lg 
            transition-colors flex items-center gap-2"
        >
          {isValidating && <Loader2 size={20} className="animate-spin" />}
          Validate & Save
        </button>
      </div>
    </div>
  );
}