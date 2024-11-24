import React from 'react';
import { Radio, Copy, Power, Clock } from 'lucide-react';
import { useWebhook } from '../hooks/useWebhook';
import toast from 'react-hot-toast';

export default function WebhookManager() {
  const { isListening, lastPing, webhookUrl, startListening, stopListening } = useWebhook();

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  const formatLastPing = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      -Math.round((Date.now() - date.getTime()) / 1000),
      'seconds'
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Webhook URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={webhookUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-dark border border-primary/20 rounded-lg focus:outline-none font-mono text-sm"
          />
          <button
            onClick={copyWebhookUrl}
            className="px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg transition-colors"
            title="Copy webhook URL"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 bg-dark rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className={`w-5 h-5 ${isListening ? 'text-highlight animate-pulse-slow' : 'text-gray-400'}`} />
            <span>Webhook Listener</span>
          </div>
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
              ${isListening 
                ? 'bg-highlight hover:bg-highlight-hover' 
                : 'bg-primary hover:bg-primary-hover'
              }`}
          >
            <Power size={20} />
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>

        {lastPing && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={16} />
            <span>Last ping: {formatLastPing(lastPing)}</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-dark rounded-lg border border-primary/20">
        <h3 className="font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
          <li>Copy the webhook URL above</li>
          <li>Configure your CustomGPT to use this URL for memory actions</li>
          <li>Click "Start Listening" to begin receiving events</li>
          <li>Test the connection by sending a request from CustomGPT</li>
        </ol>
      </div>
    </div>
  );
}