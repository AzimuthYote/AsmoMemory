import React from 'react';
import { Database, Check, X, Loader2 } from 'lucide-react';
import { useNotion } from '../hooks/useNotion';

interface DatabaseManagerProps {
  token: string;
}

interface Permission {
  id: string;
  name: string;
  icon: string;
  permissions: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

export default function DatabaseManager({ token }: DatabaseManagerProps) {
  const { databases, isLoadingDatabases } = useNotion(token);
  const [permissions, setPermissions] = React.useState<Record<string, Permission['permissions']>>({});

  const togglePermission = (dbId: string, permission: keyof Permission['permissions']) => {
    setPermissions(prev => ({
      ...prev,
      [dbId]: {
        ...(prev[dbId] || { read: true, create: true, update: true, delete: false }),
        [permission]: !(prev[dbId]?.[permission] ?? false),
      },
    }));
  };

  if (isLoadingDatabases) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!databases?.length) {
    return (
      <div className="text-center p-12 text-gray-400">
        No databases found. Make sure your integration token has the correct permissions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {databases.map(db => (
        <div
          key={db.id}
          className="p-6 bg-dark rounded-lg border border-primary/20 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{db.icon}</span>
            <h3 className="text-lg font-semibold">{db.name}</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(permissions[db.id] || {
              read: true,
              create: true,
              update: true,
              delete: false,
            }).map(([key, value]) => (
              <button
                key={key}
                onClick={() => togglePermission(db.id, key as keyof Permission['permissions'])}
                className={`p-4 rounded-lg border transition-colors flex items-center justify-between
                  ${value
                    ? 'bg-highlight/10 border-highlight text-highlight'
                    : 'bg-dark border-gray-700 text-gray-400'
                  }`}
              >
                <span className="capitalize">{key}</span>
                {value ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-primary/20">
            <h4 className="text-sm font-semibold mb-2">Database ID</h4>
            <code className="block p-3 bg-dark-lighter rounded text-sm text-gray-300 break-all">
              {db.id}
            </code>
          </div>
        </div>
      ))}
    </div>
  );
}