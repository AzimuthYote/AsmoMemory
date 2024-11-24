import React, { createContext, useContext, useState } from 'react';

interface NotionContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isValidated: boolean;
  setIsValidated: (validated: boolean) => void;
}

const NotionContext = createContext<NotionContextType | undefined>(undefined);

export function NotionProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  return (
    <NotionContext.Provider value={{ apiKey, setApiKey, isValidated, setIsValidated }}>
      {children}
    </NotionContext.Provider>
  );
}

export function useNotion() {
  const context = useContext(NotionContext);
  if (context === undefined) {
    throw new Error('useNotion must be used within a NotionProvider');
  }
  return context;
}