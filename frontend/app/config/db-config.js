import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';  // Import path module to handle paths

export async function openDb() {
  return open({
    filename: join(process.cwd(), '..', 'data', 'global_incidents.db'),  // Absolute path to the DB
    driver: sqlite3.Database
  });
}
