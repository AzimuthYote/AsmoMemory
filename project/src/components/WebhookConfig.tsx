import React, { useState } from 'react';
import { Webhook, Check, AlertCircle } from 'lucide-react';
import { WebhookConfig } from '../types/notion';

interface WebhookConfigProps {
  config: WebhookConfig;
  onChange: (config: WebhookConfig) => void;
  onTest: () => Promise<boolean>;
}

export function WebhookConfig({ config, onChange, onTest }: WebhookConfigProps) {
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTest = async () => {
    const success = await onTest();
    setTestStatus(success ? 'success' : 'error');
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Webhook className="w-5 h-5" />
        Webhook Configuration
      </h2>

      <div className="gradient-border p-[1px] rounded-lg">
        <div className="card space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Webhook URL</label>
            <input
              type="url"
              value={config.url}
              onChange={(e) => onChange({ ...config, url: e.target.value })}
              placeholder="https://api.example.com/webhook"
              className="input-primary w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Events to Monitor</label>
            <div className="grid grid-cols-3 gap-2">
              {['create', 'update', 'delete'].map((event) => (
                <label key={event} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.events.includes(event)}
                    onChange={(e) => {
                      const events = e.target.checked
                        ? [...config.events, event]
                        : config.events.filter(e => e !== event);
                      onChange({ ...config, events });
                    }}
                    className="rounded border-gray-600 bg-dark-lighter text-primary focus:ring-primary"
                  />
                  <span className="text-sm capitalize">{event}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleTest}
            className={`btn-secondary w-full flex items-center justify-center gap-2 ${
              testStatus === 'success' ? 'border-green-500' :
              testStatus === 'error' ? 'border-red-500' : ''
            }`}
          >
            {testStatus === 'success' ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : testStatus === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <Webhook className="w-4 h-4" />
            )}
            Test Webhook
          </button>
        </div>
      </div>
    </div>
  );
}