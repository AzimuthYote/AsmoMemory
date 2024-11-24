import { useState, useEffect } from 'react';
import { webhookManager } from '../lib/webhook';
import { NotionClient } from '../lib/notion';
import toast from 'react-hot-toast';

export function useWebhook(notionClient?: NotionClient) {
  const [isListening, setIsListening] = useState(false);
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const webhookUrl = webhookManager.getWebhookUrl();

  useEffect(() => {
    if (notionClient) {
      webhookManager.setNotionClient(notionClient);
    }
  }, [notionClient]);

  useEffect(() => {
    const unsubscribe = webhookManager.subscribe((event) => {
      switch (event.type) {
        case 'ping':
          setLastPing(new Date());
          toast.success('Received ping from CustomGPT');
          break;
        case 'request':
          toast.success(`Processed ${event.request.type} request successfully`);
          break;
        case 'error':
          toast.error(`Error: ${event.error.message}`);
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  const startListening = () => {
    webhookManager.connect();
    setIsListening(true);
    toast.success('Started listening for webhook events');
  };

  const stopListening = () => {
    webhookManager.disconnect();
    setIsListening(false);
    toast.success('Stopped listening for webhook events');
  };

  return {
    isListening,
    lastPing,
    webhookUrl,
    startListening,
    stopListening,
  };
}