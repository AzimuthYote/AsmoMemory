import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Link as LinkIcon } from 'lucide-react';

export function WebhookUrl() {
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    // Generate the webhook URL based on the current environment
    const baseUrl = window.location.origin;
    setWebhookUrl(`${baseUrl}/api/webhook`);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy webhook URL:', err);
    }
  };

  return (
    <div className="gradient-border">
      <div className="card space-y-4">
        <div className="flex items-center space-x-2">
          <LinkIcon className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Your Webhook URL</h3>
        </div>
        
        <p className="text-gray-400 text-sm">
          This is your unique webhook URL. Use it to receive real-time updates from your Notion database.
        </p>
        
        <div className="flex items-center space-x-2">
          <code className="flex-1 block p-3 bg-dark rounded-lg font-mono text-sm text-gray-300 overflow-x-auto">
            {webhookUrl}
          </code>
          <button
            onClick={copyToClipboard}
            className="btn-secondary p-2 h-[42px] w-[42px] flex items-center justify-center"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="text-sm text-gray-400 space-y-2">
          <p className="font-medium text-gray-300">This webhook endpoint will:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Receive real-time updates from Notion</li>
            <li>Process database changes automatically</li>
            <li>Trigger configured actions based on events</li>
          </ul>
        </div>
      </div>
    </div>
  );
}