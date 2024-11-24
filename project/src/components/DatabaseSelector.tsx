import React from 'react';
import { Database, ChevronRight } from 'lucide-react';
import { NotionDatabase } from '../types/notion';

interface DatabaseSelectorProps {
  databases: NotionDatabase[];
  selectedDatabase: NotionDatabase | null;
  onSelect: (database: NotionDatabase) => void;
}

export function DatabaseSelector({ databases, selectedDatabase, onSelect }: DatabaseSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Database className="w-5 h-5" />
        Select Database
      </h2>
      
      <div className="grid gap-4">
        {databases.map((database) => (
          <button
            key={database.id}
            onClick={() => onSelect(database)}
            className={`gradient-border p-[1px] rounded-lg transition-all ${
              selectedDatabase?.id === database.id ? 'scale-[1.02]' : ''
            }`}
          >
            <div className={`card flex items-center justify-between ${
              selectedDatabase?.id === database.id ? 'bg-dark-lighter' : ''
            }`}>
              <div className="space-y-1">
                <h3 className="font-medium">{database.title}</h3>
                {database.description && (
                  <p className="text-sm text-gray-400">{database.description}</p>
                )}
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${
                selectedDatabase?.id === database.id ? 'rotate-90' : ''
              }`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}