import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Asmo's Memory</h1>
      <p className="text-gray-300 max-w-2xl">
        Configure your Notion integration and database settings to enable AI memory storage.
        Follow the steps below to get started.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {[
          {
            title: 'Setup Integration',
            description: 'Connect your Notion integration API key',
            link: '/integration-key'
          },
          {
            title: 'Configure Database',
            description: 'Link and configure your Notion databases',
            link: '/database-config'
          },
          {
            title: 'Setup Webhook',
            description: 'Configure webhook for real-time updates',
            link: '/webhook-setup'
          }
        ].map((item) => (
          <Link
            key={item.link}
            to={item.link}
            className="gradient-border group"
          >
            <div className="card h-full transition-transform group-hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 mb-4">{item.description}</p>
              <div className="flex items-center text-primary-light group-hover:text-accent-cyan transition-colors">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}