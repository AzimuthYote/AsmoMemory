import React, { useState, useEffect } from 'react';
import { useNotion } from '../context/NotionContext';
import { DatabaseSelector } from '../components/DatabaseSelector';
import { ManualEditor } from '../components/ManualEditor';
import { WebhookConfig as WebhookConfigComponent } from '../components/WebhookConfig';
import { NotionDatabase, WebhookConfig } from '../types/notion';
import { fetchDatabases, configureWebhook } from '../utils/api';

export function NotionSetup() {
  const { apiKey } = useNotion();
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<NotionDatabase | null>(null);
  const [manualContent, setManualContent] = useState('');
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    url: '',
    events: ['create', 'update'],
    databaseId: '',
    manualContent: ''
  });

  useEffect(() => {
    if (apiKey) {
      fetchDatabases(apiKey).then(setDatabases);
    }
  }, [apiKey]);

  const handleDatabaseSelect = (database: NotionDatabase) => {
    setSelectedDatabase(database);
    setWebhookConfig(prev => ({ ...prev, databaseId: database.id }));
  };

  const handleManualSave = () => {
    setWebhookConfig(prev => ({ ...prev, manualContent }));
  };

  const handleTestWebhook = async () => {
    if (!apiKey) return false;
    return await configureWebhook(apiKey, webhookConfig);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <DatabaseSelector
        databases={databases}
        selectedDatabase={selectedDatabase}
        onSelect={handleDatabaseSelect}
      />

      {selectedDatabase && (
        <>
          <ManualEditor
            content={manualContent}
            onChange={setManualContent}
            onSave={handleManualSave}
          />

          <WebhookConfigComponent
            config={webhookConfig}
            onChange={setWebhookConfig}
            onTest={handleTestWebhook}
          />
        </>
      )}
    </div>
  );
}