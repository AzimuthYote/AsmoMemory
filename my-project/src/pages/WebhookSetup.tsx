import React, { useState } from 'react';
import { Webhook, CheckCircle, AlertCircle, Loader2, Radio, Headphones } from 'lucide-react';
import { useNotion } from '../context/NotionContext';
import { WebhookUrl } from '../components/WebhookUrl';

interface WebhookConfig {
  url: string;
  events: string[];
  databaseId: string;
}

export function WebhookSetup() {
  const { apiKey } = useNotion();
  const [config, setConfig] = useState<WebhookConfig>({
    url: '',
    events: ['create', 'update', 'delete'],
    databaseId: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [detectedWebhook, setDetectedWebhook] = useState('');

  const startListening = async () => {
    setIsListening(true);
    setStatus('loading');
    setMessage('Listening for incoming webhook...');

    try {
      const response = await fetch('/api/webhook/listen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await response.json();

      if (data.success && data.webhookUrl) {
        setDetectedWebhook(data.webhookUrl);
        setConfig(prev => ({ ...prev, url: data.webhookUrl }));
        setStatus('success');
        setMessage('Webhook URL detected successfully!');
      } else {
        setStatus('error');
        setMessage('No webhook detected during listening period');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to detect webhook');
    } finally {
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Configuring webhook...');

    try {
      const response = await fetch('/api/webhook/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(config)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Webhook configured successfully!');
      } else {
        throw new Error(data.error || 'Failed to configure webhook');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to configure webhook');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Webhook className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Webhook Setup</h1>
      </div>

      <p className="text-gray-300">
        Configure a webhook to enable real-time synchronization between your Notion database and CustomGPT.
      </p>

      <WebhookUrl />

      <div className="gradient-border">
        <div className="card space-y-4">
          <div className="flex items-center space-x-2">
            <Headphones className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Listening Mode</h3>
          </div>
          
          <p className="text-gray-400 text-sm">
            Start listening mode to automatically detect the webhook URL from your CustomGPT instance.
          </p>

          <button
            onClick={startListening}
            disabled={isListening}
            className="btn-secondary w-full flex items-center justify-center space-x-2"
          >
            {isListening ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Radio className="w-5 h-5" />
            )}
            <span>{isListening ? 'Listening...' : 'Start Listening'}</span>
          </button>

          {detectedWebhook && (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Detected webhook URL: {detectedWebhook}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="gradient-border">
          <div className="card space-y-4">
            <div className="space-y-2">
              <label htmlFor="url" className="block text-sm font-medium text-gray-300">
                Target URL
              </label>
              <input
                id="url"
                type="url"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://your-webhook-url.com"
                className="input-primary w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="databaseId" className="block text-sm font-medium text-gray-300">
                Database ID
              </label>
              <input
                id="databaseId"
                type="text"
                value={config.databaseId}
                onChange={(e) => setConfig({ ...config, databaseId: e.target.value })}
                placeholder="Enter your database ID"
                className="input-primary w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Events to Monitor
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['create', 'update', 'delete'].map((event) => (
                  <label key={event} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.events.includes(event)}
                      onChange={(e) => {
                        const events = e.target.checked
                          ? [...config.events, event]
                          : config.events.filter(e => e !== event);
                        setConfig({ ...config, events });
                      }}
                      className="form-checkbox text-primary rounded border-gray-600 bg-dark-lighter"
                    />
                    <span className="text-sm capitalize">{event}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || !config.url || !config.databaseId}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Webhook className="w-5 h-5" />
              )}
              <span>Configure Webhook</span>
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
      </form>

      <div className="text-sm text-gray-400">
        <h2 className="font-medium text-gray-300 mb-2">How to find your Database ID:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open your Notion database in the browser</li>
          <li>Look at the URL: notion.so/workspace/<span className="text-primary-light">database-id</span></li>
          <li>Copy the 32-character string after the last slash</li>
        </ol>
      </div>
    </div>
  );
}