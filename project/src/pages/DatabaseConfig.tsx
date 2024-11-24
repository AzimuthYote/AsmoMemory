import React, { useEffect, useState } from 'react';
import { Database, AlertCircle, Loader2 } from 'lucide-react';
import { useNotion } from '../context/NotionContext';
import { fetchDatabases } from '../utils/api';

interface DatabaseProperty {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface NotionDatabase {
  id: string;
  title: string;
  properties: DatabaseProperty[];
}

export function DatabaseConfig() {
  const { apiKey } = useNotion();
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDatabases = async () => {
      if (!apiKey) return;
      
      try {
        setLoading(true);
        const data = await fetchDatabases(apiKey);
        setDatabases(data);
        setError(null);
      } catch (err) {
        setError('Failed to load databases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDatabases();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-400 p-4 bg-red-400/10 rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Database className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Database Configuration</h1>
      </div>

      <div className="grid gap-6">
        {databases.map((database) => (
          <div key={database.id} className="gradient-border">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">{database.title}</h3>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-400">Properties</h4>
                <div className="grid gap-2">
                  {database.properties.map((prop) => (
                    <div
                      key={prop.id}
                      className="flex items-center justify-between p-3 bg-dark rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{prop.name}</p>
                        <p className="text-sm text-gray-400">{prop.type}</p>
                      </div>
                      {prop.description && (
                        <p className="text-sm text-gray-400">{prop.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}