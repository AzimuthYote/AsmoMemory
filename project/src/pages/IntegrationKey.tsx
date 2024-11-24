import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { validateApiKey } from '../utils/api';
import { useNotion } from '../context/NotionContext';

export function IntegrationKey() {
  const navigate = useNavigate();
  const { setApiKey, setIsValidated } = useNotion();
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleValidateKey = async () => {
    if (!inputKey.trim()) {
      setStatus('error');
      setMessage('API Key is required');
      return;
    }

    if (!inputKey.startsWith('secret_')) {
      setStatus('error');
      setMessage('API Key must start with "secret_"');
      return;
    }

    setStatus('loading');
    setMessage('Validating your API key...');

    try {
      const isValid = await validateApiKey(inputKey);
      
      if (isValid) {
        setStatus('success');
        setMessage('API Key validated successfully!');
        setApiKey(inputKey);
        setIsValidated(true);
        setTimeout(() => navigate('/database-config'), 1500);
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Invalid API key. Please check your key and try again.');
      setApiKey(null);
      setIsValidated(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Key className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Integration Key</h1>
      </div>

      <p className="text-gray-300">
        Enter your Notion API key to connect Asmo's Memory with your Notion workspace.
        The key will be securely stored and used for database operations.
      </p>

      <div className="gradient-border">
        <div className="card space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300">
              Notion API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your Notion API Key"
              className="input-primary w-full"
              disabled={status === 'loading'}
            />
          </div>

          <button
            onClick={handleValidateKey}
            disabled={!inputKey || status === 'loading'}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Key className="w-5 h-5" />
            )}
            <span>Validate Key</span>
          </button>

          {status !== 'idle' && (
            <div className={`flex items-center space-x-2 ${
              status === 'success' ? 'text-green-400' : 
              status === 'error' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : status === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : null}
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400">
        <h2 className="font-medium text-gray-300 mb-2">How to get your API Key:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-accent-cyan">Notion Integrations</a></li>
          <li>Click "New integration"</li>
          <li>Name your integration and select the workspace</li>
          <li>Copy the "Internal Integration Token"</li>
        </ol>
      </div>
    </div>
  );
}