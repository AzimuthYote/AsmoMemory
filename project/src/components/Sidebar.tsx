import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Key, Database, Settings, Webhook, GitCompare } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/integration-key', label: 'Integration Key', icon: Key },
  { to: '/database-config', label: 'Database Config', icon: Database },
  { to: '/property-config', label: 'Property Config', icon: Settings },
  { to: '/webhook-setup', label: 'Webhook Setup', icon: Webhook },
  { to: '/cross-referencing', label: 'Cross Referencing', icon: GitCompare }
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-dark-darker fixed left-0 top-0 border-r border-dark-lighter">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-lime mb-8">
          Asmo's Memory
        </h1>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}