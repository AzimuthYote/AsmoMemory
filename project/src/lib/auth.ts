import Cookies from 'js-cookie';
import { z } from 'zod';

const SESSION_COOKIE = 'asmo_session';
const TOKEN_COOKIE = 'notion_token';

// Session duration in days
const SESSION_DURATION = 7;

// Validate PIN format
export const pinSchema = z.string().length(4).regex(/^\d+$/);

// Validate Notion token format - Updated to be more permissive
export const notionTokenSchema = z.string().startsWith('secret_');

// Session management
export const auth = {
  createSession: () => {
    const sessionId = crypto.randomUUID();
    Cookies.set(SESSION_COOKIE, sessionId, { 
      expires: SESSION_DURATION,
      secure: true,
      sameSite: 'strict'
    });
    return sessionId;
  },

  getSession: () => {
    return Cookies.get(SESSION_COOKIE);
  },

  clearSession: () => {
    Cookies.remove(SESSION_COOKIE);
    Cookies.remove(TOKEN_COOKIE);
  },

  validatePin: (pin: string) => {
    try {
      pinSchema.parse(pin);
      return pin === import.meta.env.VITE_PIN;
    } catch {
      return false;
    }
  }
};

// Notion token management
export const notion = {
  saveToken: (token: string) => {
    try {
      notionTokenSchema.parse(token);
      Cookies.set(TOKEN_COOKIE, token, {
        expires: SESSION_DURATION,
        secure: true,
        sameSite: 'strict'
      });
      return true;
    } catch {
      return false;
    }
  },

  getToken: () => {
    return Cookies.get(TOKEN_COOKIE);
  },

  clearToken: () => {
    Cookies.remove(TOKEN_COOKIE);
  }
};