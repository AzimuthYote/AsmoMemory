import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Brain, Key, Lock, Webhook, LogOut } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import PinAuth from './components/PinAuth';
import NotionConfig from './components/NotionConfig';
import WebhookManager from './components/WebhookManager';
import DatabaseManager from './components/DatabaseManager';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, notionToken, login, logout, updateNotionToken } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark text-gray-100 flex items-center justify-center p-4">
        <PinAuth onAuth={login} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-dark text-gray-100">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-dark-lighter p-6 border-b border-primary/20">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Asmo's Memory
              </h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-dark hover:bg-dark-lighter rounded-lg border border-primary/20 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6 space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Notion Integration */}
            <section className="bg-dark-lighter p-6 rounded-lg border border-primary/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Key className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Notion Integration</h2>
              </div>
              <NotionConfig
                token={notionToken}
                onTokenChange={updateNotionToken}
              />
            </section>

            {/* Webhook Configuration */}
            <section className="bg-dark-lighter p-6 rounded-lg border border-primary/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Webhook className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-semibold">Webhook Settings</h2>
              </div>
              <WebhookManager />
            </section>
          </div>

          {/* Database Management */}
          {notionToken && (
            <section className="bg-dark-lighter p-6 rounded-lg border border-primary/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-semibold">Database Management</h2>
              </div>
              <DatabaseManager token={notionToken} />
            </section>
          )}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;