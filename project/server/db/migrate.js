import { config } from 'dotenv';
import { initDb } from './index.js';

config();

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  pin TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS notion_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  last_ping DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS database_permissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  database_id TEXT NOT NULL,
  can_read BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT true,
  can_update BOOLEAN DEFAULT true,
  can_delete BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);`;

async function migrate() {
  try {
    const db = await initDb();
    
    // Execute schema
    await db.exec(schema);
    
    // Insert default user with PIN from environment
    const pin = process.env.VITE_PIN || '0723';
    const userId = 'default-user';
    
    const userExists = await db.get('SELECT id FROM users WHERE id = ?', [userId]);
    
    if (!userExists) {
      await db.run('INSERT INTO users (id, pin) VALUES (?, ?)', [userId, pin]);
      console.log('Default user created');
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();