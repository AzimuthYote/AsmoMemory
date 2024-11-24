import { useState, useEffect } from 'react';
import { auth, notion } from '../lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notionToken, setNotionToken] = useState(notion.getToken() || '');

  useEffect(() => {
    const session = auth.getSession();
    setIsAuthenticated(!!session);
  }, []);

  const login = (pin: string) => {
    if (auth.validatePin(pin)) {
      auth.createSession();
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    auth.clearSession();
    setIsAuthenticated(false);
  };

  const updateNotionToken = (token: string) => {
    if (notion.saveToken(token)) {
      setNotionToken(token);
      return true;
    }
    return false;
  };

  return {
    isAuthenticated,
    notionToken,
    login,
    logout,
    updateNotionToken
  };
}