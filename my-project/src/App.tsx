import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { IntegrationKey } from './pages/IntegrationKey';
import { DatabaseConfig } from './pages/DatabaseConfig';
import { WebhookSetup } from './pages/WebhookSetup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark flex">
        <Sidebar />
        <main className="flex-1 pl-64">
          <div className="animate-gradient p-1">
            <div className="min-h-screen bg-dark-darker">
              <div className="container mx-auto px-8 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/integration-key" element={<IntegrationKey />} />
                  <Route path="/database-config" element={<DatabaseConfig />} />
                  <Route path="/webhook-setup" element={<WebhookSetup />} />
                  <Route path="/property-config" element={<div>Property Config</div>} />
                  <Route path="/cross-referencing" element={<div>Cross Referencing</div>} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;