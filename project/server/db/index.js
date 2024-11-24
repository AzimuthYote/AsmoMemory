import { initBackend } from '@vlcn.io/crsqlite-wasm';

let db = null;

export async function initDb() {
  if (db) return db;
  
  const sqlite = await initBackend();
  db = await sqlite.open(':memory:');
  
  return db;
}

export async function getDb() {
  if (!db) {
    return await initDb();
  }
  return db;
}